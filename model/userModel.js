const mongoose = require("mongoose");
const { Schema } = mongoose;
const AuthRoles = require("../utils/authRoles");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      maxLength: [50, "Name must be less than 50"]
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true
    },
    address: new Schema(
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
    password: {
      type: String,
      required: [true, "password is required"],
      minLength: [8, "password must be at least 8 characters"],
      maxLength: [8, "password must have 8 characters"],
      select: false
    },
    role: {
      type: String,
      enum: Object.values(AuthRoles),
      default: AuthRoles.DONAOR
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date
  },
  {
    timestamps: true
  }
);

// challenge 1 - encrypt password - hooks
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  console.log(this.password);
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

//  country       Country
//  zip_code      Zip code
//  state         State, province or prefecture
//  city          City
//  street        Street address
//  building      Apt, office, suite, etc. (Optional)
