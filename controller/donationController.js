const donationModel = require("../model/DonationModel.js");
const CustomError = require("../utils/customError.js");
const mongoose = require("mongoose");

/******************************************************
 * @CREATECONATION
 * @route /api/donation
 * @method POST
 * @description  insert new donation
 * @body donation details
 * @returns return object
 ******************************************************/

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

/******************************************************
 * @UPDATEDONATION
 * @route /api/donation/:dinationId
 * @method PUT
 * @description  update donation
 * @body donation details
 * @params donationId
 * @returns return updated  object
 ******************************************************/

const updateDonation = async (req, res, next) => {
  const { donationId } = req.params;
  const donationData = req.body;
  try {
    const result = await donationModel.findByIdAndUpdate(
      donationId,
      donationData,
      { runValidators: true, new: true }
    );
    if (!result) {
      return next(new CustomError("invalid donation Id", 400));
    }
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
};

/******************************************************
 * @GETDONATIONS
 * @route /api/donationS
 * @method GET
 * @description get donation array of object base on query
 * @query  donorId, from, to, status, page, limit, agentId
 * @returns return array of object
 ******************************************************/

const getDonations = async (req, res, next) => {
  const { donorId, from, to, status, page, limit, agentId } = req.query;

  if (from || to) {
    if (new Date(from) === "Invalid Date" || new Date(to) === "Invalid Date") {
      return next(CustomError("Invalid Date", 400));
    }
  }

  const PAGE = Number(page) || 1;
  const LIMIT = Number(limit) || 10;
  const startIndex = (PAGE - 1) * LIMIT;
  const endIndex = PAGE * LIMIT;

  const query = {};
  if (donorId) query["donorId"] = donorId;
  if (status) query["status"] = { $in: status.split(" ") };
  if (agentId) query["agentId"] = agentId;
  if (from && to) {
    query["createdAt"] = {
      $gte: new Date(from),
      $lte: new Date(to)
    };
  }

  try {
    const totalDonation = await donationModel.find(query).countDocuments();
    const result = {};
    if (endIndex < totalDonation) {
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

    result.donations = await donationModel
      .aggregate([
        // add filed donorObjectId and agentObjectId if agentId  exist
        {
          $addFields: {
            donorObjectId: {
              $convert: {
                input: "$donorId",
                to: "objectId",
                onError: "",
                onNull: ""
              }
            },
            agentObjectId: {
              $convert: {
                input: "$agentId",
                to: "objectId",
                onError: "",
                onNull: ""
              }
            }
          }
        },

        //  match query
        { $match: query },

        //  lookup from donor and agent from user collection
        {
          $lookup: {
            from: "users",
            localField: "donorObjectId",
            foreignField: "_id",
            as: "donor"
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "agentObjectId",
            foreignField: "_id",
            as: "agent"
          }
        },
        // unwind donor, and agent if agent is not empty array   /// donor and agent is lookup filed
        { $unwind: "$donor" },
        {
          $unwind: {
            path: "$agent",
            preserveNullAndEmptyArrays: true
          }
        },
        //// project required data
        {
          $project: {
            _id: "$_id",
            items: "$items",
            pickUpAddress: "$pickUpAddress",
            message: "$message",
            status: "$status",
            createdAt: "$createdAt",
            donorId: "$donorId",
            donorName: {
              $concat: ["$donor.firstName", " ", "$donor.lastName"]
            },
            donorEmail: "$donor.email",
            donorPhoneNo: "$donor.phoneNo",
            donorImage: "$donor.profileImage.url",
            agentId: "$agentId",
            agentName: {
              $concat: ["$agent.firstName", " ", "$agent.lastName"]
            },
            agentEmail: "$agent.email",
            agentPhoneNo: "$agent.phoneNo",
            agentImage: "$agent.profileImage.url"
          }
        }
      ])
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(LIMIT);
    // console.log(result.donations);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
};

/******************************************************
 * @GETDONATION
 * @route /api/donation/:dinationId
 * @method GET
 * @description get the donation base on donation Id with extra details
 * @params  donation id
 * @returns return object
 ******************************************************/

const getDonation = async (req, res, next) => {
  const { donationId } = req.params;
  const ObjectId = mongoose.Types.ObjectId;
  try {
    const [result] = await donationModel.aggregate([
      { $match: { _id: ObjectId(donationId) } },
      // add filed donorObjectId and agentObjectId if agentId  exist
      {
        $addFields: {
          donorObjectId: {
            $convert: {
              input: "$donorId",
              to: "objectId",
              onError: "",
              onNull: ""
            }
          },
          agentObjectId: {
            $convert: {
              input: "$agentId",
              to: "objectId",
              onError: "",
              onNull: ""
            }
          }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "donorObjectId",
          foreignField: "_id",
          as: "donor"
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "agentObjectId",
          foreignField: "_id",
          as: "agent"
        }
      },
      // unwind donor, and agent if agent is not empty array   /// donor and agent is lookup filed
      { $unwind: "$donor" },
      {
        $unwind: {
          path: "$agent",
          preserveNullAndEmptyArrays: true
        }
      },
      //// project required data
      {
        $project: {
          _id: "$_id",
          items: "$items",
          pickUpAddress: "$pickUpAddress",
          message: "$message",
          status: "$status",
          createdAt: "$createdAt",
          donorId: "$donorId",
          donorName: {
            $concat: ["$donor.firstName", " ", "$donor.lastName"]
          },
          donorEmail: "$donor.email",
          donorPhoneNo: "$donor.phoneNo",
          donorImage: "$donor.profileImage.url",
          agentId: "$agentId",
          agentName: {
            $concat: ["$agent.firstName", " ", "$agent.lastName"]
          },
          agentEmail: "$agent.email",
          agentPhoneNo: "$agent.phoneNo",
          agentImage: "$agent.profileImage.url"
        }
      }
    ]);

    //
    if (!result) {
      return next(new CustomError("invalid _id", 400));
    }

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
};

/******************************************************
 * @REMOVEDONATION
 * @route /api/donation/:dinationId
 * @method DELETE
 * @description delete donation base on donation Id with extra details
 * @params  donation id
 * @returns return message
 ******************************************************/

const removeDonation = async (req, res, next) => {
  const { donationId } = req.params;
  try {
    const remove = await donationModel.findByIdAndDelete(donationId);
    if (!remove) return next(new CustomError("Invalid donation Id", 400));
    return res
      .status(200)
      .json({ success: true, message: "removed successfuly" });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createDonation,
  getDonations,
  updateDonation,
  getDonation,
  removeDonation
};
