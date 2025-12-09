# Install Node.js from Terminal - Two Options

## ✅ Option 1: Install the Downloaded Package (Easiest)

The installer has been downloaded to your project folder. Install it:

```bash
cd /Users/maheshwarivasavi/Desktop/sagar_website/desinic-master
open nodejs-installer.pkg
```

This will open the installer. Follow the on-screen instructions:
1. Click "Continue" through each screen
2. Accept the license
3. Click "Install"
4. Enter your Mac password

After installation, **close and reopen Terminal**, then verify:
```bash
node --version
npm --version
```

---

## ✅ Option 2: Use NVM (Node Version Manager) - Recommended for Terminal Users

NVM lets you easily install and switch between Node.js versions.

### Step 1: Install NVM
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

### Step 2: Reload Your Shell
```bash
source ~/.zshrc
```

### Step 3: Install Latest LTS Node.js
```bash
nvm install --lts
nvm use --lts
```

### Step 4: Verify Installation
```bash
node --version
npm --version
```

---

## 🚀 After Installation

Once Node.js is installed, continue with:

```bash
cd /Users/maheshwarivasavi/Desktop/sagar_website/desinic-master
npm install
npm start
```

---

## Which Option Should You Choose?

- **Option 1**: Quick and simple, uses the GUI installer
- **Option 2**: Better for developers, allows easy version switching

Both work perfectly! Choose whichever you prefer.

