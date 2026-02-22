# Contact Form Setup Guide

## 1. Get Google Form Entry IDs

Your form submits data to this Google Form:
https://docs.google.com/forms/d/e/1FAIpQLSdLFuKtdFJ7UIXDoHMLrbwSzgpU2J9E72575MURMB0siI5W3g/viewform

To map your form fields correctly, you need the **entry IDs**:

1. Open the form above in Chrome
2. Press **F12** (or right-click -> Inspect)
3. Go to the **Console** tab
4. Paste and run:
   ```js
   [...document.querySelectorAll('[name^="entry."]')].forEach(i => console.log(i.name))
   ```
5. You'll see output like `entry.1045789234`, `entry.2012345678`, etc.
6. Match each entry ID to its question (in order: Full Name, Email, Phone, Type of Dispute, Your Message, Consent)
7. Open `form-config.js` and replace the placeholder `entry.XXXXXXXX` with your real IDs

---

## 2. Bi-Daily Email Summary (Every 2 Days)

To receive an email summary of new submissions every 2 days at **mediationmitra@gmail.com**:

1. Open the **Google Sheet** linked to your form (Form responses -> View responses in Sheets, or create a new Sheet and link it)
2. In the Sheet: **Extensions** -> **Apps Script**
3. Delete any existing code and paste this:

```javascript
function sendBiweeklySummary() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return; // No submissions

  const headers = data[0];
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  let newRows = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const timestamp = row[0]; // First column = timestamp
    if (timestamp && new Date(timestamp) > twoDaysAgo) {
      newRows.push(row);
    }
  }

  if (newRows.length === 0) return;

  let body = 'New Mediation Assistance requests (last 2 days):\n\n';
  newRows.forEach((row, idx) => {
    body += '--- Submission ' + (idx + 1) + ' ---\n';
    headers.forEach((h, j) => {
      if (row[j]) body += h + ': ' + row[j] + '\n';
    });
    body += '\n';
  });

  GmailApp.sendEmail('mediationmitra@gmail.com', 'Mediation Mitra – New Form Submissions', body);
}

function createTrigger() {
  ScriptApp.newTrigger('sendBiweeklySummary')
    .timeBased()
    .everyDays(2)
    .create();
}
```

4. Run **createTrigger** once: select the function in the dropdown, click **Run**
5. Authorize the script when prompted (it needs access to send email).

---

## Summary

- **form-config.js**: Update with your entry IDs from the Google Form
- **Bi-daily email**: Add the script above to the linked Google Sheet's Apps Script, run `createTrigger` once, and you'll receive summaries at mediationmitra@gmail.com
