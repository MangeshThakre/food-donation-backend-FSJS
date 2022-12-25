const { Schema } = require("mongoose");
const DonationStatus = require("../utils/donationStatus");
const donationSchema = new mongoose.Schema(
  {
    donorId: { type: String, required: [true, "Donor Id is required"] },
    agentId: { type: String },
    items: [
      new Schema({
        item: { type: String, required: [true, "Food item is Required"] },
        quentity: {
          type: String,
          required: [true, "Food Quentity Is Required"]
        }
      })
    ],
    pickUpAddress: {
      country: { type: String },
      zip_code: { type: Number },
      state: { type: String },
      city: { type: String },
      street: { type: String },
      building: { type: String }
    },

    message: {
      type: String,
      required: [true, "Message is required"],
      maxLength: [125, "Name must be less than 125"]
    },

    status: {
      type: String,
      required: [true, "Status of Donation is Required"],
      enum: Object.values(DonationStatus)
    }
  },

  {
    timestamps: true
  }
);

const donationModel = mongoose.model("donation", donationSchema);
