# Quick Start Guide - Fix "Unable to send message" Error

## The Problem
You're seeing the error because the backend server is not running. The contact form needs a server to process submissions.

## Solution Options

### Option 1: Install Node.js and Run the Server (Recommended)

#### Step 1: Install Node.js
1. **For macOS:**
   - Download from: https://nodejs.org/
   - Or use Homebrew: `brew install node`

2. **For Windows:**
   - Download installer from: https://nodejs.org/
   - Run the installer and follow the prompts

3. **For Linux:**
   ```bash
   # Ubuntu/Debian
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

#### Step 2: Install Dependencies
Open terminal in the project folder and run:
```bash
cd desinic-master
npm install
```

#### Step 3: Configure Email (Optional - for email notifications)
1. Copy `.env.example` to `.env`
2. Edit `.env` with your email settings (see SETUP.md for details)

#### Step 4: Start the Server
```bash
npm start
```

You should see:
```
Server is running on http://localhost:3000
Excel file initialized at: /path/to/customer_inquiries.xlsx
```

#### Step 5: Open the Contact Page
- Open your browser and go to: `http://localhost:3000/contact.html`
- The form should now work!

---

### Option 2: Use Python (Alternative)

If you prefer Python, I can create a Python script instead. Let me know!

---

### Option 3: Use a Form Service (No Server Required)

You can use a third-party service like:
- **Formspree** (free tier available)
- **EmailJS** (free tier available)
- **Google Forms** (free)

These don't require running your own server.

---

## Troubleshooting

### "npm: command not found"
- Node.js is not installed or not in your PATH
- Install Node.js from https://nodejs.org/

### "Cannot find module 'express'"
- Dependencies are not installed
- Run: `npm install`

### "Port 3000 already in use"
- Another application is using port 3000
- Change the port in `.env` file: `PORT=3001`

### Form still shows error
1. Make sure the server is running (check terminal)
2. Open browser console (F12) and check for errors
3. Verify you're accessing via `http://localhost:3000/contact.html` (not `file://`)

---

## Need Help?

If you're having trouble, let me know:
1. What operating system you're using
2. Whether Node.js is installed
3. Any error messages you see

