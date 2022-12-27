const userModel = require("../model/userModel.js");
const CustomError = require("../utils/customError.js");
const transporter = require("../config/emailTranspoter.js");
const cookieOptions = require("../utils/cookieOptions.js");

const signUp = async (req, res, next) => {
  const data = req.body;
  try {
    const userInfo = new userModel(data);
    const result = await userInfo.save();
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
};
const signIn = async (req, res, next) => {
  const { password, email } = req.body;
  if (!email || !password) {
    return next(new CustomError("Please fill all fields", 400));
  }
  try {
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return next(new CustomError("Invalid credentials", 400));
    }

    const isPasswordMatched = await user.comparePassword(password);
    if (isPasswordMatched) {
      const token = user.getJwtToken();
      user.password = undefined;
      res.cookie("token", token, cookieOptions);
      return res.status(200).json({
        success: true,
        token,
        user
      });
    } else {
      return next(
        new CustomError("Invalid credentials - incorrect password", 400)
      );
    }
  } catch (error) {
    return next(error);
  }
};
const logout = async (req, res, next) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true
    });
    res.status(200).json({
      success: true,
      message: "Logged Out"
    });
  } catch (error) {
    next(error);
  }
};
const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  if (!email) return next(CustomError("Email is required", 400));
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return next(new CustomError("User not found", 404));
    }
    const resetToken = user.generateForgotPasswordToken();
    await user.save();

    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/auth/password/reset/${resetToken}`;

    // create mail content
    const mailOptions = {
      from: process.env.EMAIL_ID,
      to: user.email,
      subject: "Event managment Reset password",
      html: `<b>Hello ${user.name}</b><br>
           <a href="${resetUrl}" target ="_blank" >Click here to reset password</a>`
    };

    // send email
    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        user.forgotPasswordToken = undefined;
        user.forgotPasswordExpiry = undefined;
        await user.save();
        return next(error);
      }
      return res
        .status(200)
        .json({ success: true, message: "check you email" });
    });
  } catch (error) {
    return next(error);
  }
};
const resetPassword = async (req, res, next) => {
  const { forgotPasswordToken } = req.params;
  const { password, confirmPassword } = req.body;
  try {
    if (!password || !confirmPassword) {
      return next(
        new CustomError("password and conform Password is Required", 400)
      );
    }

    if (password !== confirmPassword) {
      return next(
        new CustomError("password and confirm password does not match", 400)
      );
    }

    // check user is exist
    const user = await userModel.findOne({
      forgotPasswordToken,
      forgotPasswordExpiry: { $gt: new Date(Date.now()) }
    });
    if (!user) {
      return next(
        new CustomError("forgot password token is invalid or expired", 400)
      );
    }

    // create hash password and and store in database
    const hashPass = await bcrypt.hash(password, 10);
    user.password = hashPass;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
    await user.save();
    // create jwt token and send  to client,
    const token = user.generateJwtToken();
    res.status(200).cookie("Token", token, cookieOptions).json({
      success: true,
      message: "successfuly updated the password",
      Token: token
    });
  } catch (error) {
    return next(error);
  }
};
const getUser = async (req, res, next) => {
  const userId = req.user._id;
  try {
    const user = await userModel.findById(userId);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signUp,
  signIn,
  logout,
  forgotPassword,
  resetPassword,
  getUser
};
