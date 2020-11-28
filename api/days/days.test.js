const request = require("supertest");
const StartServer = require("../server");
const mongoose = require("mongoose");

const testServer = new StartServer();
testServer.initSevices();

const app = testServer.getServer();


describe("DELETE /days", () => {
  beforeAll(done => {
    done()
  });
  afterAll(done => {
    mongoose.connection.close()
    done()
  });
  beforeEach (async () => {
    await request(app)
      .post("/days")
      .send({
        productId:"5d51694802b2373622ff5534",
        weight: 550,
        date: "2020-11-27"
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(201)
  });

  it ('should return 200', async () => {
    await request(app)
      .delete("/days")
      .send({
        "productId":"5d51694802b2373622ff5534",
        "date": "2020-11-27",
        "userId": "5fbfd77707f62d0d7ce6bba1"
      })
      .set("Accept", "application/json")
      .expect(200)
  });
});