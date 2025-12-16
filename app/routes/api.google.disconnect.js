import { json, redirect } from "@remix-run/node"; // Remix standard imports
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

export const action = async ({ request }) => {
  // 1. Session verify karo (Koi bahar ka banda delete na kar sake)
  const { session } = await authenticate.admin(request);

  if (!session?.shop) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 2. Database se Token delete karo
    await prisma.googleTokens.deleteMany({
      where: { shop: session.shop },
    });

    // 3. Success response bhejo
    return json({ success: true });

  } catch (error) {
    console.error("Disconnect Error:", error);
    return json({ error: "Failed to disconnect" }, { status: 500 });
  }
};