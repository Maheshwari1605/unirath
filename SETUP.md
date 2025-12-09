# Setup Instructions for Contact Form Backend

This guide will help you set up the backend server to handle contact form submissions, save them to Excel, and send email notifications.

## Prerequisites

- Node.js (v14 or higher) installed on your system
- An email account (Gmail recommended for easy setup)
- npm (comes with Node.js)

## Step 1: Install Dependencies

Open your terminal in the project directory and run:

```bash
npm install
```

This will install all required packages:
- `express` - Web server framework
- `cors` - Enable cross-origin requests
- `body-parser` - Parse request bodies
- `nodemailer` - Send emails
- `xlsx` - Read/write Excel files
- `dotenv` - Manage environment variables

## Step 2: Configure Email Settings

1. Create a `.env` file in the project root (copy from `.env.example`):

```bash
cp .env.example .env
```

2. Edit the `.env` file with your email configuration:

### For Gmail:

1. **Enable 2-Step Verification** on your Google account:
   - Go to https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Generate an App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter "UNIRATH INFOTECH Backend" as the name
   - Click "Generate"
   - Copy the 16-character password (no spaces)

3. **Update `.env` file**:
```env
PORT=3000
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-character-app-password
NOTIFICATION_EMAIL=support@unirathinfo.com
```

### For Other Email Providers:

**Outlook/Hotmail:**
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
```

**Yahoo:**
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_SECURE=false
```

**Custom SMTP:**
```env
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@domain.com
SMTP_PASS=your-password
```

## Step 3: Start the Server

### Development Mode (with auto-restart):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

The server will start on `http://localhost:3000` (or the port you specified in `.env`).

## Step 4: Test the Setup

1. Open `contact.html` in your browser (via the server: `http://localhost:3000/contact.html`)
2. Fill out the contact form
3. Submit the form
4. Check:
   - The form shows a success message
   - An Excel file `customer_inquiries.xlsx` is created in the project root
   - You receive an email notification at the address specified in `NOTIFICATION_EMAIL`

## How It Works

1. **Form Submission**: When a user submits the contact form, JavaScript sends the data to `/api/contact`
2. **Excel Storage**: The server saves the inquiry to `customer_inquiries.xlsx` with columns:
   - Date
   - Name
   - Email
   - Phone
   - Service
   - Message
3. **Email Notification**: An email is sent to the address in `NOTIFICATION_EMAIL` with all inquiry details

## File Structure

```
desinic-master/
├── server.js              # Backend server
├── package.json           # Dependencies
├── .env                   # Email configuration (create this)
├── .env.example           # Example configuration
├── customer_inquiries.xlsx # Generated Excel file (auto-created)
├── contact.html           # Contact form page
└── assets/
    └── js/
        └── script.js      # Form submission handler
```

## Production Deployment

### Option 1: Deploy to a VPS/Server

1. Upload your project files to the server
2. Install Node.js on the server
3. Run `npm install`
4. Create `.env` file with production settings
5. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start server.js --name "contact-backend"
   pm2 save
   pm2 startup
   ```

### Option 2: Deploy to Cloud Platforms

**Heroku:**
- Add `Procfile` with: `web: node server.js`
- Set environment variables in Heroku dashboard
- Deploy via Git

**Railway/Render:**
- Connect your repository
- Set environment variables in dashboard
- Deploy automatically

### Update API URL in Production

In `assets/js/script.js`, update the `apiUrl` variable to match your production server URL:

```javascript
const apiUrl = 'https://your-domain.com/api/contact';
```

## Troubleshooting

### Email Not Sending

1. **Check SMTP credentials** - Verify username and password are correct
2. **Check App Password** - For Gmail, make sure you're using an App Password, not your regular password
3. **Check firewall** - Ensure port 587 is not blocked
4. **Check email provider** - Some providers require enabling "Less secure app access" (not recommended for Gmail)

### Excel File Not Created

1. **Check file permissions** - Ensure the server has write permissions in the project directory
2. **Check server logs** - Look for error messages in the console

### Form Not Submitting

1. **Check browser console** - Look for JavaScript errors
2. **Check server logs** - Verify the server is running and accessible
3. **Check CORS** - Ensure CORS is properly configured for your domain

## Security Notes

- Never commit `.env` file to version control (it's in `.gitignore`)
- Use strong passwords for email accounts
- Consider using environment variables in production instead of `.env` file
- Regularly backup `customer_inquiries.xlsx` file

## Support

If you encounter any issues, check:
1. Server console logs for errors
2. Browser console for JavaScript errors
3. Email provider's documentation for SMTP settings

