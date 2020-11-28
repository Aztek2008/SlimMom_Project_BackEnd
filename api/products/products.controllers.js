const Product = require("./products.schema");
const {NotFoundError} = require("../errors/ErrorMessage");

class ProductsController {
  async getProducts(req, res, next) {
    try {
      const {name, page, limit} = req.query;
      const products = await Product.findByQuery(name, page, limit);
      if (!products.totalDocs) {
        throw new NotFoundError();
      }
      return res.status(200).json(products);
    }
    catch (error) {
      next(error);
    }
  }

  checkQueryParamsMiddleware = (req, res, next) => {
    const {page=1, limit=10} = req.query;
    if (page < 1 || limit < 1 || isNaN(page) || isNaN(limit)) {
      return res.status(400).json({message: "Bad request, check 'page' and 'limit' params"});
    }
    req.query.page = Number(page);
    req.query.limit = Number(limit);
    next();
  }
}

module.exports = new ProductsController();