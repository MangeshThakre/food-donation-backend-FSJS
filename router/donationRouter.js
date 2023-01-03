const express = require("express");
const donationRouter = express.Router();
const {
  createDonation,
  getDonations,
  updateDonation,
  getDonation
} = require("../controller/donationController");
const jwtAuth = require("../meddleware/jwtAuthenticaion");

donationRouter.post("/donation", jwtAuth, createDonation);
donationRouter.get("/donation/:donationId", jwtAuth, getDonation);
donationRouter.get("/donations", jwtAuth, getDonations);
donationRouter.put("/donation/:donorId", jwtAuth, updateDonation);

module.exports = donationRouter;
