// app/routes/api.riview-scroll.js
import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  try {
    console.log("🚀 Riview Scroll settings save request");

    if (request.method !== "POST") {
      return json({ success: false, error: "Method not allowed" }, { status: 405 });
    }

    const { admin } = await authenticate.admin(request);
    console.log("🔐 Admin authenticated (Scroll)");

    const body = await request.json();
    const settings = body?.settings;

    if (!settings || typeof settings !== "object") {
      return json({ success: false, error: "Invalid or missing 'settings' object" }, { status: 400 });
    }

    // 1) get shop GID (ownerId)
    let shopId;
    {
      const shopQuery = `query { shop { id } }`;
      const shopResp = await admin.graphql(shopQuery);
      const shopJson = typeof shopResp.json === "function" ? await shopResp.json() : shopResp;
      shopId = shopJson?.data?.shop?.id;
      if (!shopId) {
        console.warn("Could not get shop id from admin.graphql result:", shopJson);
        return json({ success: false, error: "Failed to fetch shop id" }, { status: 500 });
      }
    }

    // 2) use metafieldsSet mutation (works like your sticky settings)
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
      key: "scroll_settings",
      namespace: "riview",
      ownerId: shopId,
      type: "json",
      value: JSON.stringify(settings),
    };

    const resp = await admin.graphql(mutation, {
      variables: { metafields: [metafieldInput] },
    });

    const parsed = typeof resp.json === "function" ? await resp.json() : resp;
    const data = parsed?.data ?? parsed;

    const userErrors = data?.metafieldsSet?.userErrors ?? data?.data?.metafieldsSet?.userErrors;
    const metafields = data?.metafieldsSet?.metafields ?? data?.data?.metafieldsSet?.metafields;

    if (userErrors && userErrors.length) {
      console.error("⚠️ Scroll metafield userErrors:", userErrors);
      return json({ success: false, error: userErrors[0].message || "Metafield user error" }, { status: 400 });
    }

    if (!metafields) {
      console.error("⚠️ Unexpected metafieldsSet result:", data);
      return json({ success: false, error: "Unexpected response from Shopify API" }, { status: 500 });
    }

    console.log("✅ Scroll settings saved:", metafields);

    return json({
      success: true,
      message: "Scroll settings saved successfully",
      data: metafields,
    });
  } catch (error) {
    console.error("💥 Scroll settings save failed:", error);
    return json({ success: false, error: error.message || "Internal server error" }, { status: 500 });
  }
};
