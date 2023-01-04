const nodemailer = require("nodemailer");

require("dotenv").config();

const config = {
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: {
    user: "aleshakiselev@meta.ua",
    pass: process.env.META_PASS,
  },
};

const transporter = nodemailer.createTransport(config);


const sendNodeMailer = async (data) => {
  const emailOptions = { ...data, from: "aleshakiselev@meta.ua" };
  await transporter.sendMail(emailOptions);
  return true;
};

module.exports = sendNodeMailer;