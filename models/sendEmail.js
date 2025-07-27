import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const sendEmail = async ({ to, subject, text, html }) => {
  if (!to) {
    throw new Error('No recipient email provided to sendEmail');
  }

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

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export default sendEmail;
