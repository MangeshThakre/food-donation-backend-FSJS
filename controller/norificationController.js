const CustomError = require("../utils/customError.js");
const notificationModel = require("../model/notificationModel.js");

const getNorifications = async (req, res, next) => {
  const { page, limit } = req.query;
  const userId = req.user._id;
  const userRole = req.user.role;

  const PAGE = Number(page) || 1;
  const LIMIT = Number(limit) || 10;
  const startIndex = (PAGE - 1) * LIMIT;
  const endIndex = PAGE * LIMIT;

  const query = {};
  if (userRole === "ADMIN") {
    query["role"] = userRole;
  } else if (userRole === "DONOR") {
    query["donorId"] = userId;
  } else if (userRole === "AGENT") {
    query["agentId"] = userId;
  }
  try {
    const totalnotification = await notificationModel
      .find(query)
      .countDocuments();
    const result = {};
    if (endIndex < totalnotification) {
      result.next = {
        pageNumber: PAGE + 1,
        limit: LIMIT
      };
    }
    if (startIndex > 0) {
      result.previous = {
        pageNumber: PAGE - 1,
        limit: LIMIT
      };
    }
    result["notifications"] = await notificationModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(LIMIT);

    if (!result) return next(new CustomError("invalid request", "400"));
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const removeNotitication = async (req, res, next) => {
  const { notificationId } = req.params;
  try {
    const result = await notificationModel.findByIdAndDelete(notificationId);
    if (!result) return next(new CustomError("invalid Id", 400));
    return res
      .status(200)
      .json({ successs: true, message: "notification removed successfuly" });
  } catch (error) {
    return next(error);
  }
};

module.exports = { getNorifications, removeNotitication };
