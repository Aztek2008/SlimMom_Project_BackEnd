const mongoose = require("mongoose");
const {Schema} = mongoose;
const mongoosePaginate = require("mongoose-paginate-v2");

const productSchema = new Schema({
  categories: [{type: String}],
  weight: {type: Number, default: 100},
  title: {ru: String, ua: String},
  calories: {type: Number},
  groupBloodNotAllowed: {1: Boolean, 2: Boolean, 3: Boolean, 4: Boolean},
});

productSchema.plugin(mongoosePaginate);

async function findByQuery(queryString, page, limit) {
  const queryOptions = queryString
    ? {$or: [
        {"title.ru": {"$regex": queryString, "$options": "i"}},
        {"title.ua": {"$regex": queryString, "$options": "i"}}
      ]}
    : {};
  return this.paginate(queryOptions, {page, limit});
}

productSchema.statics.findByQuery = findByQuery;

module.exports = mongoose.model("Product", productSchema);