const nodemailer = require("nodemailer");

const sendEmail = async (
  subject,
  message,
  send_to,
  sent_from,
  reply_to = sent_from
) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: true,
      },
    });

    const options = {
      from: sent_from,
      to: send_to,
      replyTo: reply_to,
      subject,
      html: message,
    };

    const info = await transporter.sendMail(options);
    console.log("Email sent:", info.response);
    return info;
  } catch (error) {
    console.error("Email error:", error); // log actual error
    throw new Error("Email not sent. Please try again.");
  }
};

module.exports = sendEmail;
