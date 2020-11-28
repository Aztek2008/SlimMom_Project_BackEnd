const request = require("supertest");
const StartServer = require("../server");
const mongoose = require("mongoose");

const testServer = new StartServer();
testServer.initSevices();

const app = testServer.getServer();


describe("Get /products", () => {
  beforeAll(done => {
    done()
  });
  afterAll(done => {
    mongoose.connection.close()
    done()
  });
  it('should return 200', async () => {
    const response = await request(app).get("/products");
    expect(response.statusCode).toBe(200);
  });

  it('should return products, where name includes query', async () => {
    const uri = encodeURI("/products?name=омлет");
    const response = await request(app).get(uri);

    expect(response.body).toContainEqual({
      "title": {
        "ru": "Омлет",
        "ua": "Ямлет"
      },
      "groupBloodNotAllowed": {
        "1": true,
        "2": false,
        "3": false,
        "4": false
      },
      "categories": [
        "яйца"
      ],
      "weight": 100,
      "_id": "5d51694802b2373622ff552d",
      "calories": 184,
      "__v": 0
    });
  });
  it('should return 404', async () => {
    const uri = encodeURI("/products?name=абра-кадабра");
    const response = await request(app).get(uri);

    expect(response.statusCode).toBe(404);
  });
});