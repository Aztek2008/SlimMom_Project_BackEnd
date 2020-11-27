const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    name: { type: String, require: true },
    login: { type: String, require: true },
    password: { type: String, require: true },
    token: String,
    status: {
      type: String,
      required: true,
      enum: ["Verified", "Created"],
      default: "Created",
    },
    token: { type: String, required: false },
    verificationToken: { type: String, default: "", required: false },
  },
  { versionKey: false }
);

// Static methods

UserSchema.statics.findByVerificationToken = findByVerificationToken;
UserSchema.statics.verifyUser = verifyUser;

async function findByVerificationToken(verificationToken) {
  return this.findOne({ verificationToken });
}

async function verifyUser(userId) {
  return this.findByIdAndUpdate(
    userId,
    { status: "Verified", verificationToken: null },
    { new: true }
  );
}

module.exports = mongoose.model("User", UserSchema);
