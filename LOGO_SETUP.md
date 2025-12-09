# Logo Setup Instructions

## ✅ Logo Integration Complete!

I've updated all pages to use your company logo image instead of text.

## 📁 Logo File Location

**Please place your logo file here:**
```
desinic-master/assets/images/logo.png
```

**Supported formats:**
- `logo.png` (recommended)
- `logo.svg` (for scalable vector logo)
- `logo.jpg` (if PNG not available)

## 🔧 If Your Logo Has a Different Name

If your logo file has a different name (e.g., `unirath-logo.png`), you can either:

1. **Rename your file** to `logo.png` and place it in `assets/images/`
2. **Or update the path** in all HTML files:
   - Search for: `./assets/images/logo.png`
   - Replace with: `./assets/images/your-logo-name.png`

## 📐 Logo Sizing

The CSS is set to automatically size your logo:
- **Header logo**: Max height 50px (auto width)
- **Mobile menu logo**: Max height 60px
- **Footer logo**: Max height 50px

If you need to adjust the size, edit `assets/css/style.css`:
```css
.logo {
  max-height: 50px; /* Change this value */
  width: auto;
}
```

## ✅ What's Been Updated

All 10 HTML pages now use the logo image:
- ✅ index.html (Home)
- ✅ about.html
- ✅ services.html
- ✅ contact.html
- ✅ privacy-policy.html
- ✅ rcm.html
- ✅ medical-records.html
- ✅ customer-support.html
- ✅ back-office.html
- ✅ it-automation.html

## 🎨 Logo Display Locations

Your logo will appear in:
1. **Header** (top left on all pages)
2. **Mobile Menu** (when menu is open)
3. **Footer** (bottom section)

## 🚀 Next Steps

1. **Add your logo file** to `assets/images/logo.png`
2. **Refresh your browser** to see the logo
3. **Adjust size if needed** in the CSS file

That's it! Your logo is ready to use! 🎉

