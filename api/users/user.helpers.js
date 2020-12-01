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

function calcDailyCalories(currentWeight, height, age, targetWeight) {
  const dailyCal =
    10 * currentWeight +
    6.25 * height -
    5 * age -
    161 -
    10 * (currentWeight - targetWeight);
  return dailyCal;
}

module.exports = {
  hashPassword,
  updateToken,
  calcDailyCalories,
};
