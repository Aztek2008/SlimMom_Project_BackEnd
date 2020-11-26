const Joi = require("joi");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

const { UnauthorizedError } = require("../errors/ErrorMessage");
const UserSchema = require("./users.schema");
const { hashPassword } = require('./user.helpers');

require("dotenv").config();

module.exports = class UserController {

static async register(req, res, next) {
    try {
        const verificationToken = uuidv4();
        const { name, login, password } = req.body;
        const userExist = await UserSchema.findOne({ login });
        if (userExist) {
            return res.status(409).json({ message: "Such login is in use"});
        }
        const newUser = await UserSchema.create({
            name,
            login,
            password: await hashPassword(password),
            verificationToken,
        });
        return res.status(201).send({
            user: {
                name: newUser.name,
                login: newUser.login
            },
        });
    }
    catch (err) {
        console.log(err);
        next(err)
    }
}

static async validate(req, res, next) {
    const validationSchema = Joi.object({
        name: Joi.string().required(),
        login: Joi.string().required(),
        password: Joi.string().required(),
    });
    const validationResult = validationSchema.validate(req.body);
    if (validationResult.error) {
        return res.status(400).send(validationResult.error.details);
    }
    next();
}

//middleware для валидации token
static async authorize(req, res, next) {
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
}
