import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import compression from 'compression';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Enable compression
app.use(compression());

// Enable JSON body parsing for API requests
app.use(express.json());

// Set up Nodemailer transporter (Configure with your cPanel email password)
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'mail.friendsgrp.com',
    port: process.env.SMTP_PORT || 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER || 'info@friendsgrp.com',
        pass: process.env.SMTP_PASS || 'P@$$w0rd_2024',
    },
});

// API Endpoint to send email
app.post('/api/send-email', async (req, res) => {
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
