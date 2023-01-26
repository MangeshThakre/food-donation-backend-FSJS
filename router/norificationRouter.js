const express = require("express");
const notificationRouter = express.Router();
const { getNorifications } = require("../controller/norificationController.js");
const jwtAutn = require("../meddleware/jwtAuthenticaion.js");

notificationRouter.get("/notifications", jwtAutn, getNorifications);

module.exports = notificationRouter;
