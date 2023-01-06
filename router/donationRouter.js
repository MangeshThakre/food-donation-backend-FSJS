const express = require("express");
const donationRouter = express.Router();
const {
  createDonation,
  getDonations,
  updateDonation,
  getDonation,
  removeDonation
} = require("../controller/donationController");
const jwtAuth = require("../meddleware/jwtAuthenticaion");

donationRouter.post("/donation", jwtAuth, createDonation);
donationRouter.get("/donation/:donationId", jwtAuth, getDonation);
donationRouter.get("/donations", jwtAuth, getDonations);
donationRouter.put("/donation/:donationId", jwtAuth, updateDonation);
donationRouter.delete("/donation/:donationId", jwtAuth, removeDonation);

module.exports = donationRouter;
