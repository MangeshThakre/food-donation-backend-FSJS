const userModel = require("../model/userModel.js");
const CustomError = require("../utils/customError.js");

const addAgent = async (req, res, next) => {
  const data = req.body;
  const profileImage = req.user.profileImage;
  data["profileImage"] = profileImage;
  if (req.user.role !== "ADMIN")
    return next(new CustomError("Only ADMIN can add new agent", 400));
  try {
    const agentInfo = new userModel(data);
    const result = await agentInfo.save();
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
};

module.exports = { addAgent };
