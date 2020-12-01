const { Router } = require("express");
const UserController = require("../users/users.controllers");
const usersRouter = Router();

//User Registration
usersRouter.post("/register", UserController.validate, UserController.register);

// Get User info
usersRouter.get("/getuser", UserController.authorize, UserController.getUser);

// Login
usersRouter.post(
  "/login",
  UserController.validateUserLoginAndPassword,
  UserController.login
);

//User Logout
usersRouter.patch("/logout", UserController.authorize, UserController.logout);

// Daily calories & prohibited food categories
usersRouter.patch(
  "/dailycalPublic",
  UserController.validateDailyCaloriesParams,
  UserController.dailyCaloriesPublic
);

//Add summary, return notAllowed category of products, summary
usersRouter.patch("/dailycalPrivate",
  UserController.authorize,
  UserController.dailyCaloriesPrivate,
);

module.exports = usersRouter;
