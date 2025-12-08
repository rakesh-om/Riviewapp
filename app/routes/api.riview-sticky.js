import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  try {
    console.log("🚀 Riview Sticky settings save request");

    if (request.method !== "POST") {
      return json(
        { success: false, error: "Method not allowed" },
        { status: 405 }
      );
    }

    const { admin } = await authenticate.admin(request);
    console.log("🔐 Admin authenticated (Sticky)");

    const body = await request.json();
    const settings = body?.settings;

    if (!settings || typeof settings !== "object") {
      return json(
        { success: false, error: "Invalid or missing 'settings' object" },
        { status: 400 }
      );
    }

    const response = await admin.graphql(
      `
      mutation setRiviewStickySettings($input: [ShopMetafieldInput!]!) {
        shopMetafieldsSet(input: $input) {
          metafields {
            id
            namespace
            key
            value
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
      {
        variables: {
          input: [
            {
              namespace: "riview",
              key: "sticky_settings",
              type: "json_string",
              value: JSON.stringify(settings),
            },
          ],
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        "⚠️ Sticky Shopify API error:",
        response.status,
        errorText
      );
      return json(
        {
          success: false,
          error: `Shopify API Error (${response.status}): ${errorText.substring(
            0,
            120
          )}...`,
        },
        { status: response.status }
      );
    }

    const result = await response.json();
    console.log("🧩 Sticky GraphQL response:", JSON.stringify(result, null, 2));

    const userErrors = result?.data?.shopMetafieldsSet?.userErrors;
    const metafields = result?.data?.shopMetafieldsSet?.metafields;

    if (userErrors?.length) {
      console.error("⚠️ Sticky metafield errors:", userErrors);
      return json(
        { success: false, error: userErrors[0]?.message || "Metafield error" },
        { status: 400 }
      );
    }

    console.log("✅ Sticky settings saved:", metafields);

    return json({
      success: true,
      message: "Sticky settings saved successfully",
      data: metafields,
    });
  } catch (error) {
    console.error("💥 Sticky settings save failed:", error);
    return json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
};
