/**
 * Google Form submission config for Contact page
 * Form: https://docs.google.com/forms/d/e/1FAIpQLSdLFuKtdFJ7UIXDoHMLrbwSzgpU2J9E72575MURMB0siI5W3g/viewform
 *
 * To get your entry IDs:
 * 1. Open the form above in Chrome
 * 2. Right-click > Inspect (or F12)
 * 3. Go to Console tab
 * 4. Paste and run: [...document.querySelectorAll('[name^="entry."]')].forEach(i=>console.log(i.name))
 * 5. Copy the numbers from each "entry.XXXXXX" into the object below
 */
window.GOOGLE_FORM_CONFIG = {
  formResponseUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSdLFuKtdFJ7UIXDoHMLrbwSzgpU2J9E72575MURMB0siI5W3g/formResponse',
  entries: {
    fullName: 'entry.XXXXXXXX',   // Full Name *
    email: 'entry.XXXXXXXX',     // Email Address *
    phone: 'entry.XXXXXXXX',     // Phone Number (Optional)
    disputeType: 'entry.XXXXXXXX', // Type of Dispute *
    message: 'entry.XXXXXXXX',   // Your Message *
    consent: 'entry.XXXXXXXX'    // Consent Checkbox *
  }
};
