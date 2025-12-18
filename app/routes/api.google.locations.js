import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { OAuth2Client } from "google-auth-library";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const tokenRecord = await prisma.googleTokens.findUnique({
    where: { shop: session.shop },
  });

  if (!tokenRecord) return json({ error: "Not connected" }, { status: 401 });

  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
  client.setCredentials({
    access_token: tokenRecord.accessToken,
    refresh_token: tokenRecord.refreshToken,
  });

  try {
    // 1. Get Account ID
    const accountsResp = await client.request({
      url: "https://mybusinessaccountmanagement.googleapis.com/v1/accounts",
    });

    const accounts = accountsResp.data.accounts;
    if (!accounts || accounts.length === 0) return json(getMockLocations()); // Fallback to Mock

    const accountName = accounts[0].name;

    // 2. Get All Locations
    const locationsResp = await client.request({
      url: `https://mybusinessbusinessinformation.googleapis.com/v1/${accountName}/locations?readMask=name,title,storeCode`,
    });

    const locations = locationsResp.data.locations;
    if (!locations || locations.length === 0) return json(getMockLocations());

    // Data Clean karke bhejo
    const formattedLocations = locations.map(loc => ({
      name: loc.name, // e.g., "locations/123456" (Ye ID backend ke liye zaroori hai)
      title: loc.title // e.g., "Rahul's Pizza Shop" (Ye user ko dikhega)
    }));

    return json({ locations: formattedLocations });

  } catch (error) {
    console.error("Locations Fetch Error:", error.message);
    return json(getMockLocations()); 
  }
};


function getMockLocations() {
  return {
    locations: [
      { name: "locations/mock1", title: "Start billing so that real review will visible" }
    ]
  };
}