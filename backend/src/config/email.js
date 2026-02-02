import sgMail from '@sendgrid/mail';

// Initialize SendGrid
const initializeSendGrid = () => {
  if (!process.env.SENDGRID_API_KEY) {
    console.error('❌ SendGrid API key not found');
    return false;
  }

  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    console.log('✅ SendGrid initialized');
    return true;
  } catch (error) {
    console.error('❌ SendGrid initialization failed:', error.message);
    return false;
  }
};

// Send email using SendGrid
export const sendEmail = async ({ to, subject, html }) => {
  if (!initializeSendGrid()) {
    console.error('❌ Cannot send email - SendGrid not initialized');
    return null;
  }

  try {
    const msg = {
      to,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@yourdomain.com',
      subject,
      html,
    };

    await sgMail.send(msg);
    console.log(`✅ Email sent to ${to}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    return null;
  }
};

export default sendEmail;
