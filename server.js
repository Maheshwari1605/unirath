const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: '*', // Allow all origins (adjust for production)
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('.')); // Serve static files

// Excel file path
const EXCEL_FILE_PATH = path.join(__dirname, 'customer_inquiries.xlsx');

// Google Sheets configuration
// Option 1: Google Apps Script Web App URL (easier, no service account needed)
const GOOGLE_APPS_SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL || '';

// Option 2: Direct Google Sheets API (requires service account)
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID || '';
const SHEET_NAME = process.env.GOOGLE_SHEET_NAME || 'Inquiries';

// Initialize Google Sheets client (for direct API method)
async function getGoogleSheetsClient() {
  try {
    // Using Service Account
    if (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
      const auth = new google.auth.JWT(
        process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        null,
        process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        ['https://www.googleapis.com/auth/spreadsheets']
      );
      return google.sheets({ version: 'v4', auth });
    }
    
    return null;
  } catch (error) {
    console.error('Error initializing Google Sheets client:', error);
    return null;
  }
}

// Initialize Excel file if it doesn't exist
function initializeExcelFile() {
  if (!fs.existsSync(EXCEL_FILE_PATH)) {
    const headers = [
      ['Date', 'Name', 'Email', 'Phone', 'Service', 'Message']
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(headers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Inquiries');
    XLSX.writeFile(workbook, EXCEL_FILE_PATH);
  }
}

// Add data to Excel file
function addToExcel(data) {
  initializeExcelFile();
  
  const workbook = XLSX.readFile(EXCEL_FILE_PATH);
  const worksheet = workbook.Sheets['Inquiries'];
  
  // Convert sheet to JSON to get existing data
  const existingData = XLSX.utils.sheet_to_json(worksheet);
  
  // Add new row
  const newRow = {
    'Date': new Date().toISOString(),
    'Name': data.name || '',
    'Email': data.email || '',
    'Phone': data.phone || '',
    'Service': data.service || '',
    'Message': data.message || ''
  };
  
  existingData.push(newRow);
  
  // Convert back to worksheet
  const newWorksheet = XLSX.utils.json_to_sheet(existingData);
  workbook.Sheets['Inquiries'] = newWorksheet;
  
  // Write file
  XLSX.writeFile(workbook, EXCEL_FILE_PATH);
  
  console.log('Data added to Excel file:', newRow);
}

// Add data to Google Sheets (supports both Apps Script and direct API)
async function addToGoogleSheets(data) {
  // Method 1: Google Apps Script Web App (easier, no service account needed)
  if (GOOGLE_APPS_SCRIPT_URL) {
    try {
      const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (result.success) {
        console.log('Data added to Google Sheet via Apps Script');
        return true;
      }
    } catch (error) {
      console.error('Error with Google Apps Script:', error);
    }
  }

  // Method 2: Direct Google Sheets API (requires service account)
  try {
    if (!SPREADSHEET_ID) {
      console.log('Google Sheets not configured. Skipping.');
      return false;
    }

    const sheets = await getGoogleSheetsClient();
    if (!sheets) {
      console.log('Google Sheets client not initialized. Skipping.');
      return false;
    }

    const rowData = [
      new Date().toISOString(),
      data.name || '',
      data.email || '',
      data.phone || '',
      data.service || '',
      data.message || ''
    ];

    // Append the new row
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:F`,
      valueInputOption: 'USER_ENTERED',
      resource: { values: [rowData] }
    });

    console.log('Data added to Google Sheet via API:', rowData);
    return true;
  } catch (error) {
    console.error('Error adding data to Google Sheets:', error);
    return false;
  }
}

// Configure email transporter
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

// Send email notification
async function sendEmailNotification(data) {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"UNIRATH INFOTECH" <${process.env.SMTP_USER}>`,
      to: process.env.NOTIFICATION_EMAIL || process.env.SMTP_USER,
      subject: 'New Customer Inquiry - UNIRATH INFOTECH',
      html: `
        <h2>New Customer Inquiry Received</h2>
        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
        <p><strong>Service Interested In:</strong> ${data.service || 'Not specified'}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message}</p>
        <hr>
        <p><small>This inquiry has been automatically saved to customer_inquiries.xlsx${SPREADSHEET_ID ? ' and Google Sheets' : ''}</small></p>
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
}

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, service, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, email, and message are required fields.' 
      });
    }
    
    const formData = {
      name: name.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : '',
      service: service || '',
      message: message.trim()
    };
    
    // Save to Excel
    addToExcel(formData);
    
    // Save to Google Sheets
    const googleSheetsResult = await addToGoogleSheets(formData);
    
    // Send email notification
    const emailResult = await sendEmailNotification(formData);
    
    res.json({
      success: true,
      message: 'Thank you for your inquiry! We will get back to you soon.',
      emailSent: emailResult.success,
      googleSheetsUpdated: googleSheetsResult
    });
    
  } catch (error) {
    console.error('Error processing contact form:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request. Please try again later.'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  initializeExcelFile();
  console.log('Excel file initialized at:', EXCEL_FILE_PATH);
});

