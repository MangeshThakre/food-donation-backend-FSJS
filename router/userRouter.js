const express = require("express");
const userRouter = express.Router();
const cloudinaryImageUpload = require("../meddleware/cloudinaryImageUpload.js");
const {
  addUser,
  getUsers,
  getUser,
  editUser
} = require("../controller/userController.js");
const jwtAuth = require("../meddleware/jwtAuthenticaion.js");

userRouter.post("/user", jwtAuth, cloudinaryImageUpload, addUser);
userRouter.patch("/user", jwtAuth, cloudinaryImageUpload, editUser);
userRouter.get("/user", jwtAuth, getUser);
userRouter.get("/users", jwtAuth, getUsers);

module.exports = userRouter;
