const express = require("express");

const daysController = require("./days.controllers");
const userController = require("../users/users.controllers");

const daysRouter = express.Router();

daysRouter.delete("/",
  userController.authorize,
  daysController.removeDayProducts,
);

daysRouter.post("/",
  // add middleware for validation from Natalia
  userController.authorize,
  daysController.addProductToDay,
);

module.exports = daysRouter;