import nodemailer from 'nodemailer';

// Lazy create email transporter
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.error('❌ Email credentials not found');
    console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'Present' : 'Missing');
    console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? 'Present' : 'Missing');
    return null;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
    console.log('✅ Email transporter created');
    return transporter;
  } catch (error) {
    console.error('❌ Email transporter creation failed:', error.message);
    return null;
  }
};

export default createTransporter;
