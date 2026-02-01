import createTransporter from '../config/email.js';

/**
 * Send registration confirmation email
 */
export const sendRegistrationEmail = async (userData, eventData, registrationData) => {
  const transporter = createTransporter();
  
  if (!transporter) {
    console.error('❌ Email transporter not available');
    return { success: false, error: 'Email service not configured' };
  }

  const mailOptions = {
    from: `"VirtualEvents" <${process.env.EMAIL_USER}>`,
    to: userData.email,
    subject: `Registration Confirmed: ${eventData.title}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .event-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
          .detail-label { font-weight: bold; color: #6b7280; }
          .button { display: inline-block; background: #6366f1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; color: #6b7280; padding: 20px; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Registration Successful!</h1>
            <p>You're all set for the event</p>
          </div>
          <div class="content">
            <p>Hi ${userData.name},</p>
            <p>Thank you for registering! We're excited to have you join us.</p>
            
            <div class="event-details">
              <h2 style="color: #6366f1; margin-top: 0;">${eventData.title}</h2>
              
              <div class="detail-row">
                <span class="detail-label">Date & Time</span>
                <span>${new Date(eventData.startDate).toLocaleString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Location</span>
                <span>${eventData.location.type === 'online' ? 'Online Event' : eventData.location.venue}</span>
              </div>
              
              ${registrationData.paymentAmount > 0 ? `
              <div class="detail-row">
                <span class="detail-label">Amount Paid</span>
                <span>₹${registrationData.paymentAmount}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Payment ID</span>
                <span>${registrationData.transactionId}</span>
              </div>
              ` : ''}
              
              <div class="detail-row" style="border-bottom: none;">
                <span class="detail-label">Registration ID</span>
                <span>${registrationData._id}</span>
              </div>
            </div>
            
            <p><strong>What's Next?</strong></p>
            <ul>
              <li>Add this event to your calendar</li>
              <li>Check your email for event updates</li>
              <li>Join 15 minutes early for a smooth start</li>
            </ul>
            
            <center>
              <a href="${process.env.FRONTEND_URL}/events/${eventData._id}" class="button">View Event Details</a>
            </center>
            
            <p>If you have any questions, feel free to reach out to us.</p>
            <p>See you at the event!</p>
          </div>
          <div class="footer">
            <p>VirtualEvents Platform | <a href="${process.env.FRONTEND_URL}">Visit Website</a></p>
            <p>You received this email because you registered for an event on our platform.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Registration email sent to ${userData.email}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Error sending registration email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send event reminder email (1 day before)
 */
export const sendReminderEmail = async (userData, eventData) => {
  const transporter = createTransporter();
  
  if (!transporter) {
    console.error('❌ Email transporter not available');
    return { success: false, error: 'Email service not configured' };
  }

  const mailOptions = {
    from: `"VirtualEvents" <${process.env.EMAIL_USER}>`,
    to: userData.email,
    subject: `Reminder: ${eventData.title} is Tomorrow!`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .event-box { background: white; padding: 20px; border-left: 4px solid #f59e0b; margin: 20px 0; border-radius: 4px; }
          .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; color: #6b7280; padding: 20px; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⏰ Event Tomorrow!</h1>
            <p>Don't forget about your upcoming event</p>
          </div>
          <div class="content">
            <p>Hi ${userData.name},</p>
            <p>This is a friendly reminder that your event is <strong>tomorrow</strong>!</p>
            
            <div class="event-box">
              <h2 style="color: #f59e0b; margin-top: 0;">${eventData.title}</h2>
              <p><strong>📅 When:</strong> ${new Date(eventData.startDate).toLocaleString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
              <p><strong>📍 Where:</strong> ${eventData.location.type === 'online' ? 'Online Event' : eventData.location.venue}</p>
            </div>
            
            <p><strong>Quick Tips:</strong></p>
            <ul>
              <li>Join 15 minutes early</li>
              <li>Test your internet connection</li>
              <li>Keep your registration ID handy</li>
              <li>Have a notepad ready for key takeaways</li>
            </ul>
            
            <center>
              <a href="${process.env.FRONTEND_URL}/events/${eventData._id}" class="button">View Event Details</a>
            </center>
            
            <p>We're looking forward to seeing you!</p>
          </div>
          <div class="footer">
            <p>VirtualEvents Platform | <a href="${process.env.FRONTEND_URL}">Visit Website</a></p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Reminder email sent to ${userData.email}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Error sending reminder email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send organizer notification for new registration
 */
export const sendOrganizerNotification = async (organizerData, eventData, attendeeData) => {
  const transporter = createTransporter();
  
  if (!transporter) {
    console.error('❌ Email transporter not available');
    return { success: false, error: 'Email service not configured' };
  }

  const mailOptions = {
    from: `"VirtualEvents" <${process.env.EMAIL_USER}>`,
    to: organizerData.email,
    subject: `New Registration: ${eventData.title}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; color: #6b7280; padding: 20px; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 New Registration!</h1>
            <p>Someone just registered for your event</p>
          </div>
          <div class="content">
            <p>Hi ${organizerData.name},</p>
            <p>Great news! You have a new attendee for your event.</p>
            
            <div class="info-box">
              <h3 style="color: #10b981; margin-top: 0;">Event: ${eventData.title}</h3>
              <p><strong>New Attendee:</strong> ${attendeeData.name}</p>
              <p><strong>Email:</strong> ${attendeeData.email}</p>
              <p><strong>Current Attendees:</strong> ${eventData.currentAttendees} / ${eventData.maxAttendees || '∞'}</p>
            </div>
            
            <center>
              <a href="${process.env.FRONTEND_URL}/events/${eventData._id}/attendees" class="button">View All Attendees</a>
            </center>
          </div>
          <div class="footer">
            <p>VirtualEvents Platform | <a href="${process.env.FRONTEND_URL}">Visit Website</a></p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Organizer notification sent to ${organizerData.email}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Error sending organizer notification:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send cancellation confirmation email
 */
export const sendCancellationEmail = async (userData, eventData) => {
  const transporter = createTransporter();
  
  if (!transporter) {
    console.error('❌ Email transporter not available');
    return { success: false, error: 'Email service not configured' };
  }

  const mailOptions = {
    from: `"VirtualEvents" <${process.env.EMAIL_USER}>`,
    to: userData.email,
    subject: `Registration Cancelled: ${eventData.title}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #64748b 0%, #475569 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #6366f1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; color: #6b7280; padding: 20px; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Registration Cancelled</h1>
          </div>
          <div class="content">
            <p>Hi ${userData.name},</p>
            <p>Your registration for <strong>${eventData.title}</strong> has been cancelled.</p>
            <p>If you paid for this event, any applicable refunds will be processed within 5-7 business days.</p>
            <p>We hope to see you at future events!</p>
            
            <center>
              <a href="${process.env.FRONTEND_URL}/events" class="button">Browse Other Events</a>
            </center>
          </div>
          <div class="footer">
            <p>VirtualEvents Platform | <a href="${process.env.FRONTEND_URL}">Visit Website</a></p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Cancellation email sent to ${userData.email}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Error sending cancellation email:', error);
    return { success: false, error: error.message };
  }
};
