# How to Install Node.js and Start the Server

## Quick Installation Guide

### For macOS:

#### Option 1: Using Homebrew (Recommended)
1. Open Terminal
2. Install Homebrew (if not already installed):
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```
3. Install Node.js:
   ```bash
   brew install node
   ```
4. Verify installation:
   ```bash
   node --version
   npm --version
   ```

#### Option 2: Using Official Installer
1. Visit: https://nodejs.org/
2. Download the LTS (Long Term Support) version for macOS
3. Run the installer and follow the prompts
4. Restart your terminal

### For Windows:
1. Visit: https://nodejs.org/
2. Download the LTS version for Windows
3. Run the installer (.msi file)
4. Follow the installation wizard
5. Restart your computer (recommended)

### For Linux (Ubuntu/Debian):
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

## After Installing Node.js

1. **Open Terminal/Command Prompt** in the project directory:
   ```bash
   cd /Users/maheshwarivasavi/Desktop/sagar_website/desinic-master
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the server**:
   ```bash
   npm start
   ```

4. **Open your browser** and go to:
   ```
   http://localhost:3000/contact.html
   ```

## Verify It's Working

You should see in the terminal:
```
Server is running on http://localhost:3000
Excel file initialized at: /path/to/customer_inquiries.xlsx
```

## Troubleshooting

### "command not found: node"
- Node.js is not installed or not in your PATH
- Try restarting your terminal
- On macOS, you may need to add Node.js to your PATH

### "npm: command not found"
- npm comes with Node.js, so if this error appears, Node.js installation may be incomplete
- Reinstall Node.js

### "Port 3000 already in use"
- Another application is using port 3000
- Change the port in `.env` file: `PORT=3001`
- Or stop the other application

### Still having issues?
- Check Node.js version: `node --version` (should be v14 or higher)
- Check npm version: `npm --version`
- Make sure you're in the correct directory: `pwd` (should show the desinic-master folder)

