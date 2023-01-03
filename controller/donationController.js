const donationModel = require("../model/DonationModel.js");
const CustomError = require("../utils/customError.js");

const createDonation = async (req, res, next) => {
  const donorId = req.user._id;
  try {
    const doantionInfo = new donationModel({ ...req.body, donorId: donorId });
    const result = await doantionInfo.save();
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const updateDonation = async (req, res, next) => {
  const { donorId } = req.params;
  const donationData = req.body;
  try {
    const result = await donationModel.findByIdAndUpdate(
      donorId,
      donationData,
      { runValidators: true, new: true }
    );
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
};

const getDonations = async (req, res, next) => {
  const { donorId, from, to, status } = req.query;

  if (from || to) {
    if (new Date(from) === "Invalid Date" || new Date(to) === "Invalid Date") {
      return next(CustomError("Invalid Date", 400));
    }
  }

  const query = {};
  if (donorId) query["donorId"] = donorId;
  if (status) query["status"] = status;
  if (from && to) {
    query["createdAt"] = {
      $gte: new Date(from).toISOString(),
      $lte: new Date(to).toISOString()
    };
  }

  try {
    const result = await donationModel.find(query);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
};

const getDonation = async (req, res, next) => {
  const { donationId } = req.params;
  try {
    const result = await donationModel.findById(donationId);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
};

module.exports = { createDonation, getDonations, updateDonation, getDonation };
