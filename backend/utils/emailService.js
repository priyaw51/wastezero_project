const { Resend } = require('resend');

// Initialize Resend client with API key from environment
const resend = new Resend(process.env.RESEND_API);

async function sendVerificationEmail(email, otp, subject) {
    const { data, error } = await resend.emails.send({
        from: 'WasteZero <onboarding@resend.dev>', // Use your verified domain in production
        to: [email],
        subject: subject,
        text: `Your OTP verification code is: ${otp}. This code is valid for 10 minutes.`,
    });

    if (error) {
        console.error('Resend Error Details:', error);
        throw new Error('Email could not be sent: ' + error.message);
    }

    console.log(`Email sent to ${email}, ID: ${data.id}`);
}

module.exports = sendVerificationEmail;


// -----------------------------------------------------------------------
// OLD NODEMAILER CODE (Commented out - was causing ENETUNREACH on Render
// because Render Free tier blocks outbound SMTP connections via IPv6)
// -----------------------------------------------------------------------
// const nodemailer = require('nodemailer');
//
// const transporter = nodemailer.createTransport({
//     host: '74.125.143.108', // Static IPv4 for Gmail SMTP
//     port: 465,
//     secure: true,
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
//     },
//     tls: {
//         servername: 'smtp.gmail.com',
//         rejectUnauthorized: false
//     },
//     connectionTimeout: 15000,
// });
//
// async function sendVerificationEmail(email, otp, subject) {
//     const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: email,
//         subject: subject,
//         text: `Your OTP verification code is: ${otp}. This code is valid for 10 minutes.`
//     };
//     try {
//         await transporter.sendMail(mailOptions);
//         console.log(`Email sent to ${email}`);
//     } catch (error) {
//         console.error("Nodemailer Error Details:", error.message, error.stack);
//         throw new Error("Email could not be sent: " + error.message);
//     }
// }
