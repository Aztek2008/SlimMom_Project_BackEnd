const express = require("express");

const productsController = require("./products.controllers");

const productsRouter = express.Router();

productsRouter.get("/",
  productsController.getProducts,
);

module.exports = productsRouter;