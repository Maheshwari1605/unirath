# 🚀 Install Node.js - Step by Step (macOS)

## You're seeing "command not found: npm" because Node.js isn't installed yet.

## ✅ Easiest Method: Download from Official Website

### Step 1: Download Node.js
1. **Open your web browser**
2. **Go to:** https://nodejs.org/
3. **Click the green button** that says **"Download Node.js (LTS)"**
   - LTS = Long Term Support (most stable version)
   - The file will be something like: `node-v20.x.x.pkg`

### Step 2: Install Node.js
1. **Open the downloaded .pkg file** (usually in your Downloads folder)
2. **Click through the installer**
   - Click "Continue" on each screen
   - Accept the license agreement
   - Click "Install"
   - Enter your Mac password when prompted
3. **Wait for installation to complete** (takes 1-2 minutes)

### Step 3: Verify Installation
1. **Close your current Terminal window** (important!)
2. **Open a NEW Terminal window**
3. **Type these commands one by one:**
   ```bash
   node --version
   ```
   You should see: `v20.x.x` or similar
   
   ```bash
   npm --version
   ```
   You should see: `10.x.x` or similar

### Step 4: Navigate to Your Project
```bash
cd /Users/maheshwarivasavi/Desktop/sagar_website/desinic-master
```

### Step 5: Install Dependencies
```bash
npm install
```
This will take 1-2 minutes. You'll see it downloading packages.

### Step 6: Start the Server
```bash
npm start
```

You should see:
```
Server is running on http://localhost:3000
Excel file initialized at: ...
```

### Step 7: Test the Form
1. **Open your browser**
2. **Go to:** `http://localhost:3000/contact.html`
3. **Fill out and submit the form**
4. **It should work now!** ✅

---

## 🔧 Alternative: Install via Homebrew (if you have it)

If you already have Homebrew installed, you can use:

```bash
brew install node
```

Then restart Terminal and continue from Step 4 above.

---

## ❓ Troubleshooting

### "Still says command not found after installing"
- **Close and reopen Terminal** (very important!)
- Try: `source ~/.zshrc` or `source ~/.bash_profile`
- Check if Node.js is in PATH: `echo $PATH`

### "Permission denied"
- Make sure you entered your Mac password during installation
- Try: `sudo npm install` (but this is usually not needed)

### "Port 3000 already in use"
- Another app is using port 3000
- Change port in `.env` file: `PORT=3001`
- Or stop the other application

---

## ✅ Once Node.js is Installed

After installation, you'll be able to:
- ✅ Run `npm install` to install dependencies
- ✅ Run `npm start` to start the server
- ✅ Use the contact form with Excel export and email notifications

---

## 📧 Need More Help?

If you're stuck at any step, let me know which step you're on and I'll help you!

