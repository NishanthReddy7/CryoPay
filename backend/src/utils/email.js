import nodemailer from 'nodemailer';

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

/**
 * Sends OTP email
 * @param {string} email - Recipient email
 * @param {string} otp - OTP code
 */
export async function sendOtpEmail(email, otp) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'CryoPay - Your Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e293b;">CryoPay Verification Code</h2>
        <p>Your verification code is:</p>
        <div style="background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0;">
          ${otp}
        </div>
        <p style="color: #64748b;">This code will expire in 10 minutes.</p>
        <p style="color: #64748b;">If you didn't request this code, please ignore this email.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('OTP email sent successfully');
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Failed to send OTP email');
  }
}

/**
 * Sends password reset email
 * @param {string} email - Recipient email
 * @param {string} resetLink - Password reset link
 */
export async function sendPasswordResetEmail(email, resetLink) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'CryoPay - Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e293b;">Reset Your Password</h2>
        <p>You requested to reset your password. Click the button below to continue:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #1e293b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p style="color: #64748b;">This link will expire in 1 hour.</p>
        <p style="color: #64748b;">If you didn't request this, please ignore this email.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully');
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
}