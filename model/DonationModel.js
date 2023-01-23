const mongoose = require("mongoose");
const { Schema } = mongoose;
const userModel = require("../model/userModel.js");
const DonationStatus = require("../utils/donationStatus");
const currentDate = require("../utils/currentDate.js");
const donationSchema = new Schema({
  donorId: { type: String, required: [true, "Donor Id is required"] },
  agentId: { type: String },
  items: [
    new Schema(
      {
        item: { type: String, required: [true, "Food item is Required"] },
        quantity: {
          type: String,
          required: [true, "Food Quentity Is Required"]
        },
        unit: {
          type: String,
          required: [true, "Status of Unit is Required"],
          enum: ["Kilogram", "Liter"]
        }
      },
      { _id: false }
    )
  ],
  pickUpAddress: { type: String },
  message: {
    type: String,
    required: [true, "Message is required"],
    maxLength: [125, "Name must be less than 125"]
  },
  status: {
    type: String,
    required: [true, "Status of Donation is Required"],
    enum: Object.values(DonationStatus),
    default: DonationStatus.PENDING
  },
  createdAt: {
    type: Date,
    default: currentDate
  }
});

donationSchema.pre("save", async function (req, res, next) {
  if (!this.pickUpAddress) {
    const pickupAddress = await userModel.findById(this.donorId, {
      address: 1
    });
    this.pickUpAddress = pickupAddress.address;
    next();
  }
  return;
});
const donationModel = mongoose.model("donation", donationSchema);
module.exports = donationModel;
