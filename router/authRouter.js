const express = require("express");
const jwtAuth = require("../meddleware/jwtAuthenticaion.js");
const cloudinaryImageUpload = require("../meddleware/cloudinaryImageUpload.js");
const authRouter = express.Router();
const {
  signIn,
  signUp,
  logout,
  forgotPassword,
  resetPassword,
  getUser,
  editUser,
  getUsers
} = require("../controller/authController");

authRouter.post("/signup", signUp);
authRouter.post("/signin", cloudinaryImageUpload, signIn);
authRouter.get("/logout", logout);
authRouter.post("/forgot_password", forgotPassword);
authRouter.post("/reset_password/:token", resetPassword);

module.exports = authRouter;
