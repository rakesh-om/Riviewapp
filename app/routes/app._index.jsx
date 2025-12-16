// app/routes/app._index.jsx

import { useEffect, useState } from "react";
// Import useSubmit to handle disconnect actions
import { useFetcher, useLoaderData, useSearchParams, useSubmit } from "react-router"; 
import { useAppBridge } from "@shopify/app-bridge-react";
import { VideoHelpCard } from "../components/Homepage/VideoHelpCard";
import { HelpGuideCard } from "../components/Homepage/HelpGuideCard";
import { DemoStoreCard } from "../components/Homepage/DemoStoreCard";

import {
  AppProvider,
  Page,
  Card,
  Text,
  BlockStack,
  Box,
  Button,
  Banner,
  Layout,
} from "@shopify/polaris";

import enTranslations from "@shopify/polaris/locales/en.json";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

export const loader = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);

  let shopName = session?.shop || "";
  const shop = session.shop;

  // 1. Shop ka naam fetch karo
  try {
    const response = await admin.graphql(`#graphql
      query shopName {
        shop {
          name
        }
      }
    `);

    const data = await response.json();
    if (data?.data?.shop?.name) {
      shopName = data.data.shop.name;
    }
  } catch (error) {
    console.error("Error fetching shop name:", error);
  }

  // 2. Check karo ki Database mein token hai ya nahi
  const tokenRecord = await prisma.googleTokens.findUnique({
    where: { shop: session.shop },
  });

  return { 
    shopName, 
    shop, 
    isConnected: !!tokenRecord 
  };
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  // ... product creation logic if you still need it ...
  return {}; 
};

export default function Index() {
  const { shopName, shop, isConnected } = useLoaderData();
  const fetcher = useFetcher();
  const submit = useSubmit(); // 🔥 Hook for Disconnect Action
  const shopify = useAppBridge();
  const [searchParams] = useSearchParams();
  
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const showSuccessMessage = searchParams.get("success") === "1";

  // --- 1. HANDLE GOOGLE LOGIN ---
  const handleGoogleLogin = async () => {
    setIsLoadingGoogle(true);
    try {
      const response = await fetch(`/auth/google?shop=${shop}`);
      const data = await response.json();

      if (data.url) {
        window.top.location.href = data.url;
      } else {
        console.error("No URL returned");
        shopify.toast.show("Error starting Google Login");
        setIsLoadingGoogle(false);
      }
    } catch (error) {
      console.error("Google Login Error:", error);
      shopify.toast.show("Connection Failed");
      setIsLoadingGoogle(false);
    }
  };

  // --- 2. HANDLE DISCONNECT ---
  const handleDisconnect = () => {
    // Calls the action in api.google.disconnect.jsx
    submit({}, { method: "POST", action: "/api/google/disconnect" });
  };

  // --- 3. FETCH REVIEWS LOGIC ---
  const fetchReviews = () => {
    fetcher.load("/api/google/reviews");
  };
  
  const reviewsData = fetcher.data;
  const isLoadingReviews = fetcher.state === "loading";

  useEffect(() => {
    if (fetcher.data?.product?.id) {
      shopify.toast.show("Product created");
    }
  }, [fetcher.data?.product?.id, shopify]);

  return (
    <AppProvider i18n={enTranslations}>
      <Page>
        <BlockStack gap="400">
          <Text as="h1" variant="headingLg">
            Hi, {shopName || "there"} 👋
          </Text>

          {/* Success Banner */}
          {showSuccessMessage && (
            <Banner
              title="Google Account Connected Successfully!"
              tone="success"
              onDismiss={() => {}}
            >
              <p>You can now fetch and display your reviews.</p>
            </Banner>
          )}

          <Card>
            <Box>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Box padding="200" borderRadius="200" background="bg-fill-subdued">
                  <img
                    src="/logo.jpg"
                    alt="Riview App logo"
                    style={{
                      width: 50,
                      height: 50,
                      display: "block",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
                <Text as="h1" variant="headingLg" fontWeight="semibold">
                  Riview App
                </Text>
              </div>
            </Box>
          </Card>

          <Layout>
            <Layout.Section>
              <Card>
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">
                    Google Business Profile Integration
                  </Text>

                  {isConnected ? (
                    // --- STATE: CONNECTED ---
                    <div style={{ marginTop: "10px" }}>
                      <Banner tone="success">
                        <Text variant="bodyMd" as="p" fontWeight="bold">
                          ✅ Status: Account Connected
                        </Text>
                      </Banner>

                      {/* --- FETCH REVIEWS BUTTON --- */}
                      <div style={{ marginTop: "20px", borderTop: "1px solid #eee", paddingTop: "20px" }}>
                        <Button 
                          onClick={fetchReviews} 
                          variant="primary" 
                          loading={isLoadingReviews}
                        >
                          Fetch My Reviews
                        </Button>
                      </div>

                      {/* --- REVIEWS DISPLAY --- */}
                      {reviewsData && (
                        <div style={{ marginTop: "20px", background: "#f4f6f8", padding: "15px", borderRadius: "8px" }}>
                          {reviewsData.error ? (
                            <p style={{color: "red"}}>Error: {reviewsData.error}</p>
                          ) : (
                            <>
                              <Text variant="headingSm" as="h3">
                                Reviews for: {reviewsData.businessName}
                              </Text>
                              <br/>
                              {reviewsData.reviews.length === 0 && <p>No reviews found.</p>}
                              
                              <div style={{maxHeight: "300px", overflowY: "auto"}}>
                                {reviewsData.reviews.map((review, index) => (
                                  <div key={index} style={{ marginBottom: "15px", padding: "10px", background: "white", borderRadius: "5px" }}>
                                    <strong>{review.reviewer.displayName}</strong>
                                    <div style={{margin: "5px 0"}}>
                                        {"⭐".repeat(["ONE", "TWO", "THREE", "FOUR", "FIVE"].indexOf(review.starRating) + 1)}
                                    </div>
                                    <p>{review.comment}</p>
                                  </div>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      )}

                      {/* --- DISCONNECT BUTTON --- */}
                      <div style={{ marginTop: "15px", borderTop: "1px solid #eee", paddingTop: "15px" }}>
                        <Button 
                            variant="primary" 
                            tone="critical"
                            onClick={handleDisconnect} // 🔥 Calls the disconnect logic
                        >
                          Disconnect Account
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // --- STATE: NOT CONNECTED ---
                    <>
                      <p>Connect your Google account to import reviews.</p>
                      <div style={{ marginTop: "10px" }}>
                        <Button
                          onClick={handleGoogleLogin}
                          loading={isLoadingGoogle}
                          variant="primary"
                        >
                          Connect Google Account
                        </Button>
                      </div>
                    </>
                  )}
                </BlockStack>
              </Card>
            </Layout.Section>
          </Layout>

          <DemoStoreCard />
          <HelpGuideCard />
          <VideoHelpCard />
        </BlockStack>
        
        <div style={{ width: "100%", textAlign: "center", marginTop: "20px" }}>
          <p style={{ fontSize: "14px", color: "#555" }}>
            Have any questions?{" "}
            <a
              href="/faq"
              target="_blank"
              rel="noreferrer"
              style={{ color: "#007bff", textDecoration: "underline", fontWeight: "600" }}
            >
              Read FAQ
            </a>
          </p>
        </div>
      </Page>
    </AppProvider>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};