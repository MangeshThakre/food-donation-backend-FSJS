const express = require("express");
const donationRouter = express.Router();
const {
  createDonation,
  getDonations,
  updateDonation
} = require("../controller/donationController");
const jwtAuth = require("../meddleware/jwtAuthenticaion");
const DonationStatus = require("../utils/donationStatus");

donationRouter.post("/donation", jwtAuth, createDonation);
donationRouter.get("/donations", jwtAuth, getDonations);
donationRouter.put("/donation/:donorId", jwtAuth, updateDonation);

module.exports = donationRouter;
