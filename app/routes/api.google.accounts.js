import { json } from "@remix-run/node";
import prisma from "../db.server";
import { getValidAccessTokenForShop } from "../utils/googleTokens";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");
  if (!shop) return new Response("shop required", { status: 400 });

  const tokens = await prisma.googleTokens.findUnique({ where: { shop } });
  if (!tokens) return new Response("not connected", { status: 401 });

  try {
    const accessToken = await getValidAccessTokenForShop(shop);
    const resp = await fetch("https://businessprofile.googleapis.com/v1/accounts", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!resp.ok) {
      const err = await resp.text();
      console.error("BP API error:", err);
      return new Response("BP API error", { status: resp.status });
    }

    const data = await resp.json();
    return json({ connected: true, accounts: data });
  } catch (err) {
    console.error(err);
    return new Response("error", { status: 500 });
  }
};
