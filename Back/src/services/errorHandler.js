export default class CustomError extends Error {
  constructor(message, status) {
    super();
    Error.captureStackTrace(this, this.constructor);
    this.name = CustomError;
    this.msg = message;
    this.status = status;
  }
}
