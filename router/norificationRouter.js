const express = require("express");
const notificationRouter = express.Router();
const {
  getNorifications,
  removeNotitication
} = require("../controller/norificationController.js");
const jwtAuth = require("../meddleware/jwtAuthenticaion.js");

notificationRouter.get("/notifications", jwtAuth, getNorifications);
notificationRouter.delete(
  "/notification/:notificationId",
  jwtAuth,
  removeNotitication
);

module.exports = notificationRouter;
