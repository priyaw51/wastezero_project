// ✅ PRODUCTION EMAIL SERVICE — SendGrid (HTTP API, port 443, works on Render Free tier)
// SendGrid replaces Nodemailer SMTP which is blocked on Render's free plan.
// Uses Node 18+ built-in fetch — no extra packages needed.
//
// SETUP (2 minutes):
// 1. Sign up at https://sendgrid.com (free, 100 emails/day)
// 2. Go to Settings → Sender Authentication → Single Sender Verification
// 3. Verify your sender email (just click the email link SendGrid sends you)
// 4. Go to Settings → API Keys → Create API Key (Full Access)
// 5. Add SENDGRID_API_KEY to your Render environment variables
// 6. Ensure EMAIL_USER matches the verified sender email

async function sendVerificationEmail(email, otp, subject) {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            personalizations: [{ to: [{ email }] }],
            from: {
                email: process.env.EMAIL_USER, // Must match verified SendGrid sender
                name: 'WasteZero'
            },
            subject: subject,
            content: [{
                type: 'text/plain',
                value: `Your OTP verification code is: ${otp}. This code is valid for 10 minutes.`
            }]
        })
    });

    if (!response.ok) {
        const errText = await response.text();
        console.error('SendGrid Error Details:', errText);
        throw new Error('Email could not be sent: ' + errText);
    }

    // SendGrid returns 202 Accepted with no body on success
    console.log(`Email sent to ${email} via SendGrid (status: ${response.status})`);
}

module.exports = sendVerificationEmail;


// -----------------------------------------------------------------------
// OLD NODEMAILER CODE (Commented out)
// Gmail SMTP is BLOCKED on Render Free tier (ports 465/587 are firewalled).
// -----------------------------------------------------------------------
// const dns = require('dns');
// dns.setDefaultResultOrder('ipv4first');
// const nodemailer = require('nodemailer');
// const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS } });
// async function sendVerificationEmail(email, otp, subject) {
//     await transporter.sendMail({ from: `WasteZero <${process.env.EMAIL_USER}>`, to: email, subject, text: `Your OTP is: ${otp}. Valid for 10 minutes.` });
// }
