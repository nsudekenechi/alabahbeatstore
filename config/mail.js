require("dotenv").config();
const nodemailer = require("nodemailer");
const path = require("path");
const templatePath = path.join(__dirname, "../", "emailtemplate.ejs");
const ejs = require("ejs");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
   port: 465, // or 587 for TLS
  secure: true,
  auth: {
    user: process.env.EMAIL_USER, // your Gmail address
    pass: process.env.EMAIL_PASS  // your App Password or real password (less secure)
}
});

const sendEmail = async (to, subject, body, username) => {
try {
     const html = await ejs.renderFile(templatePath, {body, username});
    const mailOptions = {
      from: `${process.env.EMAIL_NAME} <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (err) {
    console.error("Email error:", err);
  }
};
module.exports = sendEmail;