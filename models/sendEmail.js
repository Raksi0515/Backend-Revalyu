import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const sendEmail = async ({ to, subject, text, html }) => {
  // Create transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail', // or use 'smtp.ethereal.email' for testing
    auth: {
      user: process.env.EMAIL_USER,     // your Gmail or SMTP user
      pass: process.env.EMAIL_PASS      // app password or SMTP password
    }
  });

  // Email options
  const mailOptions = {
    from: `"REVALYU Admin" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html, // Optional
  };

  // Send mail
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
