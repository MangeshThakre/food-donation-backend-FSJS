require("dotenv").config();
require("./config/database");
const app = require("./app.js");

app.listen(process.env.PORT, () =>
  console.log(`server listning at http://localhost:${8081}`)
);
