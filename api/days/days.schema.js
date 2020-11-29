const mongoose = require("mongoose");
const {Schema, ObjectId} = mongoose;
const {productsInDaySearchOptions} = require("./days.helpers");

const daySchema = new Schema( {
  productId: { type: ObjectId, require: true, ref: "Product"},
  weight: { type: Number, require: true},
  date: { type: Date, require: true},
  userId: { type: ObjectId, require: true }
});

async function getProductsInDay(date, user) {
  const options = productsInDaySearchOptions(date, user);
  return this.aggregate(options);
}

daySchema.statics.getProductsInDay = getProductsInDay;

module.exports = mongoose.model("Day", daySchema);
