const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async (mailOptions) => {
  try {
    // Validate environment variables
    if (!process.env.EMAIL_USER_CRM || !process.env.EMAIL_PASS_CRM) {
      throw new Error("Email credentials not configured. Set EMAIL_USER_CRM and EMAIL_PASS_CRM environment variables.");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER_CRM,
        pass: process.env.EMAIL_PASS_CRM,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const defaultOptions = {
      from: `"Sensitive Technologies Authentication Code" <${process.env.EMAIL_USER_CRM}>`,
    };

    const finalOptions = { ...defaultOptions, ...mailOptions };

    const result = await transporter.sendMail(finalOptions);
    console.log(`✓ Email sent successfully to ${finalOptions.to}`);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("❌ Email sending failed:", {
      error: error.message,
      to: mailOptions?.to,
      subject: mailOptions?.subject,
      hasEmailUser: !!process.env.EMAIL_USER_CRM,
      hasEmailPass: !!process.env.EMAIL_PASS_CRM,
    });
    throw error; // Re-throw so controller can catch it
  }
};

module.exports = sendEmail;
