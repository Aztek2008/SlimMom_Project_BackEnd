const Joi = require("joi");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const { UnauthorizedError } = require("../errors/ErrorMessage");
const UserSchema = require("./users.schema");
const { hashPassword, calcDailyCalories } = require("./user.helpers");
const {
  getNotAllowedCategoryProducts,
} = require("../products/products.helpers");

require("dotenv").config();

module.exports = class UserController {
  // Registration
  static async register(req, res, next) {
    try {
      const verificationToken = uuidv4();
      const { name, login, password } = req.body;
      const userExist = await UserSchema.findOne({ login });
      if (userExist) {
        return res.status(409).json({ message: "Such login is in use" });
      }
      const newUser = await UserSchema.create({
        name,
        login,
        password: await hashPassword(password),
        verificationToken,
      });
      return res.status(201).send({
        user: {
          _id: newUser._id,
          name: newUser.name,
          login: newUser.login,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  // Validate registration data
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

  // Login
  static async login(req, res, next) {
    try {
      const { login, password } = req.body;

      const user = await UserSchema.findUserByLogin(login);
      if (!user) {
        return res.status(404).json({ message: "Login or password is wrong" });
      }

      const isPasswordValid = await bcryptjs.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(404).json({ message: "Login or password is wrong" });
      }

      const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: 2 * 24 * 60 * 60, // two days
      });
      await UserSchema.updateToken(user._id, token);

      return res.status(200).json({
        token,
        user: {
          login: user.login,
          name: user.name,
          _id: user._id,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  //Validate Token
  static async authorize(req, res, next) {
    try {
      const authorizationHeader = req.get("Authorization") || "";
      const token = authorizationHeader.replace("Bearer ", "");

      let userId;
      try {
        userId = await jwt.verify(token, process.env.JWT_SECRET).id;
      } catch (err) {
        next(new UnauthorizedError());
      }

      const user = await UserSchema.findById(userId);
      if (!user || user.token !== token) {
        throw new UnauthorizedError();
      }
      req.user = user;
      req.token = token;
      next();
    } catch (err) {
      next(err);
    }
  }

  // Get User Info
  static async getUser(req, res, next) {
    try {
      const user = req.user;
      return res.status(200).json({
        user: {
          login: user.login,
          name: user.name,
          _id: user._id,
          summary: user.summary,
          dayNormCalories: user.dayNormCalories,
          notAllowedCategories: user.notAllowedCategories,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  // logout
  static async logout(req, res, next) {
    try {
      const user = req.user;
      await UserSchema.updateToken(user._id, null);
      return res.status(204).json();
    } catch (err) {
      next(err);
    }
  }

  // Validate login data
  static validateUserLoginAndPassword(req, res, next) {
    const validationSchema = Joi.object({
      login: Joi.string().required(),
      password: Joi.string().required(),
    });
    const validationResult = validationSchema.validate(req.body);
    if (validationResult.error) {
      return res.status(400).send(validationResult.error.details);
    }
    next();
  }

  //Add summary, return notAllowed category of products, summary
  static async dailyCaloriesPrivate(req, res, next) {
    try {
      const { body, user } = req;
      const userToUpdate = await UserSchema.findByIdUpdateSummary(
        user._id,
        body
      );
      return res.status(200).json(userToUpdate);
    } catch (error) {
      next(error);
    }
  }

  // Validate calculate data
  static async validateDailyCaloriesParams(req, res, next) {
    const validationSchema = Joi.object({
      currentWeight: Joi.number().min(25).max(200).required(),
      height: Joi.number().min(80).max(215).integer().required(),
      age: Joi.number().min(10).max(125).integer().required(),
      targetWeight: Joi.number().min(25).max(180).integer().required(),
      bloodType: Joi.number().min(1).max(4).integer().required(),
    });
    const validationResult = validationSchema.validate(req.body);
    if (validationResult.error) {
      return res.status(400).send(validationResult.error.details);
    }
    next();
  }

  // Daily calories & prohibited food categories
  static async dailyCaloriesPublic(req, res, next) {
    try {
      const { currentWeight, height, age, targetWeight, bloodType } = req.body;

      const dailyCal = calcDailyCalories(
        currentWeight,
        height,
        age,
        targetWeight
      );

      const prohibitedFoodCategories = await getNotAllowedCategoryProducts(
        bloodType
      );
      return res.status(200).json({
        dayNormCalories: dailyCal,
        notAllowedCategories: prohibitedFoodCategories,
      });
    } catch (err) {
      next(err);
    }
  }
};
