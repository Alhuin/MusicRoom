export default class CustomError extends Error {
  constructor(name, message, status) {
    super();
    this.name = name;
    this.msg = message;
    this.status = status;
    console.log(this);
  }
}
