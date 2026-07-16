# Amani House Invoice Generator

Generate Amani House booking invoices with business details, guest/reservation info, amounts, and payment details.

## How to use

1. Open `index.html` in a browser (double-click or drag into Chrome/Edge/Firefox).
2. Fill in the form: business info, invoice number/date, guest and reservation, amounts, and payment details.
3. **Preview Invoice** fills the invoice preview with your data (number of nights and balance due are calculated automatically).
4. **Print / Save as PDF** updates the preview and opens the print dialog—choose “Save as PDF” to download.

## Logo

The invoice uses **logo.svg** (the Amani House crescent-and-star mark with wordmark) as both the browser tab icon and the logo on the invoice. To use a different logo file, replace `logo.svg` in this folder, or point the `<link rel="icon">` and `#invoice-logo-img` `src` in `index.html` at your own image.

## Files

- `index.html` – Form and invoice layout
- `styles.css` – Styling and print styles
- `app.js` – Form logic, auto-calculations, preview and print
- `logo.svg` – Amani House logo, used as favicon and on the invoice
