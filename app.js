const express = require("express");
const app = express();
const authRouter = require("./router/authRouter.js");
const errorHandler = require("./meddleware/errorHandler.js");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routers
app.use("/api/auth", authRouter);

// error handler
app.use(errorHandler);

app.use("/", (req, res) =>
  res.status(200).json({ success: true, server: "food donation Backend" })
);
module.exports = app;
