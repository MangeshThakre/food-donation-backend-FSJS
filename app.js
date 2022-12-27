const express = require("express");
const app = express();
const authRouter = require("./router/authRouter.js");
const errorHandler = require("./meddleware/errorHandler.js");
const donationRouter = require("./router/donationRouter.js");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routers
app.use("/api/auth", authRouter);
app.use("/api", donationRouter);
app.use("/", (req, res) =>
  res.status(200).json({ success: true, server: "food donation Backend" })
);

// error handler
app.use(errorHandler);

module.exports = app;
