import express, { Request, Response } from 'express';
import path from 'path';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;
const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL || 'alfaiz.pathan@arikacollabs.com';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Contact Email API Route
app.post(['/api/send-email', '/api/contact'], async (req: Request, res: Response) => {
  try {
    const { name, email, phone, company, service, inquiryType, subject, message } = req.body;

    // Server-side Validation
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Full Name is required.' });
    }

    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({ success: false, error: 'Email address is required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ success: false, error: 'Please enter a valid email address.' });
    }

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ success: false, error: 'Message content is required.' });
    }

    const finalSubject = subject || service || inquiryType || 'Campaign Inquiry';
    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanPhone = phone ? phone.trim() : 'Not provided';
    const cleanCompany = company ? company.trim() : 'Not provided';
    const cleanMessage = message.trim();

    const emailSubject = `[ARIKA COLLABS Inquiry] ${finalSubject} from ${cleanName}`;

    // Construct Luxury HTML Email
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #0F0F0E; color: #FFFFFF; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background-color: #181615; border: 1px solid #DDA291; border-radius: 12px; padding: 30px; }
          .header { text-align: center; border-bottom: 1px solid rgba(221,162,145,0.3); padding-bottom: 20px; margin-bottom: 25px; }
          .logo { color: #DDA291; font-size: 22px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; }
          .subtitle { color: #A1A1A1; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-top: 5px; }
          .field-row { margin-bottom: 18px; line-height: 1.5; }
          .label { color: #DDA291; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold; display: block; margin-bottom: 4px; }
          .value { color: #FFFFFF; font-size: 15px; font-weight: 500; }
          .message-box { background-color: #0F0F0E; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 15px; color: #E5E5E5; font-size: 14px; white-space: pre-wrap; margin-top: 6px; }
          .footer { text-align: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px; margin-top: 30px; color: #737373; font-size: 11px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">ARIKA COLLABS</div>
            <div class="subtitle">New Website Campaign Inquiry</div>
          </div>
          
          <div class="field-row">
            <span class="label">Visitor Name</span>
            <span class="value">${cleanName}</span>
          </div>
          
          <div class="field-row">
            <span class="label">Email Address (Reply-To)</span>
            <span class="value"><a href="mailto:${cleanEmail}" style="color: #DDA291; text-decoration: none;">${cleanEmail}</a></span>
          </div>
          
          <div class="field-row">
            <span class="label">Phone Coordinate</span>
            <span class="value">${cleanPhone}</span>
          </div>
          
          <div class="field-row">
            <span class="label">Company / Brand Name</span>
            <span class="value">${cleanCompany}</span>
          </div>
          
          <div class="field-row">
            <span class="label">Inquiry Type / Service</span>
            <span class="value">${finalSubject}</span>
          </div>
          
          <div class="field-row">
            <span class="label">Campaign Message</span>
            <div class="message-box">${cleanMessage}</div>
          </div>
          
          <div class="footer">
            Sent automatically from ARIKA COLLABS Website Contact Form<br/>
            Target Destination: ${RECIPIENT_EMAIL}
          </div>
        </div>
      </body>
      </html>
    `;

    const textContent = `
NEW ARIKA COLLABS INQUIRY
========================
Name: ${cleanName}
Email: ${cleanEmail}
Phone: ${cleanPhone}
Company: ${cleanCompany}
Inquiry Type: ${finalSubject}

Message:
${cleanMessage}
    `;

    // Check for EmailJS environment variables
    const emailjsServiceId = process.env.EMAILJS_SERVICE_ID || process.env.VITE_EMAILJS_SERVICE_ID;
    const emailjsTemplateId = process.env.EMAILJS_TEMPLATE_ID || process.env.VITE_EMAILJS_TEMPLATE_ID;
    const emailjsPublicKey = process.env.EMAILJS_PUBLIC_KEY || process.env.VITE_EMAILJS_PUBLIC_KEY;
    const emailjsPrivateKey = process.env.EMAILJS_PRIVATE_KEY;

    // Check if EmailJS credentials are set
    if (emailjsServiceId && emailjsTemplateId && emailjsPublicKey) {
      const emailjsPayload = {
        service_id: emailjsServiceId,
        template_id: emailjsTemplateId,
        user_id: emailjsPublicKey,
        ...(emailjsPrivateKey ? { accessToken: emailjsPrivateKey } : {}),
        template_params: {
          to_email: RECIPIENT_EMAIL,
          to_name: 'Alfaiz Pathan',
          from_name: cleanName,
          user_name: cleanName,
          name: cleanName,
          from_email: cleanEmail,
          user_email: cleanEmail,
          email: cleanEmail,
          reply_to: cleanEmail,
          phone: cleanPhone,
          company: cleanCompany,
          service: finalSubject,
          inquiry_type: finalSubject,
          subject: emailSubject,
          message: cleanMessage,
        }
      };

      const emailjsRes = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailjsPayload),
      });

      if (!emailjsRes.ok) {
        const errText = await emailjsRes.text();
        console.error('[EmailJS Server Error]', errText);
        throw new Error(`EmailJS Error (${emailjsRes.status}): ${errText}`);
      }

      console.log(`[EmailJS Service] Email successfully sent to ${RECIPIENT_EMAIL} via EmailJS API`);
      return res.json({ success: true, message: 'Your inquiry has been submitted successfully via EmailJS.' });
    }

    // Check if SMTP credentials are set
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (smtpHost && smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: `"${cleanName} via ARIKA COLLABS" <${smtpUser}>`,
        to: RECIPIENT_EMAIL,
        replyTo: cleanEmail,
        subject: emailSubject,
        text: textContent,
        html: htmlContent,
      });

      console.log(`[Email Service] Email successfully sent to ${RECIPIENT_EMAIL} from ${cleanEmail}`);
      return res.json({ success: true, message: 'Your inquiry has been submitted successfully.' });
    } else {
      // Log submission details to server log if SMTP credentials are not yet configured in environment variables
      console.log('====================================================');
      console.log('[Email Service Notice] SMTP credentials not set in .env.');
      console.log(`Target Recipient: ${RECIPIENT_EMAIL}`);
      console.log(`From Visitor: ${cleanName} <${cleanEmail}>`);
      console.log(`Company: ${cleanCompany} | Phone: ${cleanPhone}`);
      console.log(`Inquiry Type: ${finalSubject}`);
      console.log(`Message: ${cleanMessage}`);
      console.log('====================================================');

      return res.json({
        success: true,
        message: 'Inquiry received successfully!',
        simulated: true
      });
    }

  } catch (err: any) {
    console.error('[Email Service Error]', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'An unexpected error occurred while processing your email. Please try again.'
    });
  }
});

// Google Sheets Proxy API Route
app.post(['/api/google-sheets', '/api/submit-to-sheets'], async (req: Request, res: Response) => {
  try {
    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL || process.env.VITE_GOOGLE_APPS_SCRIPT_URL || req.body.scriptUrl;

    if (!scriptUrl || !scriptUrl.startsWith('http')) {
      console.log('[Google Sheets Proxy] Notice: GOOGLE_APPS_SCRIPT_URL or VITE_GOOGLE_APPS_SCRIPT_URL not configured yet.');
      return res.json({
        success: true,
        message: 'Inquiry stored (Google Apps Script URL pending configuration)',
        unconfigured: true
      });
    }

    const payload = req.body;

    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(payload),
      redirect: 'follow'
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        console.warn(
          `[Google Sheets Proxy] ⚠️ Google Apps Script 401/403 Permission Notice:\n` +
          `Your Google Apps Script Web App deployment is currently restricted to organization users only.\n` +
          `To fix: In Apps Script, click Deploy -> Manage deployments -> Edit -> Set "Who has access" to "Anyone" -> Click Deploy.`
        );
        return res.status(200).json({
          success: true,
          notice: 'Google Apps Script requires "Who has access: Anyone" configuration.'
        });
      }

      const errorText = await response.text();
      console.error('[Google Sheets Proxy Error]', response.status, errorText.slice(0, 300));
      return res.status(200).json({
        success: true,
        warning: `Google Apps Script returned status ${response.status}`
      });
    }

    let responseData: any = {};
    try {
      responseData = await response.json();
    } catch {
      responseData = { status: 'success', success: true };
    }

    return res.json({
      success: true,
      data: responseData
    });
  } catch (error: any) {
    console.error('[Google Sheets Proxy Failure]', error.message);
    return res.json({
      success: true,
      error: error.message
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
