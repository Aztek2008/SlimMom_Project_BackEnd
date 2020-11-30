const request = require("supertest");
const mongoose = require("mongoose");
const User = require("../users/users.schema");
const StartServer = require("../server");

const testServer = new StartServer();
testServer.initSevices();

const app = testServer.getServer();

describe("Correct work of endpoint /users", () => {
  beforeAll(done => {
    done()
  });
  afterAll(done => {
    mongoose.connection.close()
    done()
  });
  let userResponse, token;
  let userRequest = {
    name: "Dalton Trambo",
    login: "dalton-trambo@gmail.com",
    password: "111111"
  }
  describe("POST /users/register", () => {
    describe("When user with such login does NOT exist", () => {
      it("should return 201, success user's creating", async () => {
        const response = await request(app)
          .post("/users/register")
          .set('Content-Type', 'application/json')
          .send({
            ...userRequest
          })
          .expect(201)
        userResponse = response.body;
      });
      afterAll(async () => {
        await User.findByIdAndDelete(userResponse.user._id);
      });
    });

    describe("When such login already exist", () => {
      beforeAll(async () => {
        const response = await request(app)
          .post("/users/register")
          .set('Content-Type', 'application/json')
          .send({
            ...userRequest
          })
          .expect(201)
        userResponse = response.body;
      });
      afterAll(async () => {
        await User.findByIdAndDelete(userResponse.user._id);
      });

      it("should return 409, such login in use", async () => {
        await request(app)
          .post("/users/register")
          .set('Content-Type', 'application/json')
          .send({
            ...userRequest
          })
          .expect(409)
      });
    });
  });

  describe("POST /users/login", () => {
    beforeAll(async () => {
      const response = await request(app)
        .post("/users/register")
        .set('Content-Type', 'application/json')
        .send({
          ...userRequest
        })
        .expect(201);
      userResponse = response.body;
    });
    afterAll(async () => {
      await User.findByIdAndDelete(userResponse.user._id);
    });

    it("should return 200", async () => {
      const loginResponse = await request(app)
        .post("/users/login")
        .set('Content-Type', 'application/json')
        .send({
          login: userRequest.login,
          password: userRequest.password
        })
        .expect(200);
      expect(loginResponse.body).toHaveProperty("token");
      expect(loginResponse.body).toHaveProperty("user");
    });
    it ("should return 404", async () => {
      await request(app)
        .post("/users/login")
        .set('Content-Type', 'application/json')
        .send({
          login: `abra-kadabra${Date.now()}`,
          password: userRequest.password
        })
        .expect(404);
    });
    it ("should return 404", async () => {
      await request(app)
        .post("/users/login")
        .set('Content-Type', 'application/json')
        .send({
          login: userRequest.login,
          password: `password${Date.now()}`
        })
        .expect(404);
    });
  });

  describe("PATCH /users/logout", () => {
    beforeAll(async () => {
      const registerResponse = await request(app)
        .post("/users/register")
        .set('Content-Type', 'application/json')
        .send({
          ...userRequest
        })
        .expect(201);
      userResponse = registerResponse.body;
      const loginResponse = await request(app)
        .post("/users/login")
        .set('Content-Type', 'application/json')
        .send({
          login: userRequest.login,
          password: userRequest.password
        })
        .expect(200);
      token = loginResponse.body.token;
    });
    afterAll(async () => {
      await User.findByIdAndDelete(userResponse.user._id);
    });

    it ("should return 204", async () => {
      console.log(userResponse.token)
      await request(app)
        .patch("/users/logout")
        .set("Authorization", "Bearer " + token)
        .expect(204);
    });
  });
});