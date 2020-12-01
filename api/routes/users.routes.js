const { Router } = require("express");
const UserController = require("../users/users.controllers");
const usersRouter = Router();

//User Registration
usersRouter.post("/register", UserController.validate, UserController.register);

// Email verification
// usersRouter.get("/verify/:verificationToken", UserController.verifyEmail);

// Get User info
usersRouter.get("/getuser", UserController.authorize, UserController.getUser);

// Login
usersRouter.post(
  "/login",
  UserController.validateUserLoginAndPassword,
  UserController.login
);

// Daily calories & prohibited food categories
usersRouter.post(
  "/dailycal",
  UserController.validateDailyCaloriesParams,
  UserController.dailyCalories
);

//User Logout
usersRouter.patch("/logout", UserController.authorize, UserController.logout);

//Add summary, return notAllowed category of products, summary
usersRouter.patch("/slim",
  UserController.authorize,
  UserController.getSlim,
);

module.exports = usersRouter;
