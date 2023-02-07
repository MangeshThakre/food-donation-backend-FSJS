const mongoose = require("mongoose");
const { Schema } = mongoose;
const AuthRoles = require("../utils/authRoles");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First Name is required"],
      maxLength: [50, "Name must be less than 50"]
    },
    lastName: {
      type: String,
      required: [true, "Last Name is required"],
      maxLength: [50, "Name must be less than 50"]
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true
    },
    address: { type: String },
    password: {
      type: String,
      required: [true, "password is required"],
      select: false
    },
    role: {
      type: String,
      enum: Object.values(AuthRoles),
      default: AuthRoles.DONAOR
    },
    phoneNo: { type: String, required: [true, "Phone no is required"] },
    profileImage: new Schema(
      {
        imageId: { type: String, required: true },
        url: { type: String, required: true }
      },
      { _id: false }
    ),
    forgotPasswordExpiry: String,
    forgotPasswordExpiry: Date
  },
  {
    timestamps: true
  }
);
//  search index on all field
userSchema.index({ "$**": "text" });

// challenge 1 - encrypt password - hooks
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// add more featuers directly to your schema
userSchema.methods = {
  //compare password
  comparePassword: async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  },

  //generate JWT TOKEN
  getJwtToken: function () {
    return JWT.sign(
      {
        _id: this._id,
        role: this.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRY
      }
    );
  },

  generateForgotPasswordToken: function () {
    const forgotToken = crypto.randomBytes(20).toString("hex");
    //step 1 - save to DB
    this.forgotPasswordToken = crypto
      .createHash("sha256")
      .update(forgotToken)
      .digest("hex");
    this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000; // 20min
    //step 2 - return values to user
    return forgotToken;
  }
};

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
