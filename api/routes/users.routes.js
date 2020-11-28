const { Router } = require("express");
const UserController = require("../users/users.controllers");
const usersRouter = Router();

//User Registration
usersRouter.post("/register", UserController.validate, UserController.register);

// Email verification

usersRouter.get("/verify/:verificationToken", UserController.verifyEmail);

// Login
usersRouter.put(
  "/login",
  UserController.validateUserLoginAndPassword,
  UserController.login
);

module.exports = usersRouter;
