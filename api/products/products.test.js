const request = require("supertest");
const StartServer = require("../server");

const testServer = new StartServer();
testServer.initSevices();

const app = testServer.getServer();




describe("Get /products", () => {
  it('should return 200', async () => {
    const response = await request(app).get("/products");
    console.log(response.error)
    expect(response.statusCode).toBe(200);
  });

  // it('should return products, where name includes "ban"', async () => {
  //   const response = await request(app).get("/products?name=ban");
  //
  //   expect(response.body).toContainEqual({
  //     "_id": "5fbe7afff4a3c62854d585db",
  //     "name": "banan",
  //     "energyValue": 320,
  //     "nominalWeight": 100,
  //   });
  // });
})