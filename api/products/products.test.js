const request = require("supertest");
const StartServer = require("../server");
const mongoose = require("mongoose");
const {getNotAllowedCategoryProducts} = require("./products.helpers");

const testServer = new StartServer();
testServer.initSevices();

const app = testServer.getServer();

describe("Correct working of endpoints and functions for products", () => {
  beforeAll(done => {
    done()
  });
  afterAll(done => {
    mongoose.connection.close()
    done()
  });
  describe("GET /products", () => {
    it('should return 200', async () => {
      const response = await request(app).get("/products");
      expect(response.statusCode).toBe(200);
    });

    it('should return products, where name includes query', async () => {
      const uri = encodeURI("/products?name=омлет");
      const response = await request(app).get(uri);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("docs");
      expect(response.body).toHaveProperty("totalDocs");
      expect(response.body).toHaveProperty("limit");
      expect(response.body).toHaveProperty("totalPages");
      expect(response.body).toHaveProperty("page");
      expect(response.body).toHaveProperty("pagingCounter");
      expect(response.body).toHaveProperty("hasPrevPage");
      expect(response.body).toHaveProperty("hasNextPage");
      expect(response.body).toHaveProperty("prevPage");
      expect(response.body).toHaveProperty("nextPage");
    });
    it('should return 404', async () => {
      const uri = encodeURI("/products?name=абра-кадабра");
      const response = await request(app).get(uri);

      expect(response.statusCode).toBe(404);
    });
  });

  describe("Get all not allowed categories of products", () => {
    it("should return array of categories", async () => {
      const categories = await getNotAllowedCategoryProducts(4);
      expect(categories).toEqual(expect.arrayContaining([expect.any(String)]));
    });

    it("should return false", async () => {
      const categories = await getNotAllowedCategoryProducts(5);
      expect(categories).toBe(false);
    });
  });
});


