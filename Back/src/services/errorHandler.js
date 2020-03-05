export default class CustomError extends Error {
  constructor(name, message, status) {
    super();
    Error.captureStackTrace(this, this.constructor);
    this.name = name;
    this.msg = message;
    this.status = status;
  }
}
