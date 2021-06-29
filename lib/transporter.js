const nodemailer = require("nodemailer");

// Set up email...
// Transporter...
function transporter() {
  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: "gwen46@ethereal.email",
      pass: "8y7y513JqK6yDFXknD",
    },
  });
}

module.exports = transporter;
