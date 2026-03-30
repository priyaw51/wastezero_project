// ✅ PRODUCTION EMAIL SERVICE — Brevo (HTTP API, port 443, works on Render Free tier)
// Brevo replaces Nodemailer SMTP which is blocked on Render's free plan.
// Uses Node 18+ built-in fetch — no extra packages needed.
// Sign up at https://app.brevo.com → Settings → API Keys to get your key.
// Verify your sender email at: Senders & Domains → Add a Sender.

async function sendVerificationEmail(email, otp, subject) {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
            'api-key': process.env.BREVO_API_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            sender: {
                name: 'WasteZero',
                email: process.env.EMAIL_USER // Must be verified as a sender in Brevo dashboard
            },
            to: [{ email }],
            subject: subject,
            textContent: `Your OTP verification code is: ${otp}. This code is valid for 10 minutes.`
        })
    });

    if (!response.ok) {
        const err = await response.json();
        console.error('Brevo Error Details:', JSON.stringify(err));
        throw new Error('Email could not be sent: ' + (err.message || response.statusText));
    }

    const data = await response.json();
    console.log(`Email sent to ${email}, messageId: ${data.messageId}`);
}

module.exports = sendVerificationEmail;


// -----------------------------------------------------------------------
// OLD NODEMAILER CODE (Commented out)
// Gmail SMTP is BLOCKED on Render Free tier (ports 465/587 are firewalled).
// dns.setDefaultResultOrder('ipv4first') also did not resolve it.
// -----------------------------------------------------------------------
// const dns = require('dns');
// dns.setDefaultResultOrder('ipv4first');
// const nodemailer = require('nodemailer');
// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
//     }
// });
// async function sendVerificationEmail(email, otp, subject) {
//     await transporter.sendMail({
//         from: `WasteZero <${process.env.EMAIL_USER}>`,
//         to: email,
//         subject: subject,
//         text: `Your OTP is: ${otp}. Valid for 10 minutes.`
//     });
//     console.log(`Email sent to ${email}`);
// }
