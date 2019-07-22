export default class CustomError extends Error {
  constructor(message, status) {
    super();
    this.name = 'CustomError';
    this.msg = message;
    this.status = status;
  }
}
