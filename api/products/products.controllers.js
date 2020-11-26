const Product = require("./products.schema");
const {NotFoundError} = require("../errors/ErrorMessage");

class ProductsController {
  async getProducts(req, res, next) {
    try {
      const {name} = req.query;
      const products = await Product.findByQuery(name);
      if (!products.length) {
        throw new NotFoundError();
      }
      return res.status(200).json(products);
    }
    catch (error) {
      next(error);
    }
  }


}

module.exports = new ProductsController();