import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, text }) => {
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
            to, // <-- THIS MUST NOT BE EMPTY
            subject,
            text,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent:", info.response);
    } catch (error) {
        console.error("❌ Failed to send email:", error);
        throw error;
    }
};

export default sendEmail;
