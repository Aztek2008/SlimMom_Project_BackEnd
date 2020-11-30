const Joi = require("joi");
const Day = require("./days.schema");
const {NotFoundError} = require("../errors/ErrorMessage");

class DaysControllers {
  async removeDayProducts(req, res, next) {
    try {
      const {body: {dayId}} = req;
      const productsDeleted = await Day.findByIdAndDelete(dayId, {projection :{_id: true}});
      if (!productsDeleted) {
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
      const day = new Day({
        productId,
        weight,
        date,
        userId: user._id,
      });

      const savedDay = await day.save();
      return res.status(201).json(savedDay);
    }
    catch (error) {
      next(error);
    }
  }

  async validateProduct (req, res, next) {
    const validSchema = Joi.object({
      productId: Joi.string().required(),
      weight: Joi.number().required(),
      date: Joi.date().required(),
    });
    const validResult = validSchema.validate(req.body);
    if (validResult.error) {
      return res.status(400).send(validResult.error.details);
    }
    next();
  }

  async getDayInfo (req, res, next) {
    try {
      const { user, params: {date} } = req;
      const dayInfoReq = await Day.getProductsInDay(date, user);
      if (!dayInfoReq.length) {
        throw new NotFoundError();
      }

      return res.status(200).json(dayInfoReq);
    }
    catch (error) {
      next(error);
    }
  }
}

module.exports = new DaysControllers();
