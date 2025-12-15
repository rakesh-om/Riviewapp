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
  if (!stateRec) return new Response("Invalid state", { status: 400 });

  // exchange code for tokens
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.error("Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET environment variables.");
    return new Response("Server misconfiguration: missing Google client credentials", { status: 500 });
  }
  const params = new URLSearchParams({
    code,
    client_id: process.env.GOOGLE_CLIENT_ID || "",
    client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
    redirect_uri: process.env.GOOGLE_REDIRECT_URI || "",
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

  // upsert tokens for the shop
  await prisma.googleTokens.upsert({
    where: { shop: stateRec.shop },
    update: {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token ?? undefined,
      expiresAt,
    },
    create: {
      shop: stateRec.shop,
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token ?? "",
      expiresAt,
    },
  });

  // delete state record (cleanup)
  await prisma.googleOAuthState.delete({ where: { state } });

  const redirectTo = `/apps/riview-app?connected=1&shop=${encodeURIComponent(stateRec.shop)}`;
  return redirect(redirectTo);
};

export const headers = () => ({ "Cache-Control": "no-store" });
