const express = require("express");
const app = express();
const authRouter = require("./router/authRouter.js");
const donationRouter = require("./router/donationRouter.js");
const errorHandler = require("./meddleware/errorHandler.js");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

app.use(cors({ origin: ["http://localhost:3000"], credentials: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// routers
app.use("/api/auth", authRouter);
app.use("/api", donationRouter);
app.use("/", (req, res) =>
  res.status(200).json({ success: true, server: "food donation Backend" })
);

// error handler
app.use(errorHandler);
module.exports = app;
