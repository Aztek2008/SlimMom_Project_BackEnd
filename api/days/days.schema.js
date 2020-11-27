const mongoose = require("mongoose");
const {Schema, ObjectId} = mongoose;

const daySchema = new Schema({
  productId: ObjectId,
  weight: Number,
  date: Date,
  userId: ObjectId,
});

module.exports = mongoose.model("Day", daySchema);