// app/routes/api.riview-grid.js
import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  try {
    console.log("🚀 Riview Grid settings save request");

    if (request.method !== "POST") {
      return json({ success: false, error: "Method not allowed" }, { status: 405 });
    }

    const { admin } = await authenticate.admin(request);
    console.log("🔐 Admin authenticated (Grid)");

    const body = await request.json();
    const settings = body?.settings;

    // LOG what the server received from the client
    console.log("📥 Received grid settings payload (from frontend):", JSON.stringify(settings, null, 2));

    if (!settings || typeof settings !== "object") {
      return json({ success: false, error: "Invalid or missing 'settings' object" }, { status: 400 });
    }

    // 1) get shop GID (ownerId)
    let shopId;
    {
      const shopQuery = `query { shop { id } }`;
      const shopResp = await admin.graphql(shopQuery);
      const shopJson = typeof shopResp.json === "function" ? await shopResp.json() : shopResp;
      shopId = shopJson?.data?.shop?.id ?? shopJson?.shop?.id;
      if (!shopId) {
        console.warn("Could not get shop id from admin.graphql result:", shopJson);
        return json({ success: false, error: "Failed to fetch shop id" }, { status: 500 });
      }
    }

    // 2) call metafieldsSet mutation (store JSON)
    const mutation = `#graphql
      mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          metafields {
            id
            namespace
            key
            value
            type
          }
          userErrors {
            field
            message
            code
          }
        }
      }
    `;

    const metafieldInput = {
      ownerId: shopId,
      namespace: "riview",
      key: "grid_settings",
      type: "json",
      value: JSON.stringify(settings),
    };

    const resp = await admin.graphql(mutation, { variables: { metafields: [metafieldInput] } });

    const parsed = typeof resp.json === "function" ? await resp.json() : resp;
    const data = parsed?.data ?? parsed;

    // LOG Shopify response for debugging
    console.log("🔎 metafieldsSet response payload:", JSON.stringify(data, null, 2));

    const userErrors = data?.metafieldsSet?.userErrors ?? data?.data?.metafieldsSet?.userErrors;
    const metafields = data?.metafieldsSet?.metafields ?? data?.data?.metafieldsSet?.metafields;

    if (userErrors && userErrors.length) {
      console.error("⚠️ Grid metafield userErrors:", userErrors);
      return json({ success: false, error: userErrors[0].message || "Metafield user error" }, { status: 400 });
    }

    if (!metafields) {
      console.error("⚠️ Unexpected metafieldsSet result:", data);
      return json({ success: false, error: "Unexpected response from Shopify API" }, { status: 500 });
    }

    console.log("✅ Grid settings saved:", metafields);

    return json({
      success: true,
      message: "Grid settings saved successfully",
      data: metafields,
    });
  } catch (error) {
    console.error("💥 Grid settings save failed:", error);
    return json({ success: false, error: error.message || "Internal server error" }, { status: 500 });
  }
};
