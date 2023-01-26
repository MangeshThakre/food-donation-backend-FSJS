const mongoose = require("mongoose");
const { Schema } = mongoose;

const notificationSchema = new Schema(
  {
    role: { type: String, required: true },
    donationId: { type: String, required: true },
    donorId: { type: String },
    donorName: { type: String },
    agentId: { type: String },
    agentName: { type: String },
    donationStatus: { type: String, required: true }
  },
  {
    timestamps: true
  }
);
const notificationModel = mongoose.model("notification", notificationSchema);
module.exports = notificationModel;
