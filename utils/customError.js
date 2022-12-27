class CustomError extends Error {
  constructor(message, code) {
    super(message);
    this.statusCode = code;
  }
}

module.exports = CustomError;
