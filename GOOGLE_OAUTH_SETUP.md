# Google OAuth Setup & Quick Checklist

This file explains the exact steps to enable Google OAuth for the "Add business" flow in this project.

Important security note: If you already published or pasted a client secret in chat or public places, rotate/regenerate the secret immediately in the Google Cloud Console and update your local environment.

1) Google Cloud Console
- Go to APIs & Services → Credentials → Create / Edit OAuth 2.0 Client ID (Web application).
- Add an Authorized redirect URI that matches your dev server/ngrok URL exactly (example below).

Example Redirect URI (use your ngrok URL):
```
https://db77f03e8187.ngrok-free.app/auth/google/callback
```

2) Local env vars (temporary for session)

PowerShell (Windows):
```powershell
$env:GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
$env:GOOGLE_CLIENT_SECRET="your-regenerated-client-secret"
$env:GOOGLE_REDIRECT_URI="https://db77f03e8187.ngrok-free.app/auth/google/callback"
# Optional (Places API):
$env:GOOGLE_PLACES_API_KEY="your-places-api-key"
# Start your dev server after setting these in the same shell
shopify app dev
```

Bash (mac / linux):
```bash
export GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
export GOOGLE_CLIENT_SECRET="your-regenerated-client-secret"
export GOOGLE_REDIRECT_URI="https://db77f03e8187.ngrok-free.app/auth/google/callback"
export GOOGLE_PLACES_API_KEY="your-places-api-key"
npm run dev
```

3) Routes used by this project
- Frontend expects a route to start auth: `/auth/google` (GET) — returns `{ url }`.
- Google will call your callback route: `/auth/google/callback` with `code` and `state`.
- After successful exchange your server should save tokens (including refresh_token) in DB and redirect back into the app.

If your project uses Remix (this repo does), you can either:
- Keep the sample Express code (copy `server/routes/googleAuth.example.js`) into an Express server and mount it, OR
- Implement equivalent Remix routes in `app/routes/auth.google.js` and `app/routes/auth.google.callback.js` that perform the same actions (state generation, token exchange, DB persistence).

4) Session & state
- Use server-side sessions (or DB) to save the `state` value for CSRF protection and to know which shop/user the tokens belong to.
- Do NOT trust `shop` or sensitive params sent from the client; prefer the server session.

5) Testing flow (quick)
1. Start your dev server (shopify app dev) and ngrok pointing to localhost:3000.
2. Update the Google Console redirect URI to use the ngrok HTTPS URL.
3. Open your app in the Shopify dev store and go to the page with the "Add business" button.
4. Click Add business → your frontend will call `/auth/google` and set `window.top.location.href` to the returned URL.
5. Complete consent on Google; Google will redirect to `/auth/google/callback` and your server will exchange code → tokens and redirect back to the app.

6) Common issues & troubleshooting
- Missing redirect_uri or client_id errors: ensure environment variables are set and the redirect URI matches the registered one exactly.
- `iframe` / embedded app issues: use `window.top.location.href = authUrl` to break out of the admin iframe.
- Missing refresh_token: if you don't get a refresh token, include `access_type=offline` and `prompt=consent` when generating the auth URL.
- Scopes like `business.manage` may require verification for production; for dev testing you can usually continue without verification.

7) Security reminders
- Rotate/regenerate the client secret immediately if it was exposed.
- Store tokens and secrets securely (DB encrypted or secret manager).
- Never commit secrets into git.

8) Next steps I can do for you (pick any):
- Implement Remix route versions of the example Express handlers and wire them into this repo.
- Add server-side token persistence examples (Prisma schema & migration) and a small helper to refresh tokens.
- Add automated smoke test that hits `/auth/google` and validates the generated URL parameters.
