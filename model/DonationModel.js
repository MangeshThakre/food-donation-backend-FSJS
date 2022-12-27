const mongoose = require("mongoose");
const { Schema } = mongoose;
const userModel = require("../model/userModel.js");
const DonationStatus = require("../utils/donationStatus");
const donationSchema = new Schema(
  {
    donorId: { type: String, required: [true, "Donor Id is required"] },
    agentId: { type: String },
    items: [
      new Schema(
        {
          item: { type: String, required: [true, "Food item is Required"] },
          quentity: {
            type: String,
            required: [true, "Food Quentity Is Required"]
          }
        },
        { _id: false }
      )
    ],
    pickUpAddress: new mongoose.Schema(
      {
        country: { type: String, required: [true, "Countery is Required"] },
        zip_code: {
          type: Number,
          required: [true, "Zip code/Area code is required"]
        },
        state: { type: String, required: [true, "State is Required"] },
        city: { type: String, required: [true, "City is Required"] },
        street: { type: String, required: [true, "Street is Requied"] },
        building: { type: String, required: [true, "Building is Required"] }
      },
      { _id: false }
    ),
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
    }
  },
  {
    timestamps: true
  }
);

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
