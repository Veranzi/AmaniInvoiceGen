# Amani House Invoice Generator

Generate Amani House booking invoices with business details, guest/reservation info, amounts, and payment details.

## How to use

1. Open `index.html` in a browser (double-click or drag into Chrome/Edge/Firefox).
2. Fill in the form: business info, invoice number/date, guest and reservation, amounts, and payment details.
3. **Preview Invoice** fills the invoice preview with your data (number of nights and balance due are calculated automatically).
4. **Print / Save as PDF** updates the preview and opens the print dialog—choose “Save as PDF” to download.

## Logo

The invoice uses **logo.svg** (the Amani House crescent-and-star mark with wordmark) as both the browser tab icon and the logo on the invoice. To use a different logo file, replace `logo.svg` in this folder, or point the `<link rel="icon">` and `#invoice-logo-img` `src` in `index.html` at your own image.

## Audit & analysis (Google Sheets sync)

Every time you click **Preview Invoice** or **Print / Save as PDF**, the app sends the invoice data to a Google Sheet, so you end up with a running log of every invoice for audits, revenue analysis, outstanding-balance tracking, etc.

This requires hosting the app on **Vercel** (or another platform that supports serverless functions) — the browser calls a same-origin `/api/save-invoice` endpoint, which forwards the request to Google Apps Script server-side. This keeps the actual Apps Script URL out of the repo and out of client-side code entirely; it only ever lives in Vercel's environment variables. Opening `index.html` directly from disk (no server) still works for filling out and printing invoices, it just won't sync to Sheets.

Setup (one-time):

**1. Google side**
1. Create a new Google Sheet (any name).
2. In the Sheet, go to **Extensions > Apps Script**, delete the placeholder code, and paste in the contents of [`google-apps-script.gs`](google-apps-script.gs).
3. Click **Deploy > New deployment**. Choose type **Web app**, set **Execute as: Me**, **Who has access: Anyone**, then **Deploy**. Authorize the permissions Google asks for.
4. Copy the **Web app URL** it gives you.

**2. Vercel side**
1. Import this repo as a new Vercel project (vercel.com/new).
2. In **Project Settings > Environment Variables**, add `SHEET_WEBHOOK_URL` = the Web app URL from step 1.4 above.
3. Deploy (or redeploy if it already deployed before you added the variable).

Once configured, invoices are appended as rows to an `Invoices` sheet (created automatically on first sync). Re-previewing or re-printing the same invoice number updates its existing row instead of creating a duplicate, so the sheet always reflects the latest version of each invoice. Each row includes all business/guest/reservation/amount fields as plain columns (usable directly in pivot tables and sums), plus the line items and payment-method details as JSON in their own columns for reference.

Note: syncing is fire-and-forget — if there's no internet connection or the environment variable is missing, the invoice still previews/prints normally, it just won't be logged.

## Files

- `index.html` – Form and invoice layout
- `styles.css` – Styling and print styles
- `app.js` – Form logic, auto-calculations, preview, print, and Sheets sync
- `logo.svg` – Amani House logo, used as favicon and on the invoice
- `api/save-invoice.js` – Vercel serverless function that forwards invoice records to Google Sheets, keeping the real Apps Script URL server-side only
- `google-apps-script.gs` – Paste into a Google Sheet's Apps Script editor to receive invoice records (see "Audit & analysis" above)
