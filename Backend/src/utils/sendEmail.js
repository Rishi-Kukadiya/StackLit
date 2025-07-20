import nodemailer from "nodemailer";

const generateOtpHTML = (otp) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>OTP Verification</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f7;
          padding: 20px;
          color: #333;
        }
        .container {
          max-width: 500px;
          margin: auto;
          background-color: #fff;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .otp {
          font-size: 32px;
          font-weight: bold;
          color: #2d3748;
          letter-spacing: 4px;
          margin: 20px 0;
        }
        .footer {
          font-size: 12px;
          color: #888;
          margin-top: 30px;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Email Verification</h2>
        <p>Hi there,</p>
        <p>Please use the OTP below to verify your email address. It will expire in <strong>5 minutes</strong>.</p>
        <div class="otp">${otp}</div>
        <p>If you did not request this, you can ignore this email.</p>
        <p>Thanks,<br/>Team StackLit</p>
        <div class="footer">
          &copy; ${new Date().getFullYear()} StackLit. All rights reserved.
        </div>
      </div>
    </body>
  </html>
`;

const sendEmail = async ({ to, subject, otp }) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: true, // for port 465
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const mailOptions = {
            from: `"StackLit Support" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html: generateOtpHTML(otp), // 👈 use HTML template instead of plain text
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent:", info.response);
    } catch (error) {
        console.error("❌ Failed to send email:", error);
        throw error;
    }
};

export default sendEmail;
