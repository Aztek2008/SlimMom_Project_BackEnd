const express = require("express");

const daysController = require("../days/days.controllers");
const userController = require("../users/users.controllers");

const daysRouter = express.Router();

daysRouter.delete("/",
  userController.authorize,
  daysController.removeDayProducts,
);

daysRouter.post("/",
  daysController.validateProduct, 
  userController.authorize,
  daysController.addProductToDay,
);

daysRouter.get("/:date",
  userController.authorize,
  daysController.getDayInfo
);

module.exports = daysRouter;