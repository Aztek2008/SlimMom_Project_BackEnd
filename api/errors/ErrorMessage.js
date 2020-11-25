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
