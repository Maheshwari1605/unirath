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
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID || '';
const SHEET_NAME = process.env.GOOGLE_SHEET_NAME || 'Inquiries';

// Initialize Google Sheets client
async function getGoogleSheetsClient() {
  try {
    // Option 1: Using Service Account (Recommended for server-side)
    if (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
      const auth = new google.auth.JWT(
        process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        null,
        process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        ['https://www.googleapis.com/auth/spreadsheets']
      );
      return google.sheets({ version: 'v4', auth });
    }
    
    // Option 2: Using API Key (if sheet is public)
    if (process.env.GOOGLE_API_KEY) {
      const auth = new google.auth.GoogleAuth({
        keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });
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

// Add data to Google Sheets
async function addToGoogleSheets(data) {
  try {
    if (!SPREADSHEET_ID) {
      console.log('Google Sheet ID not configured. Skipping Google Sheets update.');
      return false;
    }

    const sheets = await getGoogleSheetsClient();
    if (!sheets) {
      console.log('Google Sheets client not initialized. Skipping Google Sheets update.');
      return false;
    }

    // Prepare the row data
    const rowData = [
      new Date().toISOString(),
      data.name || '',
      data.email || '',
      data.phone || '',
      data.service || '',
      data.message || ''
    ];

    // Check if headers exist, if not, add them
    try {
      const headerResponse = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A1:F1`,
      });

      // If no headers exist, add them
      if (!headerResponse.data.values || headerResponse.data.values.length === 0) {
        await sheets.spreadsheets.values.append({
          spreadsheetId: SPREADSHEET_ID,
          range: `${SHEET_NAME}!A1`,
          valueInputOption: 'USER_ENTERED',
          resource: {
            values: [['Date', 'Name', 'Email', 'Phone', 'Service', 'Message']]
          }
        });
      }
    } catch (error) {
      // If sheet doesn't exist, create headers
      console.log('Creating headers in Google Sheet...');
      await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A1`,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [['Date', 'Name', 'Email', 'Phone', 'Service', 'Message']]
        }
      });
    }

    // Append the new row
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:F`,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [rowData]
      }
    });

    console.log('Data added to Google Sheet:', rowData);
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

