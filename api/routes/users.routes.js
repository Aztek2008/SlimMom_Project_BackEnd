const { Router } = require("express");
const UserController = require("../users/users.controllers");
const usersRouter = Router();

//User Registration
usersRouter.post(
    "users/register",
    UserController.validate,
    UserController.register,
);

module.exports = usersRouter;