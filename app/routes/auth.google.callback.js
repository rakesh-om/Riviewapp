import { redirect } from "@remix-run/node";
import prisma from "../db.server";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code || !state) {
    return new Response("Missing code or state", { status: 400 });
  }

  const stateRec = await prisma.googleOAuthState.findUnique({ where: { state } });
  if (!stateRec) return new Response("Invalid or expired state", { status: 400 });

  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return new Response("Server misconfiguration: missing Google client credentials", { status: 500 });
  }

  // --- FIX START: FORCE HTTPS ---
  // Ensure this logic matches auth.google.js exactly.
  // We ignore url.protocol (which might be http) and force https.
  const currentHost = "https://" + url.host;
  
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${currentHost}/auth/google/callback`;
  
  console.log("DEBUG: Callback using Redirect URI:", redirectUri);
  // --- FIX END ---

  const params = new URLSearchParams({
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: redirectUri, 
    grant_type: "authorization_code",
  });

  const tokenResp = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!tokenResp.ok) {
    const errText = await tokenResp.text();
    console.error("Google token exchange error:", errText);
    return new Response("Token exchange failed", { status: 500 });
  }

  const tokenData = await tokenResp.json();
  const expiresAt = new Date(Date.now() + (tokenData.expires_in * 1000));

  // Upsert tokens
  await prisma.googleTokens.upsert({
    where: { shop: stateRec.shop },
    update: {
      accessToken: tokenData.access_token,
      // Only update refresh token if Google sent a new one
      ...(tokenData.refresh_token && { refreshToken: tokenData.refresh_token }),
      expiresAt,
    },
    create: {
      shop: stateRec.shop,
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token || "", // Important: Refresh token is only sent once!
      expiresAt,
    },
  });

  // Cleanup
  await prisma.googleOAuthState.delete({ where: { state } });

  // Redirect back to Shopify App Dashboard
  return redirect(`/app?status=connected&shop=${stateRec.shop}`);
};