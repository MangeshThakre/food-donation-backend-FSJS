const mongoose = require("mongoose");

const mongoDBConnect = (() => {
  mongoose.set("strictQuery", true);
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => console.log("connected to database"))
    .catch((err) => console.log(err));
})();

module.exports = mongoDBConnect;
