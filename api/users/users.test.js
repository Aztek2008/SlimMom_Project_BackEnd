const request = require("supertest");
const mongoose = require("mongoose");
const User = require("../users/users.schema");
const StartServer = require("../server");

const {calcDailyCalories} = require("./user.helpers");
const {
  userRequest,
  summaryUserInfo,
  registerUserHelper,
  loginUserHelper,
} = require("../tests/tests.helper");

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

  describe("POST /users/register", () => {
    describe("When user with such login does NOT exist", () => {
      it("should return 201, success user's creating", async () => {
        const response = await registerUserHelper(app, 201);
        userResponse = response.body;
      });
      afterAll(async () => {
        await User.findByIdAndDelete(userResponse.user._id);
      });
    });

    describe("When such login already exist", () => {
      beforeAll(async () => {
        const response = await registerUserHelper(app, 201);
        userResponse = response.body;
      });
      afterAll(async () => {
        await User.findByIdAndDelete(userResponse.user._id);
      });

      it("should return 409, such login in use", async () => {
        const response = await registerUserHelper(app, 409);
      });
    });
  });

  describe("POST /users/login", () => {
    beforeAll(async () => {
      const response = await registerUserHelper(app, 201);
      userResponse = response.body;
    });
    afterAll(async () => {
      await User.findByIdAndDelete(userResponse.user._id);
    });

    it("should return 200", async () => {
      const loginResponse = await loginUserHelper(app, 200, userRequest.login, userRequest.password);
      expect(loginResponse.body).toHaveProperty("token");
      expect(loginResponse.body).toHaveProperty("user");
    });
    it ("should return 404", async () => {
      const loginResponse = await loginUserHelper(app, 404, `abra-kadabra${Date.now()}`, userRequest.password);
    });
    it ("should return 404", async () => {
      const loginResponse = await loginUserHelper(app, 404, userRequest.login, `password${Date.now()}`);
    });
  });

  describe("PATCH /users/logout", () => {
    beforeAll(async () => {
      const registerResponse = await registerUserHelper(app, 201);
      userResponse = registerResponse.body;
      const loginResponse = await loginUserHelper(app, 200, userRequest.login, userRequest.password);
      token = loginResponse.body.token;
    });
    afterAll(async () => {
      await User.findByIdAndDelete(userResponse.user._id);
    });

    it ("should return 204", async () => {
      await request(app)
        .patch("/users/logout")
        .set("Authorization", "Bearer " + token)
        .expect(204);
    });
  });

  describe("GET /users/getuser", () => {
    beforeAll(async () => {
      const registerResponse = await registerUserHelper(app, 201);
      userResponse = registerResponse.body;
      const loginResponse = await loginUserHelper(app, 200, userRequest.login, userRequest.password);
      token = loginResponse.body.token;
    });
    afterAll(async () => {
      await User.findByIdAndDelete(userResponse.user._id);
    });
    it ("should return 200", async () => {
      const getUserResponse = await request(app)
        .get("/users/getuser")
        .set("Authorization", "Bearer " + token)
        .expect(200);
      expect(getUserResponse.body).toHaveProperty("user");
    });
  });

  describe("PATCH /users/dailycalPublic", () => {
    it ("should return 200", async () => {
      const getCaloriesResponse = await request(app)
        .patch("/users/dailycalPublic")
        .send(summaryUserInfo)
        .expect(200);
      expect(getCaloriesResponse.body).toHaveProperty("dayNormCalories");
      expect(getCaloriesResponse.body).toHaveProperty("notAllowedCategories");
    });
  });

  describe("PATCH /users/dailycalPrivate", () => {
    beforeAll(async () => {
      const registerResponse = await registerUserHelper(app, 201);
      userResponse = registerResponse.body;
      const loginResponse = await loginUserHelper(app, 200, userRequest.login, userRequest.password);
      token = loginResponse.body.token;
    });
    afterAll(async () => {
      await User.findByIdAndDelete(userResponse.user._id);
    });

    it ("should return 200", async () => {
      const getCaloriesResponse = await request(app)
        .patch("/users/dailycalPrivate")
        .set("Authorization", "Bearer " + token)
        .send(summaryUserInfo)
        .expect(200);
      expect(getCaloriesResponse.body).toHaveProperty("name");
      expect(getCaloriesResponse.body).toHaveProperty("summary");
      expect(getCaloriesResponse.body).toHaveProperty("dayNormCalories");
      expect(getCaloriesResponse.body).toHaveProperty("notAllowedCategories");
    });
  });

  describe("Correct work function for calc daily calories", () => {
    it ("should return 1539", async () => {
      const getCalories = calcDailyCalories(summaryUserInfo.currentWeight, summaryUserInfo.height, summaryUserInfo.age, summaryUserInfo.targetWeight)
      expect(getCalories).toBe(1539);
    });
  });
});