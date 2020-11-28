const Joi = require("joi");
const daysModel = require ("./days.schema");

class DaysController {
    async addProductToDay (req, res, next) {
      try{
        const {user, body: {productId, weight, date}} = req;
        const day = new daysModel ({
          productId,
          weight,
          date,
          userId: user._id,
        });
        const savedDay = await day.save();
        return res.status(200).json(savedDay);тзь
    }
    catch(error) {
      next(error);
    }
   };

  async validateProduct (req, res, next) {
    const validSchema = Joi.object({
      productId: Joi.string().required(),
      weight: Joi.string().required(),
      date: Joi.date().required(),
    });
    const validResult = validSchema.validate(req.body);
    if (validResult.error) {
      return res.status(400).send(validResult.error.details);
    }
    next();
  }

}

module.exports = new DaysController();
  