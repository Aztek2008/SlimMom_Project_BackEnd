require("dotenv").config();
const jwt = require("jsonwebtoken");

const { UnauthorizedError } = require("../errors/ErrorMessage");
const UserSchema = require("./users.schema");

//middleware для валидации token
async function authorize(req, res, next) {
  try {
    // 1. витягнути токен користувача з заголовка Authorization
    const authorizationHeader = req.get("Authorization") || "";
    const token = authorizationHeader.replace("Bearer ", "");

    // 2. витягнути id користувача з пейлоада або вернути користувачу
    // помилку зі статус кодом 401
    let userId;
    try {
      userId = await jwt.verify(token, process.env.JWT_SECRET).id;
    } catch (err) {
      next(new UnauthorizedError());
    }

    // 3. витягнути відповідного користувача. Якщо такого немає - викинути
    // помилку зі статус кодом 401
    // userModel - модель користувача в нашій системі
    const user = await UserSchema.findById(userId);

    if (!user || user.token !== token) {
      throw new UnauthorizedError();
    }

    // 4. Якщо все пройшло успішно - передати запис користувача і токен в req
    // і передати обробку запиту на наступний middleware
    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  authorize,
};
