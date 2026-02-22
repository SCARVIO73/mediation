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
    fullName: 'entry.2005620554',   // Full Name *
    email: 'entry.1045781291',      // Email Address *
    phone: 'entry.1166974658',      // Phone Number (Optional)
    disputeType: 'entry.839337160', // Type of Dispute *
    message: 'entry.1633651624',    // Your Message *
    consent: 'entry.1941233845'     // Consent Checkbox *
  }
};
