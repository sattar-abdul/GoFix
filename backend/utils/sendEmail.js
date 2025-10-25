// backend/utils/sendEmail.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE, // "gmail"
  auth: {
    user: process.env.EMAIL_FROM.split("<")[1].replace(">", ""), // extract email
    pass: process.env.EMAIL_PASS, // app password
  },
});

const sendEmail = async (to, subject, html) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
