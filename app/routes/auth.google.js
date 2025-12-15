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
    console.error("Missing GOOGLE_CLIENT_ID environment variable. Set GOOGLE_CLIENT_ID to your Google OAuth client ID.");
    return json({ error: "Missing GOOGLE_CLIENT_ID" }, { status: 500 });
  }

  // prefer explicit env var, otherwise construct a redirect URI from request origin
  // NOTE: Google expects the path to be /auth/google/callback (not auth.google.callback)
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${url.origin}/auth/google/callback`;
  if (!process.env.GOOGLE_REDIRECT_URI) {
    // helpful log for local/dev setups
    console.warn("GOOGLE_REDIRECT_URI not set; using computed redirect URI:", redirectUri);
  }

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID || "",
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "https://www.googleapis.com/auth/business.manage",
    access_type: "offline",
    prompt: "consent",
    state,
  });

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  return json({ url: authUrl });
};

export const headers = () => ({ "Cache-Control": "no-store" });
