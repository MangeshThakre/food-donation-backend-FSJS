const userModel = require("../model/userModel.js");
const CustomError = require("../utils/customError.js");
const mongoose = require("mongoose");

/******************************************************
 * @ADDUSER
 * @route /api/user
 * @method POST
 * @description add new user (admin or agent) only admin can add user
 * @body user detail
 * @returns user object
 ******************************************************/

const addUser = async (req, res, next) => {
  const data = req.body;
  const profileImage = req.user.profileImage;
  data["profileImage"] = profileImage;
  if (req.body.password !== req.body.confirmPassword)
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

/******************************************************
 * @GETUSERS
 * @route /api/auth/users
 * @description  return array of object base on query
 * @query role, page, limit, search
 * @returns return object
 ******************************************************/

const getUsers = async (req, res, next) => {
  const { role, page, limit, search } = req.query;
  const PAGE = Number(page) || 1;
  const LIMIT = Number(limit) || 10;
  const startIndex = (PAGE - 1) * LIMIT;
  const endIndex = PAGE * LIMIT;

  const query = {};
  if (role) query["role"] = role;
  if (search)
    query["$text"] = {
      $search: search,
      $caseSensitive: false,
      $diacriticSensitive: true
    };

  try {
    const totalUsers = await userModel.find(query).countDocuments();
    const result = {};
    if (endIndex < totalUsers) {
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

    function donationCountBaseOnStatus(status) {
      return {
        $size: {
          $filter: {
            input: "$donations",
            as: "item",
            cond: { $eq: ["$$item.status", status] }
          }
        }
      };
    }

    result.users = await userModel
      .aggregate([
        { $match: query },
        {
          $addFields: {
            strUserId: {
              $toString: "$_id"
            }
          }
        },
        {
          $lookup: {
            from: "donations",
            localField: "strUserId",
            foreignField:
              (role === "AGENT" && "agentId") ||
              (role === "DONOR" && "donorId"),
            as: "donations"
          }
        },
        {
          $project: {
            _id: "$_id",
            email: "$email",
            address: "$address",
            role: "$role",
            createdAt: "$createdAt",
            firstName: "$firstName",
            lastName: "$lastName",
            profileImage: "$profileImage",
            phoneNo: "$phoneNo",
            collected: donationCountBaseOnStatus("COLLECTED"),
            accepted: donationCountBaseOnStatus("ACCEPTED"),
            rejected: donationCountBaseOnStatus("REJECTED"),
            pending: donationCountBaseOnStatus("PENDING")
          }
        }
      ])
      .sort({ firstName: 1 })
      .skip(startIndex)
      .limit(LIMIT);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
};

/******************************************************
 * @GETUSER
 * @route /api/auth/getuser
 * @description  get user form database and additional details of user
 * @query userId
 * @returns return object
 ******************************************************/

const getUser = async (req, res, next) => {
  const userId = req.query.userId || req.user._id;
  const ObjectId = mongoose.Types.ObjectId;
  try {
    const [user] = await userModel.aggregate([
      { $match: { _id: ObjectId(userId) } },
      {
        $addFields: {
          str_id: userId
        }
      },
      {
        $lookup: {
          from: "donations",
          localField: "str_id",
          foreignField: "agentId",
          as: "donations"
        }
      },
      {
        $project: {
          _id: "$_id",
          email: "$email",
          address: "$address",
          role: "$role",
          createdAt: "$createdAt",
          firstName: "$firstName",
          lastName: "$lastName",
          profileImage: "$profileImage",
          phoneNo: "$phoneNo",
          collected: {
            $size: {
              $filter: {
                input: "$donations",
                as: "item",
                cond: { $eq: ["$$item.status", "COLLECTED"] }
              }
            }
          },
          accepted: {
            $size: {
              $filter: {
                input: "$donations",
                as: "item",
                cond: { $eq: ["$$item.status", "ACCEPTED"] }
              }
            }
          }
        }
      }
    ]);

    if (!user) {
      return next(new CustomError("invalid Id", 400));
    }

    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

/******************************************************
 * @EDITUSER
 * @route /api/auth/user
 * @description  update user dta
 * @query userId
 * @body edited user details
 * @returns return object
 ******************************************************/

const editUser = async (req, res, next) => {
  const profileImage = req.user.profileImage;
  const userId = req.user._id;
  try {
    const result = await userModel.findByIdAndUpdate(
      userId,
      { ...req.body, profileImage },
      { runValidators: true, new: true }
    );
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

module.exports = { addUser, getUsers, editUser, getUser };
