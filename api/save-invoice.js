// Vercel serverless function. Keeps the Google Apps Script Web App URL out of
// client-side code and out of the repo — set it as an environment variable
// named SHEET_WEBHOOK_URL in the Vercel project settings instead.
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  const targetUrl = process.env.SHEET_WEBHOOK_URL;
  if (!targetUrl) {
    res.status(500).json({ ok: false, error: 'SHEET_WEBHOOK_URL not configured' });
    return;
  }

  try {
    const upstream = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(req.body)
    });
    const text = await upstream.text();
    res.status(upstream.status).send(text);
  } catch (err) {
    res.status(502).json({ ok: false, error: String(err) });
  }
};
