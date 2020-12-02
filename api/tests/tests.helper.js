const request = require("supertest");

const userRequest = {
  name: "Dalton Trambo",
  login: "dalton-trambo@gmail.com",
  password: "111111"
}

const registerUserHelper = async (app, expectStatus) => {
  return await request(app)
    .post("/users/register")
    .set('Content-Type', 'application/json')
    .send({
      ...userRequest
    })
    .expect(expectStatus)
}

const loginUserHelper = async (app, expectStatus, login, password) => {
  return await request(app)
    .post("/users/login")
    .set('Content-Type', 'application/json')
    .send({
      login,
      password
    })
    .expect(expectStatus);
}

const summaryUserInfo = {
  currentWeight: 78,
  height: 180,
  age: 33,
  targetWeight: 74,
  bloodType: 1,
};

module.exports = {
  userRequest,
  registerUserHelper,
  loginUserHelper,
  summaryUserInfo
}