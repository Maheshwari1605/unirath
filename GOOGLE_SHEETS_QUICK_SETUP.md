# 🚀 Quick Google Sheets Setup (5 Minutes)

## What This Does
Every time someone submits your contact form, the data will automatically be added to your Google Sheet in real-time!

## Quick Setup Steps

### 1. Create a Google Sheet
- Go to [Google Sheets](https://sheets.google.com)
- Create a new sheet or use an existing one
- Name it whatever you want (e.g., "Customer Inquiries")

### 2. Get Your Spreadsheet ID
- Look at the URL: `https://docs.google.com/spreadsheets/d/ABC123XYZ/edit`
- Copy the part between `/d/` and `/edit` (that's your Spreadsheet ID)

### 3. Set Up Google Cloud (One-Time Setup)

#### A. Go to Google Cloud Console
- Visit: https://console.cloud.google.com/
- Sign in with your Google account

#### B. Create a Project
- Click "Select a project" → "New Project"
- Name it: "Unirath Forms" (or any name)
- Click "Create"

#### C. Enable Google Sheets API
- In the search bar, type: "Google Sheets API"
- Click on it → Click "Enable"

#### D. Create Service Account
- Go to "APIs & Services" → "Credentials" (left sidebar)
- Click "Create Credentials" → "Service Account"
- Name: "sheets-service"
- Click "Create and Continue" → Skip optional steps → "Done"

#### E. Create Key
- Click on the service account you just created
- Go to "Keys" tab
- Click "Add Key" → "Create new key"
- Select "JSON" → Click "Create"
- **A file will download** - keep it safe!

### 4. Share Your Sheet with Service Account
- Open the downloaded JSON file
- Find `"client_email"` (looks like: `something@project.iam.gserviceaccount.com`)
- Copy that email
- Go back to your Google Sheet
- Click "Share" (top right)
- Paste the email
- Give it "Editor" permission
- Click "Send"

### 5. Configure Your Server
- Open the downloaded JSON file
- Copy these values:
  - `client_email` → This is your `GOOGLE_SERVICE_ACCOUNT_EMAIL`
  - `private_key` → This is your `GOOGLE_PRIVATE_KEY` (keep the quotes and `\n`)

- Create/Edit `.env` file in your project folder:

```env
# Google Sheets Configuration
GOOGLE_SHEET_ID=paste-your-spreadsheet-id-here
GOOGLE_SHEET_NAME=Inquiries
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour full private key here\n-----END PRIVATE KEY-----\n"
```

**Important Notes:**
- Replace `paste-your-spreadsheet-id-here` with your actual Spreadsheet ID
- Replace the email and private key with values from your JSON file
- Keep the quotes around `GOOGLE_PRIVATE_KEY`
- Keep the `\n` as literal text (don't convert to actual newlines)

### 6. Install Google API Package
```bash
cd /Users/maheshwarivasavi/Desktop/sagar_website/desinic-master
npm install
```

### 7. Start Your Server
```bash
npm start
```

### 8. Test It!
- Submit a test form from your website
- Check your Google Sheet - you should see a new row! 🎉

## Troubleshooting

**"Permission denied" error?**
- Make sure you shared the sheet with the service account email
- Double-check the email address matches exactly

**"Sheet not found" error?**
- Verify your `GOOGLE_SHEET_ID` is correct
- Make sure the sheet name matches `GOOGLE_SHEET_NAME` (default: "Inquiries")

**Data not appearing?**
- Check server console for error messages
- Make sure Google Sheets API is enabled in Google Cloud Console
- Verify service account has "Editor" permission on the sheet

## What Gets Saved?

Each form submission creates a row with:
- **Date** - Timestamp of submission
- **Name** - Customer name
- **Email** - Customer email
- **Phone** - Customer phone (if provided)
- **Service** - Service they're interested in
- **Message** - Their message

Headers are created automatically on first submission!

