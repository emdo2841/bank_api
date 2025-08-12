const nodemailer = require("nodemailer");
require("dotenv").config();
//Create transporter function
const emailAuth = async () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};
const sendEmail = async (email, firstname, resetLink = null, isPasswordChanged = false, isPaymentSuccess = false, transactionDetails = null) => {
  try {
    const transporter = await emailAuth();

    let subject, htmlContent;

    if (resetLink) {
      // Password Reset Request
      subject = "Password Reset Request";
      htmlContent = `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Password Reset Request</h2>
          <p>Hello ${firstname},</p>
          <p>Click the link below to reset your password:</p>
          <p><a href="${resetLink}">${resetLink}</a></p>
          <p>This link will expire in 1 hour. If you did not request this, please ignore it.</p>
        </div>
      `;
    } else if (isPasswordChanged) {
      // Password Changed Successfully
      subject = "Your Password Has Been Changed";
      htmlContent = `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Password Changed Successfully</h2>
          <p>Hello ${firstname},</p>
          <p>Your password has been updated successfully.</p>
          <p>If you did not request this change, please contact our support team immediately.</p>
        </div>
      `;
    } else if (isPaymentSuccess) {
      // Payment Success Notification
      subject = "Payment Successful";
      htmlContent = `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Payment Successful</h2>
          <p>Hello ${firstname},</p>
          <p>Thank you for your payment! Your transaction was successful.</p>
          <p><strong>Transaction Details:</strong></p>
          <ul>
            <li>Transaction ID: ${transactionDetails.transactionId}</li>
            <li>Amount: NGN${transactionDetails.amount}</li>
            <li>Date: ${transactionDetails.date}</li>
            <li>Status: 'https://ej-mart-place.vercel.app/verify-payment/${transactionDetails.transactionId}'</li>
          </ul>
          <p>We appreciate your business and look forward to serving you again!</p>
        </div>
      `;
    } else {
      // Registration Success
      subject = "Congratulations on Your Successful Registration";
      htmlContent = `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h1>Welcome, ${firstname}!</h1>
          <p>Thank you for registering with Ndoma ECommerce Store.</p>
          <p>Click <a href="https://ej-mart-place.vercel.app">here</a> to browse through our quality goods.</p>
        </div>
      `;
    }

    const mailOptions = {
      from: `"EJ ECOMMERCE STORES" <${process.env.EMAIL}>`,
      to: email,
      subject: subject,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    // console.log(`✅ Email sent to ${email}`);
  } catch (error) {
    // console.error("❌ Error sending email:", error);
  }
};

module.exports = sendEmail;