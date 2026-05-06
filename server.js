import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import compression from 'compression';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

// Load environment variables from .env file (if present)
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Enable basic security headers
app.use(helmet({
    contentSecurityPolicy: false, // Let React handle its own assets for now unless strict CSP is needed
}));

// Restrict CORS to our own domain (or localhost for dev)
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://friendsgrp.com', 'https://www.friendsgrp.com'] 
        : '*',
}));

// Enable compression
app.use(compression());

// Enable JSON body parsing for API requests
app.use(express.json());

// API Rate Limiting to prevent spam (Max 5 requests per 15 minutes per IP)
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    message: { success: false, message: 'Too many requests. Please try again later.' }
});

// Set up Nodemailer transporter (Strictly using Environment Variables for Security)
if (!process.env.SMTP_PASS) {
    console.warn("⚠️ WARNING: SMTP_PASS is not set in the environment. Email sending will fail.");
}

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'mail.friendsgrp.com',
    port: process.env.SMTP_PORT || 465,
    secure: true, 
    auth: {
        user: process.env.SMTP_USER || 'info@friendsgrp.com',
        pass: process.env.SMTP_PASS, // NO HARDCODED PASSWORDS
    },
});

// Apply rate limiter specifically to the email endpoint
app.post('/api/send-email', apiLimiter, async (req, res) => {
    try {
        const { subject, body, html } = req.body;
        
        if (!subject || (!body && !html)) {
            return res.status(400).json({ success: false, message: 'Missing subject or body' });
        }

        const mailOptions = {
            from: '"Friends Group Website" <info@friendsgrp.com>',
            to: 'info@friendsgrp.com',
            subject: subject,
            text: body || 'Please view this email in an HTML-compatible client.',
            html: html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        res.json({ success: true, message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: 'Failed to send email', error: error.message });
    }
});

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist')));

// 301 Permanent Redirect for legacy external links
app.use('/programs', (req, res) => {
    res.redirect(301, '/menu');
});

// Handle SPA routing - deliver index.html for any unknown routes
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Ready for production on cPanel 134.0.23`);
});
