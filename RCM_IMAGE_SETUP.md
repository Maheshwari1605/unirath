# RCM Service Card Image Setup

## ✅ Image Added to Service Card

I've added an image placeholder to the Revenue Cycle Management (RCM) service card on both:
- **Home page** (`index.html`)
- **Services page** (`services.html`)

## 📁 Image File Location

**Please add your RCM image here:**
```
desinic-master/assets/images/rcm-service.jpg
```

## 🖼️ Image Recommendations

For the best results, use an image that:
- **Dimensions:** 800x400px or similar (16:9 aspect ratio)
- **Format:** JPG or PNG
- **Content:** Healthcare billing, medical records, financial flow, or RCM process visualization
- **File size:** Under 500KB for fast loading

## 🎨 Image Styling

The image is styled with:
- **Height:** 200px (responsive)
- **Border radius:** Rounded corners
- **Hover effect:** Slight zoom on hover
- **Background:** Light blue gradient fallback if image doesn't load

## 🔧 If Your Image Has a Different Name

If your RCM image has a different filename, update the path in:
1. `index.html` - Line ~167
2. `services.html` - Line ~130

Change:
```html
<img src="./assets/images/rcm-service.jpg" alt="Revenue Cycle Management" class="service-img">
```

To:
```html
<img src="./assets/images/your-image-name.jpg" alt="Revenue Cycle Management" class="service-img">
```

## 📸 Free Image Resources

You can find free RCM/healthcare billing images from:
- **Unsplash:** https://unsplash.com/s/photos/healthcare-billing
- **Pexels:** https://www.pexels.com/search/medical%20billing/
- **Pixabay:** https://pixabay.com/images/search/healthcare%20finance/

Search terms: "healthcare billing", "medical billing", "revenue cycle", "healthcare finance"

## ✅ Current Status

- ✅ HTML structure updated
- ✅ CSS styling added
- ✅ Responsive design included
- ✅ Hover effects implemented
- ⏳ **Waiting for image file** (`rcm-service.jpg`)

Once you add the image file, it will automatically display in the service card!

