const errorHandler = (err, req, res, next) => {
  const statusCode = err.code || 500;
  const message = err.message || "INTERNET SERVER ERROR";
  return res.status(statusCode).json({ success: true, message: message });
};

module.exports = errorHandler;
