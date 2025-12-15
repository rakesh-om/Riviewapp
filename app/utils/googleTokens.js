import prisma from "../db.server";

export async function refreshAccessTokenForShop(shop) {
  const rec = await prisma.googleTokens.findUnique({ where: { shop } });
  if (!rec || !rec.refreshToken) throw new Error("No refresh token");

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID || "",
    client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
    grant_type: "refresh_token",
    refresh_token: rec.refreshToken,
  });

  const resp = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!resp.ok) throw new Error("Refresh failed: " + (await resp.text()));
  const data = await resp.json();

  const expiresAt = new Date(Date.now() + (data.expires_in * 1000));
  await prisma.googleTokens.update({ where: { shop }, data: { accessToken: data.access_token, expiresAt } });

  return data.access_token;
}

export async function getValidAccessTokenForShop(shop) {
  const rec = await prisma.googleTokens.findUnique({ where: { shop } });
  if (!rec) throw new Error("No tokens for shop");

  // If access token exists and not expired (give 60s buffer), return it
  if (rec.accessToken && rec.expiresAt) {
    const expiresAt = new Date(rec.expiresAt).getTime();
    if (expiresAt - Date.now() > 60 * 1000) {
      return rec.accessToken;
    }
  }

  // Otherwise try to refresh
  if (rec.refreshToken) {
    return await refreshAccessTokenForShop(shop);
  }

  throw new Error("No valid access token and no refresh token available");
}

export default { refreshAccessTokenForShop, getValidAccessTokenForShop };
