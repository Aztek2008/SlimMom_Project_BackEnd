const bcrypt = require("bcrypt");
const bcrpt = require("bcrypt");
const UsersSchema = require("./users.schema");
const saltRounds = 8;


async function hashPassword(password) {
    return await bcrpt.hash(password, saltRounds);
  }


module.exports = {
    hashPassword
}