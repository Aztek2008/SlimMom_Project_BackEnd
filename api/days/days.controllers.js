const Day = require("./days.schema");

class DaysControllers {
  async removeDayProducts(req, res, next) {
    try {
      const {productId, date} = req.body;

      const productsDeleted = await Day.deleteMany({productId, date});
      if (!productsDeleted.deletedCount) {
        return res.status(204).json({message: "Nothing to delete"})
      }
      return res.status(200).json({message: "Product has deleted"});
    }
    catch (error) {
      next(error);
    }
  }

  async addProductToDay(req, res, next) {
    try {
      const {user, body: {productId, weight, date}} = req;
      const userId = "5fc0411fc3e6c64158f8a6e9"; // delete after login; 5d51694802b2373622ff552d, 5d51694802b2373622ff5534 for products
      const day = new Day({
        productId,
        weight,
        date,
        // userId: user._id, after implement login, and include authorize
        userId,
      });

      const savedDay = await day.save();
      return res.status(201).json(savedDay);
    }
    catch (error) {
      next(error);
    }
  }
}

module.exports = new DaysControllers();