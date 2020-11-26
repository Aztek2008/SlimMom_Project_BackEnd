const bcrypt = require("bcrypt");
const bcrpt = require("bcrypt");
const UsersSchema = require("./users.schema");
const saltRounds = 8;

async function hashPassword(password) {
  return await bcrpt.hash(password, saltRounds);
}

async function updateToken(id, newToken) {
  return await UsersSchema.findByIdAndUpdate(id, { token: newToken });
}

module.exports = {
  hashPassword,
  updateToken,
};
