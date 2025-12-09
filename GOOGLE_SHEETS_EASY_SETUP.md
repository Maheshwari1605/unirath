# 🚀 Easy Google Sheets Setup (No Service Account Needed!)

This method uses Google Apps Script - works with any Google account, including organization accounts with restrictions.

## Step 1: Create Your Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com)
2. Click **+ Blank** to create a new spreadsheet
3. Name it: `Customer Inquiries`
4. In Row 1, add these headers:

| A | B | C | D | E | F |
|---|---|---|---|---|---|
| Date | Name | Email | Phone | Service | Message |

5. Rename the sheet tab (bottom) to `Sheet1` if it's not already

## Step 2: Create the Apps Script

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. Delete any code you see in the editor
3. Copy and paste this entire code:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      new Date().toISOString(),
      data.name || '',
      data.email || '',
      data.phone || '',
      data.service || '',
      data.message || ''
    ]);
    
    // Send email notification (optional)
    var emailTo = 'support@unirathinfo.com'; // Change to your email
    var subject = 'New Customer Inquiry - UNIRATH INFOTECH';
    var body = 'New inquiry received:\n\n' +
               'Name: ' + data.name + '\n' +
               'Email: ' + data.email + '\n' +
               'Phone: ' + (data.phone || 'Not provided') + '\n' +
               'Service: ' + (data.service || 'Not specified') + '\n' +
               'Message: ' + data.message;
    
    try {
      MailApp.sendEmail(emailTo, subject, body);
    } catch (mailError) {
      console.log('Email failed: ' + mailError);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: 'Data saved!' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function (optional)
function testPost() {
  var testData = {
    postData: {
      contents: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        service: 'RCM',
        message: 'This is a test message'
      })
    }
  };
  var result = doPost(testData);
  console.log(result.getContent());
}
```

4. Click the **Save** button (💾 icon) or press Ctrl+S
5. Name the project: `Unirath Form Handler`

## Step 3: Deploy as Web App

1. Click **Deploy** (blue button, top right) → **New deployment**
2. Click the **gear icon** ⚙️ next to "Select type"
3. Select **Web app**
4. Fill in:
   - **Description:** `Form Handler v1`
   - **Execute as:** `Me (your-email@gmail.com)`
   - **Who has access:** `Anyone`
5. Click **Deploy**
6. Click **Authorize access**
7. Choose your Google account
8. Click **Advanced** → **Go to Unirath Form Handler (unsafe)**
9. Click **Allow**
10. **COPY THE WEB APP URL** - it looks like:
    ```
    https://script.google.com/macros/s/AKfycbx.../exec
    ```

## Step 4: Add URL to Render

1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click on your service
3. Go to **Environment** tab
4. Add this variable:

| Key | Value |
|-----|-------|
| `GOOGLE_APPS_SCRIPT_URL` | `https://script.google.com/macros/s/AKfycbx.../exec` |

5. Click **Save Changes**
6. Wait for redeploy (2-3 minutes)

## Step 5: Test It!

1. Go to your website's contact page
2. Submit a test form
3. Check your Google Sheet - you should see the new row! 🎉

---

## Bonus: Email Notifications from Apps Script

The code above already includes email notifications! It will:
- ✅ Save data to Google Sheets
- ✅ Send email to `support@unirathinfo.com`

To change the notification email, edit this line in the Apps Script:
```javascript
var emailTo = 'support@unirathinfo.com'; // Change to your email
```

Then: **Deploy** → **New deployment** → Copy new URL → Update in Render

---

## Troubleshooting

### "Authorization required" error
- Make sure you completed the authorization steps (Step 3, items 6-9)

### Data not appearing in sheet
- Check the Apps Script execution logs: **Extensions** → **Apps Script** → **Executions**
- Verify the Web App URL is correct in Render

### "Script function not found: doPost"
- Make sure you saved the Apps Script after pasting the code
- The function name must be exactly `doPost`

### Need to update the script?
After making changes:
1. Click **Deploy** → **Manage deployments**
2. Click the **pencil icon** ✏️
3. Change version to **New version**
4. Click **Deploy**
5. Use the SAME URL (no need to update Render)

---

## Summary

| What | Where |
|------|-------|
| Your data | Google Sheets |
| Email notifications | Sent by Google Apps Script |
| No service account | ✅ Not needed! |
| Works with org accounts | ✅ Yes! |

