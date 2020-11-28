const Day = require("./days.schema");

class DaysControllers {
  async removeDayProducts(req, res, next) {
    try {
      const {body: {productId, date}, user} = req;
      // delete after login and authorize:
      const userId = "5fc15c2c9c5ab43f18d7c429";
      const productsDeleted = await Day.deleteMany({productId, date, userId, /*userId:user._id*/});
      if (!productsDeleted.deletedCount) {
        return res.status(204).json({message: "Nothing to delete"})
      }
      return res.status(200).json({message: "Product has deleted"});
    }
    catch (error) {
      next(error);
    }
  }
  // мой вариант, так как для тестов чтоб что-то удалить, сначала нужно добавить
  // Наташе заменить на свой вариант, плюс там мож какае-то валидация будет в middleware
  // после реализации ЛОГИНА внести правки в код
  async addProductToDay(req, res, next) {
    try {
      const {user, body: {productId, weight, date}} = req;
      // products 5d51694802b2373622ff552d, 5d51694802b2373622ff5534
      // userId: 5fbfd77707f62d0d7ce6bba1, 5fc15c2c9c5ab43f18d7c429
      const userId = "5fbfd77707f62d0d7ce6bba1"; // delete after login and authorize:
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