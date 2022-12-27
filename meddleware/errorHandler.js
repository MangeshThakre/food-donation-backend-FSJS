const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "INTERNET SERVER ERROR";

  // unique field-value error
  if (err.code === 11000) {
    message = `${Object.keys(err.keyValue)} should be unique`;
    statusCode = 400;
  }
  console.log(err);
  return res.status(statusCode).json({ success: false, message: message });
};

module.exports = errorHandler;
