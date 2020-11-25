const mongoose = require("mongoose");
const {Schema} = mongoose;

const productSchema = new Schema({
  categories: [{type: String}],
  weight: {type: Number, default: 100},
  title: {ru: String, ua: String},
  calories: {type: Number},
  groupBloodNotAllowed: {1: Boolean, 2: Boolean, 3: Boolean, 4: Boolean},
});

async function findByQuery(queryString) {
  const queryOptions = queryString
    ? {$or: [{"title.ru": {"$regex": queryString}}, {"title.ua": {"$regex": queryString}}]}
    : {};
  return this.find(queryOptions);
}

productSchema.statics.findByQuery = findByQuery;

module.exports = mongoose.model("Product", productSchema);