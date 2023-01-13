const currentDate = new Date(
  new Date(Date.now() + 1000 * 60 * 60 * 24).toJSON().split("T")[0]
).toJSON();

module.exports = currentDate;
