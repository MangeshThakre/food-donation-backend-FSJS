const JWT = require("jsonwebtoken");
const CustomError = require("../utils/customError.js");

const jwtAuth = (req, res, next) => {
  const token =
    (req.headers.authorization && req.headers["authorization"].split(" ")[1]) ||
    (req.cookies && Object.keys(req.cookies).length >= 1 && req.cookies.Token);
  if (!token) {
    return next(new CustomError("NOT authorized", 401));
  }
  try {
    const payLoad = JWT.verify(token, process.env.JWT_SECRET);
    if (!payLoad) return next(new CustomError("Invalid Token", 400));
    req.user = { _id: payLoad._id, role: payLoad.role };
    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = jwtAuth;