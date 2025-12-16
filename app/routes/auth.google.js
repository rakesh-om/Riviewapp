import { json } from "@remix-run/node";
import crypto from "crypto";
import prisma from "../db.server";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop") || "unknown-shop";

  const state = crypto.randomBytes(16).toString("hex");

  // persist state in DB (short lived)
  try {
    await prisma.googleOAuthState.create({ data: { state, shop } });
  } catch (e) {
    console.error("Failed to create googleOAuthState:", e);
  }

  // make sure client id is present
  if (!process.env.GOOGLE_CLIENT_ID) {
    console.error("Missing GOOGLE_CLIENT_ID environment variable.");
    return json({ error: "Missing GOOGLE_CLIENT_ID" }, { status: 500 });
  }

  // --- UPDATE START: Force HTTPS for ngrok ---
  // url.origin might be 'http' locally, which Google rejects. We force 'https'.
  const currentHost = "https://" + url.host;
  
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${currentHost}/auth/google/callback`;
  
  console.log("DEBUG: Google Redirect URI being sent:", redirectUri);
  // --- UPDATE END ---

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID || "",
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "https://www.googleapis.com/auth/business.manage", // Make sure this scope is enabled in Google Console
    access_type: "offline",
    prompt: "consent",
    state,
  });

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  return json({ url: authUrl });
};

export const headers = () => ({ "Cache-Control": "no-store" });