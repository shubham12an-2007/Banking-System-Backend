require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Transporter verify check (Yeh terminal me print karega connection status)
transporter.verify((error, success) => {
  if (error) {
    console.error(" Email Server Verification Failed:", error);
  } else {
    console.log(" Email server is ready to send messages using OAuth2");
  }
});

// Internal helper function to send raw emails
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Backend Ledger" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log(" Message successfully sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error(" Error sending email inside transporter:", error);
    return false;
  }
};

// Main function jo tum controller me call karoge
async function sendRegistrationEmail({ userEmail, name }) {
  // Debug log to ensure variables are loaded
  console.log("📨 Triggering registration email for:", userEmail);

  const subject = "Welcome to Backend Ledger – Account Activated! 🎉";

  const text = `Hello ${name},\n\nWelcome aboard! Your account has been successfully created and configured on our secure backend ledger infrastructure.\n\nOur platform ensures full financial compliance, high-performance ledger aggregation pipelines, and secure tracking for your transactional nodes.\n\nWhat you can do now:\n- Initialize secure digital wallets.\n- Track double-entry accounting records in real-time.\n- Generate cryptographically signed audit logs.\n\nTo access your dashboard, visit: http://localhost:3000/login\n\nIf you have any integration queries or system bottlenecks, feel free to connect with our core developer console support team.\n\nBest Regards,\nThe Core Engineering Team\nFinTech Ledger Inc.`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Welcome to FinTech Ledger</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f8; margin: 0; padding: 0; color: #333333; }
            .container { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
            .header { background: linear-gradient(135deg, #1e3c72 0%, #2a5298 0%); padding: 40px 20px; text-align: center; color: #ffffff; }
            .header h1 { margin: 0; font-size: 26px; font-weight: 600; letter-spacing: 0.5px; }
            .content { padding: 40px 30px; line-height: 1.6; }
            .content h2 { color: #1e3c72; margin-top: 0; font-size: 20px; }
            .content p { font-size: 15px; color: #555555; }
            .cta-container { text-align: center; margin: 35px 0; }
            .btn { background-color: #2a5298; color: #ffffff !important; padding: 14px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 15px; display: inline-block; transition: background 0.3s ease; box-shadow: 0 3px 6px rgba(42, 82, 152, 0.2); }
            .footer { background-color: #fafbfc; padding: 20px; text-align: center; font-size: 12px; color: #888888; border-top: 1px solid #eeeeee; }
            .features { background-color: #f8fafd; border-left: 4px solid #2a5298; padding: 15px; margin: 20px 0; border-radius: 0 4px 4px 0; }
            .features ul { margin: 0; padding-left: 20px; font-size: 14px; color: #444444; }
            .features li { margin-bottom: 8px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>FinTech Ledger</h1>
            </div>
            <div class="content">
                <h2>Hello ${name},</h2>
                <p>Welcome aboard! Your account has been successfully created and configured on our secure backend ledger infrastructure.</p>
                <p>Our platform ensures full financial compliance, high-performance ledger aggregation pipelines, and secure tracking for your transactional nodes.</p>
                <div class="features">
                    <strong>What you can do now:</strong>
                    <ul>
                        <li>Initialize secure digital wallets.</li>
                        <li>Track double-entry accounting records in real-time.</li>
                        <li>Generate cryptographically signed audit logs.</li>
                    </ul>
                </div>
                <p>Click the button below to log in and access your personal dashboard controller:</p>
                <div class="cta-container">
                    <a href="http://localhost:3000/login" class="btn">Access Dashboard</a>
                </div>
                <p>If you have any integration queries or system bottlenecks, feel free to connect with our core developer console support team.</p>
                <p>Best Regards,<br><strong>The Core Engineering Team</strong></p>
            </div>
            <div class="footer">
                <p>&copy; 2026 FinTech Ledger Inc. All rights reserved.</p>
                <p>This is an automated system notification regarding your registration endpoint sequence.</p>
            </div>
        </div>
    </body>
    </html>
  `;

  // Internal function ko call kiya jo return check karegi
  await sendEmail(userEmail, subject, text, html);
}

// This is a function for the sending the transaction email to the users
async function sendTransactionEmail({ userEmail, name, amount, toAccount }) {
  const subject = "Transaction Alert – Funds Transferred Successfully! ";
  const text = `Hello ${name},\n\nYour transaction of $${amount} to account ${toAccount} has been processed successfully.`;
  const html = `
    <html>
    <head>
        <style>
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f0f0f0; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .cta-container { text-align: center; margin-top: 20px; }
            .btn { display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; }
            .footer { background-color: #f0f0f0; padding: 20px; text-align: center; font-size: 12px; }
            .features li { margin-bottom: 8px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>FinTech Ledger</h1>
            </div>
            <div class="content">
                <h2>Hello ${name},</h2>
                <p>Your transaction of $${amount} to account ${toAccount} has been processed successfully.</p>
            </div>
            <div class="footer">
                <p>&copy; 2026 FinTech Ledger Inc. All rights reserved.</p>
                <p>This is an automated system notification regarding your transaction.</p>
            </div>
        </div>
    </body>
    </html>
  `;

  await sendEmail(userEmail, subject, text, html);
}

async function sendTranscationFailedEmail({
  userEmail,
  name,
  amount,
  toAccount,
}) {
  const subject = "Transaction Alert – Funds Transfer Failed! ";
  const text = `Hello ${name},\n\nYour transaction of $${amount} to account ${toAccount} has failed. Please check your account balance and try again.`;
  const html = `<p>Hello ${name},</p><p>Your transaction of $${amount} to account ${toAccount} has failed. Please check your account balance and try again.</p>`;

  await sendEmail(userEmail, subject, text, html);
}

module.exports = {
  sendRegistrationEmail,
  sendTransactionEmail,
  sendTranscationFailedEmail,
};
