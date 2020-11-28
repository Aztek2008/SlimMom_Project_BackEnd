require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
// const cors = require("cors");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger.json");

const productsRouter = require("./routes/products.routes");
const usersRouter = require("./routes/users.routes");
const daysRouter = require("./routes/days.routes");

const mongooseOptions = require("./utils/mongooseOptions");
const errorMiddleware = require("./errors/errorMiddleware");

module.exports = class StartServer {
  constructor() {
    this.server = null;
  }
  async start() {
    await this.initSevices();
    this.startListening();
  }

  async initSevices() {
    this.initServer();
    this.initMiddlewarew();
    this.initUserRoutes();
    this.initProductRoutes();
    this.initDayRoutes();
    this.initSwaggerRoutes();
    await this.initDataBase();
    this.initErrorMiddleware();
  }

  getServer() {
    return this.server;
  }

  initServer() {
    this.server = express();
  }

  initMiddlewarew() {
    this.server.use(express.json());
    this.server.use(morgan("combined"));
    this.server.use(express.static("public"));
    // this.server.use(cors({ origin: `http://localhost:${process.env.PORT}` }));
  }

  initErrorMiddleware() {
    this.server.use(errorMiddleware);
  }

  initSwaggerRoutes() {
    this.server.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }

  initProductRoutes() {
    this.server.use("/products", productsRouter);
  }

  initUserRoutes() {
    this.server.use("/users", usersRouter);
  }

  initDayRoutes() {
    this.server.use("/days", daysRouter);
  }

  // initAuthRoutes() {
  //   this.server.use("/auth", authRouter);
  // }

  async initDataBase() {
    try {
      await mongoose.connect(process.env.URL, mongooseOptions);
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
