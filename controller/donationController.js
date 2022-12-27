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

const getDonations = async (req, res, next) => {
  const { donorId } = req.query;
  const query = {};
  if (donorId) query["donorId"] = donorId;

  try {
    const result = await donationModel.find(query);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
};

module.exports = { createDonation, getDonations };
