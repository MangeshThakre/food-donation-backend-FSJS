const express = require("express");
const app = express();
const authRouter = require("./router/authRouter.js");
const donationRouter = require("./router/donationRouter.js");
const errorHandler = require("./meddleware/errorHandler.js");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

app.use(
  cors({
    origin: ["http://localhost:3000", "https://food-donation-fsjs.vercel.app"],
    credentials: true
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/"
  })
);
// routers
app.use("/api/auth", authRouter);
app.use("/api", donationRouter);
app.use("/", (req, res) =>
  res.status(200).json({ success: true, server: "food donation Backend" })
);

// error handler
app.use(errorHandler);
module.exports = app;
