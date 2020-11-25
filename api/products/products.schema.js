const mongoose = require("mongoose");
const {Schema} = mongoose;

const productSchema = new Schema({
  name: {type: String, required: true},
  energyValue: {type: Number, required: true,},
  nominalWeight: {type: Number, default: 100},
});

async function findByQuery(queryString) {
  return this.find({name: new RegExp(`${queryString.toLowerCase()}`)});
}

productSchema.statics.findByQuery = findByQuery;

module.exports = mongoose.model("Product", productSchema);