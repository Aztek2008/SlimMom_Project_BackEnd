const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    name: { type: String, require: true },
    login: { type: String, require: true },
    password: { type: String, require: true },
    token: { type: String, required: false },
    verificationToken: { type: String, default: "", required: false },
  },
  { versionKey: false }
);

module.exports = mongoose.model("User", UserSchema);
