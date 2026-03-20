import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: '"ChatFlow" <no-reply@chatflow.com>',
    to: email,
    subject: "Verify your email",
    html: `<h1>Verification Code</h1><p>Your code is: <b>${otp}</b></p>`,
  });
};
