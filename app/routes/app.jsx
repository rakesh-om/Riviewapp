// C:\Users\Orange\riview-app\app\routes\app.jsx

import { Outlet, useLoaderData, useRouteError } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { AppProvider as RouterAppProvider } from "@shopify/shopify-app-react-router/react"; // Renamed
import { AppProvider as PolarisAppProvider } from "@shopify/polaris"; // NEW IMPORT
import { authenticate } from "../shopify.server";

// NEW: Define i18n object here
const i18n = {}; 

export const loader = async ({ request }) => {
  await authenticate.admin(request);

  // eslint-disable-next-line no-undef
  return { apiKey: process.env.SHOPIFY_API_KEY || "" };
};

export default function App() {
  const { apiKey } = useLoaderData();

  return (
    // 1. WRAP EVERYTHING IN THE POLARIS PROVIDER
    <PolarisAppProvider i18n={i18n}>
      {/* 2. Use the renamed RouterAppProvider */}
      <RouterAppProvider embedded apiKey={apiKey}> 
        <s-app-nav>
          <s-link href="/app">Home</s-link>
          <s-link href="/app/additional">Main Page</s-link>
        </s-app-nav>
        <Outlet />
      </RouterAppProvider>
    </PolarisAppProvider>
  );
}

// ... rest of the file (ErrorBoundary, headers) remains the same