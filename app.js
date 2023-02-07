const express = require("express");
const app = express();
const authRouter = require("./router/authRouter.js");
const donationRouter = require("./router/donationRouter.js");
const notificationRouter = require("./router/norificationRouter.js");
const errorHandler = require("./meddleware/errorHandler.js");
// const cookieOptions = require("./utils/cookieOptions");

const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const userRouter = require("./router/userRouter.js");

// swagger
const YAML = require("yamljs");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = YAML.load("./Swagger_API_DOCS/swagger.yaml");

app.use(
  cors({
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
    origin: ["http://localhost:3000", "https://food-donation-fsjs.vercel.app"],
    credentials: true,
    exposedHeaders: ["set-cookie"]
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

// ROUTES
// swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// rest api
app.use("/api/auth", authRouter);
app.use("/api", donationRouter);
app.use("/api", userRouter);
app.use("/api", notificationRouter);
app.use("/", (req, res) =>
  res.status(200).json({ success: true, server: "food donation Backend" })
);
// ROUTES //

// error handler
app.use(errorHandler);

module.exports = app;
