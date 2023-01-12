const express = require("express");
const userRouter = express.Router();
const cloudinaryImageUpload = require("../meddleware/cloudinaryImageUpload.js");
const { addAgent } = require("../controller/userController.js");
const jwtAuth = require("../meddleware/jwtAuthenticaion.js");

userRouter.post("/agent", jwtAuth, cloudinaryImageUpload, addAgent);

module.exports = userRouter;
