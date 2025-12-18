import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { OAuth2Client } from "google-auth-library";


export const action = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  
 
  const formData = await request.formData();
  const locationName = formData.get("locationName"); 

  const tokenRecord = await prisma.googleTokens.findUnique({ where: { shop: session.shop } });
  
 
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
  client.setCredentials({
    access_token: tokenRecord.accessToken,
    refresh_token: tokenRecord.refreshToken,
  });

  try {
    // Agar Mock Location select ki hai
    if(locationName.includes("mock")) {
        return json(getMockReviews());
    }

    // Phele Account Name chahiye hota hai URL banane ke liye
    const accountsResp = await client.request({
      url: "https://mybusinessaccountmanagement.googleapis.com/v1/accounts",
    });
    const accountName = accountsResp.data.accounts[0].name;

    // 🔥 SELECTED LOCATION KE REVIEWS NIKALO
    const reviewsResp = await client.request({
      url: `https://mybusiness.googleapis.com/v4/${accountName}/${locationName}/reviews`,
    });

    return json({ 
      success: true, 
      reviews: reviewsResp.data.reviews || [] 
    });

  } catch (error) {
    console.error("Reviews API Error:", error.message);
    return json(getMockReviews());
  }
};

function getMockReviews() {
  return {
    success: true,
    reviews: [
      { reviewer: { displayName: "Amit Mock" }, starRating: "FIVE", comment: "This is a specific review for the selected shop." },
      { reviewer: { displayName: "Sara Mock" }, starRating: "FOUR", comment: "Selection logic is working perfectly!" }
    ]
  };
}