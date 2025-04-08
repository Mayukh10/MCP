import nodemailer from 'nodemailer';
import AppError from './appError.js';

const sendEmail = async (options) => {
  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Define email options
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.message,
  };

  // Send email
  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    throw new AppError('There was an error sending the email. Try again later!', 500);
  }
};

export default sendEmail; 