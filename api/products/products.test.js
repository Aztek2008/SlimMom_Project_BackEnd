const request = require("supertest");
const StartServer = require("../server");
const mongoose = require("mongoose");

const testServer = new StartServer();
testServer.initSevices();

const app = testServer.getServer();

describe("Get /products", () => {
  // const productObject = {
  //   title: expect.any(String),
  //   groupBloodNotAllowed: expect.objectContaining({
  //     1: expect.any(Boolean),
  //     2: expect.any(Boolean),
  //     3: expect.any(Boolean),
  //     4: expect.any(Boolean),
  //   }),
  //   categories: expect.arrayContaining(expect.any(String)),
  //   weight: expect.any(Number),
  //   _id: expect.any(String),
  //   calories: expect.any(Number),
  //   __v: expect.any(Number),
  // }
  //
  // const responceObject = {
  //   docs: expect.arrayContaining(expect.objectContaining(productObject)),
  //   totalDocs: expect.any(Number),
  //   limit: expect.any(Number),
  //   totalPages: expect.any(Number),
  //   page: expect.any(Number),
  //   pagingCounter: expect.any(Number),
  //   hasPrevPage: expect.any(Boolean),
  //   hasNextPage: expect.any(Boolean),
  //   prevPage: expect.any(Number | null),
  //   nextPage: expect.any(Number | null),
  // }
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

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expect.any(Object))
  });
  it('should return 404', async () => {
    const uri = encodeURI("/products?name=абра-кадабра");
    const response = await request(app).get(uri);

    expect(response.statusCode).toBe(404);
  });
});