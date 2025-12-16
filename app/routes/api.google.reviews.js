import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { OAuth2Client } from "google-auth-library";

// 🔥 Ye 'loader' function hi API hai.
export const loader = async ({ request }) => {
  console.log("-----------------------------------------");
  console.log("🚀 API HIT: Fetching Reviews...");
  
  // 1. Check karo user logged in hai ya nahi
  const { session } = await authenticate.admin(request);
  
  // 2. Database se token nikalo
  const tokenRecord = await prisma.googleTokens.findUnique({
    where: { shop: session.shop },
  });

  if (!tokenRecord) {
    console.log("❌ Error: Token not found in DB");
    return json({ error: "Not connected" }, { status: 401 });
  }

  // 3. Google Client Setup
  const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  client.setCredentials({
    access_token: tokenRecord.accessToken,
    refresh_token: tokenRecord.refreshToken,
  });

  try {
    // --- STEP A: Account ID nikalo ---
    const accountsResp = await client.request({
      url: "https://mybusinessaccountmanagement.googleapis.com/v1/accounts",
    });

    const accounts = accountsResp.data.accounts;
    if (!accounts || accounts.length === 0) {
      console.log("⚠️ No Google Business Account found. Sending Mock Data.");
      return json(getMockData("No Account Found"));
    }

    const accountName = accounts[0].name; // e.g., "accounts/12345"
    console.log("✅ Account Found:", accountName);

    // --- STEP B: Location ID nikalo ---
    const locationsResp = await client.request({
      url: `https://mybusinessbusinessinformation.googleapis.com/v1/${accountName}/locations?readMask=name,title`,
    });

    const locations = locationsResp.data.locations;
    if (!locations || locations.length === 0) {
       console.log("⚠️ Account has no Verified Locations. Sending Mock Data.");
       return json(getMockData("Account Found, No Location"));
    }
    
    const locationName = locations[0].name; // e.g., "locations/98765"
    const locationTitle = locations[0].title;
    console.log("✅ Location Found:", locationTitle);

    // --- STEP C: Real Reviews Nikalo ---
    const reviewsResp = await client.request({
      url: `https://mybusiness.googleapis.com/v4/${accountName}/${locationName}/reviews`,
    });

    const reviews = reviewsResp.data.reviews || [];
    console.log(`✅ Success! Found ${reviews.length} Real Reviews.`);

    return json({ 
      success: true, 
      businessName: locationTitle,
      reviews: reviews 
    });

  } catch (error) {
    console.error(" Google API Error:", error.message);
    // Agar koi error aaye (jaise permission issue), toh Mock Data bhej do
    return json(getMockData("API Error: " + error.message));
  }
};


function getMockData(reason) {
  return {
    success: true,
    businessName: `Demo Store (${reason})`,
    reviews: [
      {
        reviewer: { displayName: "Amit Kumar" },
        starRating: "FIVE",
        comment: "This is a fake review because real data wasn't found."
      },
      {
        reviewer: { displayName: "Sara Khan" },
        starRating: "FOUR",
        comment: "Integration is working, just need a verified business account."
      }
    ]
  };
}