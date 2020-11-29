const request = require("supertest");
const StartServer = require("../server");
const mongoose = require("mongoose");

const testServer = new StartServer();
testServer.initSevices();

const app = testServer.getServer();

// тесты актуальны без авторизации
describe("Correct work for endpoint /days", () => {
  beforeAll(done => {
    done()
  });
  afterAll(done => {
    mongoose.connection.close()
    done()
  });
  let token, dayId, date;

  describe("POST /days", () => {
    beforeEach(async () => {
      const responseLogin = await request(app)
        .post("/users/login")
        .send({
          login:"mikiteek@gmail.com",
          password: "111111"
        })
        .set("Accept", "application/json")
        .expect(200)
      token = responseLogin.body.token;
    });

    it ('should return 201', async () => {
      const responseCreate = await request(app)
        .post("/days")
        .send({
          productId:"5d51694802b2373622ff5534",
          weight: 550,
          date: "2020-11-27"
        })
        .set("Accept", "application/json")
        .set("Authorization", "Bearer " + token)
        .expect(201)
      dayId = responseCreate.body._id;
    });

  });

  describe("DELETE /days", () => {
    beforeEach (async () => {
      const responseLogin = await request(app)
        .post("/users/login")
        .send({
          login:"mikiteek@gmail.com",
          password: "111111"
        })
        .set("Accept", "application/json")
        .expect(200)
      token = responseLogin.body.token;
    });

    it ('should return 200', async () => {
      await request(app)
        .delete("/days")
        .send({
          dayId
        })
        .set("Accept", "application/json")
        .set("Authorization", "Bearer " + token)
        .expect(200)
    });
  });

  describe("GET /days", () => {
    beforeEach (async () => {
      const responseLogin = await request(app)
        .post("/users/login")
        .send({
          login:"mikiteek@gmail.com",
          password: "111111"
        })
        .set("Accept", "application/json")
        .expect(200)
      token = responseLogin.body.token;

      const responseCreate = await request(app)
        .post("/days")
        .send({
          productId:"5d51694802b2373622ff5534",
          weight: 550,
          date: "2020-11-27"
        })
        .set("Accept", "application/json")
        .set("Authorization", "Bearer " + token)
        .expect(201)
      date = responseCreate.body.date;
      dayId = responseCreate.body._id;
    });

    afterEach(async () => {
      await request(app)
        .delete("/days")
        .send({
          dayId
        })
        .set("Accept", "application/json")
        .set("Authorization", "Bearer " + token)
        .expect(200)
    })

    it ('should return 200', async () => {
      await request(app)
        .get("/days")
        .send({
          date
        })
        .set("Accept", "application/json")
        .set("Authorization", "Bearer " + token)
        .expect(200)
    });
  });
});