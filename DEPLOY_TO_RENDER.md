# 🚀 Deploy to Render - Step by Step Guide

## Overview

Render.com will host your complete website including:
- ✅ All HTML pages (Home, About, Services, Contact, etc.)
- ✅ Your Node.js backend (form handling)
- ✅ Email notifications
- ✅ Google Sheets integration (optional)

**Cost:** FREE (with some limitations on free tier)

---

## Step 1: Create a GitHub Account (if you don't have one)

1. Go to [github.com](https://github.com)
2. Click "Sign up"
3. Follow the registration process

---

## Step 2: Upload Your Code to GitHub

### Option A: Using GitHub Website (Easiest)

1. Go to [github.com](https://github.com) and sign in
2. Click the **+** icon (top right) → **New repository**
3. Name it: `unirath-infotech-website`
4. Keep it **Public** (free hosting) or **Private**
5. Click **Create repository**
6. Click **uploading an existing file**
7. Drag and drop ALL files from your `desinic-master` folder
8. Click **Commit changes**

### Option B: Using Terminal (Advanced)

```bash
cd /Users/maheshwarivasavi/Desktop/sagar_website/desinic-master

# Initialize git repository
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Unirath Infotech website"

# Add your GitHub repository as remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/unirath-infotech-website.git

# Push to GitHub
git push -u origin main
```

---

## Step 3: Deploy to Render

### 3.1 Create Render Account

1. Go to [render.com](https://render.com)
2. Click **Get Started for Free**
3. Sign up with **GitHub** (recommended) or email

### 3.2 Create New Web Service

1. Click **New +** → **Web Service**
2. Connect your GitHub account (if not already connected)
3. Find and select your repository (`unirath-infotech-website`)
4. Click **Connect**

### 3.3 Configure Your Service

Fill in these settings:

| Setting | Value |
|---------|-------|
| **Name** | `unirath-infotech` |
| **Region** | Choose closest to your users (e.g., Oregon for US) |
| **Branch** | `main` |
| **Root Directory** | Leave empty |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` |
| **Instance Type** | `Free` |

### 3.4 Add Environment Variables

Scroll down to **Environment Variables** and add:

#### Required for Email Notifications:

| Key | Value |
|-----|-------|
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | Your Gmail address |
| `SMTP_PASS` | Your Gmail App Password* |
| `NOTIFICATION_EMAIL` | Email to receive notifications |

*To get Gmail App Password:
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Step Verification
3. Go to "App passwords"
4. Generate a new app password for "Mail"

#### Optional for Google Sheets:

| Key | Value |
|-----|-------|
| `GOOGLE_SHEET_ID` | Your spreadsheet ID |
| `GOOGLE_SHEET_NAME` | `Inquiries` |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Service account email |
| `GOOGLE_PRIVATE_KEY` | Service account private key |

### 3.5 Deploy

1. Click **Create Web Service**
2. Wait for deployment (2-5 minutes)
3. Your site will be live at: `https://unirath-infotech.onrender.com`

---

## Step 4: Custom Domain (Optional)

Want to use your own domain (e.g., `www.unirathinfotech.com`)?

### 4.1 In Render Dashboard

1. Go to your service → **Settings** → **Custom Domains**
2. Click **Add Custom Domain**
3. Enter your domain: `www.unirathinfotech.com`
4. Render will show you DNS records to add

### 4.2 In Your Domain Provider

Add these DNS records (example for GoDaddy, Namecheap, etc.):

| Type | Name | Value |
|------|------|-------|
| CNAME | www | `unirath-infotech.onrender.com` |

For root domain (`unirathinfotech.com` without www):
| Type | Name | Value |
|------|------|-------|
| A | @ | Render's IP (shown in dashboard) |

---

## Quick Reference

### Your URLs After Deployment

- **Website:** `https://unirath-infotech.onrender.com`
- **Contact API:** `https://unirath-infotech.onrender.com/api/contact`
- **Health Check:** `https://unirath-infotech.onrender.com/api/health`

### Updating Your Website

After making changes locally:

```bash
cd /Users/maheshwarivasavi/Desktop/sagar_website/desinic-master
git add .
git commit -m "Updated website"
git push
```

Render will automatically redeploy! (takes 2-3 minutes)

---

## Troubleshooting

### "Build failed" Error
- Check if `package.json` exists in your repository
- Verify Node.js version compatibility

### Forms Not Working
- Check Environment Variables are set correctly in Render dashboard
- View logs: Render Dashboard → Your Service → Logs

### Site Not Loading
- Wait a few minutes after deployment
- Check if the service is "Live" in Render dashboard
- Free tier services "spin down" after 15 minutes of inactivity (first request may take 30 seconds)

### Email Not Sending
- Verify SMTP credentials are correct
- Make sure you're using App Password (not regular Gmail password)
- Check spam folder

---

## Free Tier Limitations

Render's free tier includes:
- ✅ 750 hours/month (enough for one service 24/7)
- ✅ Automatic HTTPS
- ✅ Continuous deployment from GitHub
- ⚠️ Service spins down after 15 min inactivity (cold starts)
- ⚠️ Limited to 100GB bandwidth/month

For production with no cold starts, consider upgrading to Starter ($7/month).

---

## Need Help?

- Render Documentation: https://render.com/docs
- Render Community: https://community.render.com

