const nodemailer = require("nodemailer");

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  secure: false,
  secureConnection: false,
  auth: {
    user: process.env.EMAIL_ID, // generated ethereal user
    pass: process.env.EMAIL_PASS // generated ethereal password
  }
});

module.exports = transporter;
