const { Router } = require("express");
const DaysController = require("../days/days.controllers");
const daysRouter = Router();
const UserController = require("../users/users.controllers")

//Add product to specific day
daysRouter.post(
    "/", 
    UserController.authorize,
    DaysController.validateProduct, 
    DaysController.addProductToDay,
);

//Get all products by specific day
// daysRouter.get(
//     "/", 
//     DaysController.getAllDayProducts
// );

module.exports = daysRouter;