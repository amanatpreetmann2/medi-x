/**
 * Medix Healthcare Portal - Optional Backend Nodemailer Email Server
 * Provides real SMTP email delivery for college evaluations when configured.
 * Run with: node server.js
 */

import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// SMTP Transporter configuration
const getTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });
};

// Health Check
app.get('/api/status', (req, res) => {
  const isSmtpConfigured = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
  res.json({
    status: 'online',
    smtpConfigured: isSmtpConfigured,
    smtpHost: process.env.SMTP_HOST || 'Not Configured (Demo Mode Active)',
    timestamp: new Date().toISOString()
  });
});

// Send Email Route
app.post('/api/send-email', async (req, res) => {
  const { to, subject, html, text } = req.body;

  if (!to || !subject) {
    return res.status(400).json({ error: 'Recipient address (to) and subject are required.' });
  }

  const transporter = getTransporter();

  if (!transporter) {
    // Return structured demo confirmation
    return res.status(200).json({
      success: true,
      mode: 'demo_logged',
      message: 'SMTP credentials not set in .env. Notification recorded in Evaluation Demo Mode.',
      timestamp: new Date().toISOString()
    });
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || `"Medix Healthcare" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text: text || '',
      html: html || ''
    });

    console.log(`[SMTP] Email successfully sent to ${to}: Message ID ${info.messageId}`);
    return res.status(200).json({
      success: true,
      mode: 'live_smtp',
      messageId: info.messageId,
      message: `Email successfully delivered via SMTP to ${to}`
    });
  } catch (error) {
    console.error('[SMTP Error]', error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
      message: 'SMTP delivery failed. Check your email credentials in .env.'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Medix Healthcare Email Server listening on http://localhost:${PORT}`);
});
