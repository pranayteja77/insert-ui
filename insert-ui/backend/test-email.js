// backend/test-email.js
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendTestEmail = async () => {
  try {
    const msg = {
      to: 'pranaytejascv1524@gmail.com', // Your personal email
      from: 'inserthelp@outlook.com', // Must match your verified sender
      subject: '✅ Test Email from In$€₹T',
      text: 'This is a test email to verify SendGrid is working!',
      html: `
        <h3>✅ Test Email from In$€₹T</h3>
        <p>If you see this, SendGrid is working!</p>
        <p><strong>Important:</strong> If you don't see this email, check your Spam folder.</p>
        <p>This is a test for your 3-4 day demo.</p>
      `
    };
    
    await sgMail.send(msg);
    console.log('✅ Test email sent successfully!');
  } catch (error) {
    console.error('❌ Email error:', error.response?.body || error.message);
  }
};

sendTestEmail();