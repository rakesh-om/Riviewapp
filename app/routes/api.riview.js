import { json } from "@remix-run/react";
import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  try {
    console.log("🚀 Incoming metafield save request");

    if (request.method !== "POST") {
      return json({ success: false, error: "Method not allowed" }, { status: 405 });
    }

    // 1. Authenticate the request
    const { admin } = await authenticate.admin(request);
    console.log("🔐 Admin authenticated");

    // 2. Parse the body
    const body = await request.json();
    const { announcementSettings, reviewSettings } = body;

    console.log("📦 Received data:", { announcementSettings, reviewSettings });

    if (!announcementSettings || !reviewSettings) {
      return json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // 3. Execute GraphQL Mutation to set Shop Metafields
    const response = await admin.graphql(
      `
      mutation setShopMetafields($input: [ShopMetafieldInput!]!) {
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
              namespace: "custom_app",
              key: "announcement_settings",
              // Value must be a string, which JSON.stringify provides
              value: JSON.stringify(announcementSettings),
              // Changed 'json' to 'json_string' for explicit compatibility
              type: "json_string",
            },
            {
              namespace: "custom_app",
              key: "review_settings",
              value: JSON.stringify(reviewSettings),
              type: "json_string", // Changed 'json' to 'json_string'
            },
          ],
        },
      }
    );

    // 4. Check for response success *before* parsing JSON.
    // This helps catch low-level fetch errors that result in a non-standard response.
    if (!response.ok) {
        // Attempt to get text for better error detail
        const errorText = await response.text();
        console.error("⚠️ Shopify GraphQL Request failed with status:", response.status, "Body:", errorText);
        return json(
            { success: false, error: `Shopify API Error (${response.status}): ${errorText.substring(0, 100)}...` },
            { status: response.status }
        );
    }

    // 5. Parse the JSON result
    const result = await response.json();
    console.log("🧩 GraphQL response:", JSON.stringify(result, null, 2));

    const userErrors = result?.data?.shopMetafieldsSet?.userErrors;
    const metafields = result?.data?.shopMetafieldsSet?.metafields;

    if (userErrors && userErrors.length > 0) {
      console.error("⚠️ GraphQL user errors:", userErrors);
      return json(
        { success: false, error: userErrors[0].message },
        { status: 400 }
      );
    }

    console.log("✅ Metafields saved successfully:", metafields);

    return json({
      success: true,
      message: "Settings saved to metafields successfully",
      data: metafields,
    });

  } catch (error) {
    console.error("💥 Error saving metafields:", error);
    return json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
};