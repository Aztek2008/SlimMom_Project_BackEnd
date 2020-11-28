const express = require("express");

const productsController = require("../products/products.controllers");

const productsRouter = express.Router();

productsRouter.get("/",
  productsController.checkQueryParamsMiddleware,
  productsController.getProducts,
);

module.exports = productsRouter;