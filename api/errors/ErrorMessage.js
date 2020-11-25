exports.UnauthorizedError = class UnauthorizedError extends (
  Error
) {
  constructor(name) {
    super(name);
    this.status = 401;
    this.stack = "";
    this.message = "User not authorized";
  }
};

exports.NotFoundError = class NotFoundError extends Error {
  constructor(message = "Not found") {
    super(message);
    this.status = 404;
  }
}