const express = require("express");
const authRouter = express.Router();
const { signUp } = require("../controller/authController");

authRouter.post("/user", signUp);

module.exports = authRouter;
