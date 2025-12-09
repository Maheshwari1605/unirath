# Google Sheets Integration Setup Guide

This guide will help you set up automatic updates to Google Sheets whenever a customer submits the contact form.

## Prerequisites

- A Google account
- Node.js installed (see `INSTALL_NODEJS.md` if needed)

## Method 1: Using Service Account (Recommended)

This is the most secure method for server-side applications.

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter a project name (e.g., "Unirath Infotech Forms")
4. Click "Create"

### Step 2: Enable Google Sheets API

1. In your project, go to "APIs & Services" → "Library"
2. Search for "Google Sheets API"
3. Click on it and click "Enable"

### Step 3: Create a Service Account

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "Service Account"
3. Enter a name (e.g., "sheets-service")
4. Click "Create and Continue"
5. Skip the optional steps and click "Done"

### Step 4: Create and Download Service Account Key

1. Click on the service account you just created
2. Go to the "Keys" tab
3. Click "Add Key" → "Create new key"
4. Select "JSON" format
5. Click "Create" (this downloads a JSON file)

### Step 5: Share Your Google Sheet with the Service Account

1. Open the downloaded JSON file
2. Copy the `client_email` value (e.g., `sheets-service@project-id.iam.gserviceaccount.com`)
3. Create a new Google Sheet or open an existing one
4. Click "Share" button (top right)
5. Paste the service account email
6. Give it "Editor" permissions
7. Click "Send" (you don't need to notify)

### Step 6: Get Your Spreadsheet ID

1. Open your Google Sheet
2. Look at the URL: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
3. Copy the `SPREADSHEET_ID` part (the long string between `/d/` and `/edit`)

### Step 7: Configure Environment Variables

1. Open the downloaded JSON key file
2. Copy the `client_email` value
3. Copy the `private_key` value (keep the quotes and newlines)
4. Open `.env` file (create it from `.env.example` if it doesn't exist)
5. Add the following:

```env
GOOGLE_SHEET_ID=your-spreadsheet-id-here
GOOGLE_SHEET_NAME=Inquiries
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project-id.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
```

**Important:** 
- Replace `your-spreadsheet-id-here` with your actual Spreadsheet ID
- Replace the email and private key with values from your JSON file
- Keep the quotes around the private key
- The `\n` in the private key should remain as literal `\n` (the code will convert them)

### Step 8: Install Dependencies and Start Server

```bash
npm install
npm start
```

## Method 2: Using OAuth 2.0 (Alternative)

If you prefer using OAuth 2.0 instead of a service account, you can:

1. Go to Google Cloud Console → "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Configure the OAuth consent screen
4. Create OAuth 2.0 credentials
5. Use the OAuth flow to authenticate

**Note:** Service Account is recommended as it doesn't require user interaction.

## Testing

1. Start your server: `npm start`
2. Submit a test form from your website
3. Check your Google Sheet - you should see a new row with the inquiry data
4. Check the server console for confirmation messages

## Troubleshooting

### Error: "The caller does not have permission"
- Make sure you shared the Google Sheet with the service account email
- Verify the service account email is correct in your `.env` file

### Error: "Requested entity was not found"
- Check that your `GOOGLE_SHEET_ID` is correct
- Verify the sheet name matches `GOOGLE_SHEET_NAME` (default: "Inquiries")

### Error: "Invalid credentials"
- Verify your `GOOGLE_PRIVATE_KEY` is correctly formatted with quotes
- Make sure the private key includes the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` lines

### Data not appearing in Google Sheet
- Check the server console for error messages
- Verify the Google Sheets API is enabled in your Google Cloud project
- Make sure the service account has "Editor" permissions on the sheet

## Sheet Structure

The system will automatically create headers if they don't exist:
- Date
- Name
- Email
- Phone
- Service
- Message

Each form submission will add a new row with this data.

## Security Notes

- Never commit your `.env` file to version control
- Keep your service account JSON key file secure
- The service account should only have access to the specific sheet it needs

