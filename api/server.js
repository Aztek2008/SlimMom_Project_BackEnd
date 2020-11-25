require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const productsRouter = require("./routes/products.routes");
// const usersRouter = require("./routers/users.routes");

const mongooseOptions = require("./utils/mongooseOptions");
const errorMiddleware = require("./errors/errorMiddleware");

module.exports = class StartServer {
  constructor() {
    this.server = null;
  }
  async start() {
    this.initServer();
    this.initMiddlewarew();
    // this.initUserRoutes();
    this.initProductRoutes();
    await this.initDataBase();
    this.initErrorMiddleware();
    this.startListening();
  }

  initServer() {
    this.server = express();
  }

  initMiddlewarew() {
    this.server.use(express.json());
    this.server.use(morgan("combined"));
    this.server.use(express.static("public"));
    this.server.use(cors({ origin: `http://localhost:${process.env.PORT}` }));
  }

  initErrorMiddleware() {
    this.server.use(errorMiddleware);
  }

  initProductRoutes() {
    this.server.use("/products", productsRouter);
  }

  initUserRoutes() {
    this.server.use("/users", usersRouter);
  }

  async initDataBase() {
    try {
      await mongoose.connect(process.env.DATABASE_URL, mongooseOptions);
      console.log("Database connection successful");
    }
    catch (error) {
      console.log(error);
      process.exit(1);
    }
  }

  startListening() {
    this.server.listen(process.env.PORT, () => {
      console.log("Start server");
    });
  }
};
