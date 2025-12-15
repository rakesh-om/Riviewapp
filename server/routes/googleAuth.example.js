// Example Express route handlers for Google OAuth 2.0
// Paste/adapt this into your server if you use Express. This is NOT wired to Remix by default.
// Replace the DB save/load code with your own persistence logic.

import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';

const router = express.Router();

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

function generateState(req) {
  const state = crypto.randomBytes(16).toString('hex');
  // store in session for CSRF validation
  if (req.session) req.session.google_oauth_state = state;
  return state;
}

// Start OAuth flow — returns JSON { url }
router.get('/auth/google', (req, res) => {
  // Prefer server-side shop/session lookup — do NOT trust client-provided shop param
  const shop = req.session?.shop || req.query.shop || '';
  if (!shop) return res.status(400).json({ error: 'Missing shop in session' });

  const state = generateState(req);

  const scopes = [
    'https://www.googleapis.com/auth/business.manage',
    'openid',
    'email',
    'profile'
  ];

  const url = client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: scopes,
    state
  });

  // Return URL as JSON — front-end should set window.top.location.href = url to break out of iframe
  res.json({ url });
});

// Callback: exchange code and persist tokens
router.get('/auth/google/callback', async (req, res) => {
  const { code, state } = req.query;
  if (!code || !state) return res.status(400).send('Missing code/state');

  if (!req.session?.google_oauth_state || req.session.google_oauth_state !== state) {
    return res.status(400).send('Invalid state');
  }
  delete req.session.google_oauth_state;

  try {
    const r = await client.getToken(code);
    const tokens = r.tokens; // { access_token, refresh_token, ... }

    // TODO: Save tokens securely in your database associated with the shop (req.session.shop)
    // Example: await db.saveGoogleTokens(req.session.shop, tokens);

    // Optionally fetch accounts now and save them too.

    // Redirect back into your app (adjust as needed)
    const goto = req.session?.postAuthRedirect || '/app/settings';
    res.redirect(goto);
  } catch (err) {
    console.error('Google token exchange error', err);
    res.status(500).send('Auth failed');
  }
});

export default router;
