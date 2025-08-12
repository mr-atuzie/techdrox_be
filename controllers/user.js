const User = require("../models/User");
const {
  getContactFormEmailTemplate,
  getContactAcknowledgmentEmailTemplate,
} = require("../utils/emailTemplates");
const sendEmail = require("../utils/sendEmail");
const asyncHandler = require("express-async-handler");

const contactUs = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phone, subject, message } = req.body;

  // 1. Validate input
  //   if (!name || !email || !password) {
  //     res.status(400);
  //     throw new Error("Please enter all required fields");
  //   }

  // Send email
  try {
    await sendEmail(
      "New contact form submission from SOHCAHTOA",
      getContactFormEmailTemplate(
        firstName,
        lastName,
        email,
        phone,
        subject,
        message
      ),
      process.env.EMAIL_USER,
      email,
      email
    );

    await sendEmail(
      "Your message has bee sent to SOHCAHTOA support team",
      getContactAcknowledgmentEmailTemplate(firstName),
      email,
      process.env.EMAIL_USER,
      process.env.EMAIL_USER
    );

    res.status(201).json({
      message: "contact us",
    });
  } catch (err) {
    console.log(err);

    res.status(500);
    throw new Error("Email not sent. Please try again.");
  }
});

const signUp = asyncHandler(async (req, res) => {
  const { fullName, phone, email, address, country, state, transaction } =
    req.body;

  console.log(req.body);

  // Validate required fields
  if (!fullName || !phone || !email) {
    return res
      .status(400)
      .json({ message: "Full name, phone, and email are required" });
  }

  // Create new user in DB
  const user = await User.create({
    fullName,
    phone,
    email,
    address: address || "",
    country: country || "",
    state: state || "",
    transaction: transaction || "",
  });

  console.log("New signup:", user);

  return res.status(200).json({ message: "Signup successful", user });
});

module.exports = { contactUs, signUp };
