import { useEffect, useState } from "react";
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
  Select,
  TextField,
  InlineStack,
  ResourceList,
  ResourceItem,
  Thumbnail,
  Avatar,
  Spinner 
} from "@shopify/polaris";

import enTranslations from "@shopify/polaris/locales/en.json";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

export const loader = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);
  let shopName = session?.shop || "";
  const shop = session.shop;

  // 1. Shop Name
  try {
    const response = await admin.graphql(`#graphql
      query shopName { shop { name } }
    `);
    const data = await response.json();
    if (data?.data?.shop?.name) shopName = data.data.shop.name;
  } catch (error) { console.error(error); }

  // 2. Token Check
  const tokenRecord = await prisma.googleTokens.findUnique({
    where: { shop: session.shop },
  });

  return { shopName, shop, isConnected: !!tokenRecord };
};

export const action = async ({ request }) => { return {}; };

export default function Index() {
  const { shopName, shop, isConnected } = useLoaderData();
  const shopify = useAppBridge();
  const submit = useSubmit();
  const [searchParams] = useSearchParams();
  
  // ==============================
  // 🟢 OPTION A STATES (OAuth)
  // ==============================
  const [locations, setLocations] = useState([]); 
  const [selectedLocation, setSelectedLocation] = useState(""); 
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);

  const locationsFetcher = useFetcher(); 
  const reviewsFetcher = useFetcher();   
  const showSuccessMessage = searchParams.get("success") === "1";

  // ==============================
  // 🔵 OPTION B STATES (SerpApi)
  // ==============================
  const serpFetcher = useFetcher();
  const [serpQuery, setSerpQuery] = useState("");
  const [serpResults, setSerpResults] = useState([]); 
  const [selectedSerpBusiness, setSelectedSerpBusiness] = useState(null);
  const [serpError, setSerpError] = useState(null);

  const isSerpLoading = serpFetcher.state === "submitting" || serpFetcher.state === "loading";

  // --- 1. HANDLE GOOGLE LOGIN (OAuth) ---
  const handleGoogleLogin = async () => {
    setIsLoadingGoogle(true);
    try {
      const response = await fetch(`/auth/google?shop=${shop}`);
      const data = await response.json();
      if (data.url) window.top.location.href = data.url;
      else setIsLoadingGoogle(false);
    } catch (error) { setIsLoadingGoogle(false); }
  };

  // --- 2. HANDLE DISCONNECT (OAuth) ---
  const handleDisconnect = () => {
    submit({}, { method: "POST", action: "/api/google/disconnect" });
  };

  // --- 3. FETCH LOCATIONS (OAuth) ---
  const fetchLocations = () => {
    locationsFetcher.load("/api/google/locations");
  };

  useEffect(() => {
    if (locationsFetcher.data?.locations) {
      setLocations(locationsFetcher.data.locations);
      if(locationsFetcher.data.locations.length > 0) {
        setSelectedLocation(locationsFetcher.data.locations[0].name);
      }
    }
  }, [locationsFetcher.data]);

  // --- 4. FETCH REVIEWS (OAuth) ---
  const fetchReviewsForSelected = () => {
    if(!selectedLocation) return;
    reviewsFetcher.submit(
      { locationName: selectedLocation },
      { method: "POST", action: "/api/google/reviews" }
    );
  };
  
  const oauthReviewsData = reviewsFetcher.data;
  const isOauthLoading = reviewsFetcher.state === "submitting";

  const locationOptions = locations.map(loc => ({
    label: loc.title,
    value: loc.name
  }));

  // ==============================
  // 🟣 SERP API LOGIC (Option B)
  // ==============================

  useEffect(() => {
    if (serpFetcher.data) {
      // Error Handling
      if (serpFetcher.data.error) {
        setSerpError(serpFetcher.data.error);
        shopify.toast.show(serpFetcher.data.error);
      } 
      // Search Results Success
      else if (serpFetcher.data.type === "search_results") {
        setSerpResults(serpFetcher.data.results);
        setSelectedSerpBusiness(null); 
        setSerpError(null);
      } 
      // Reviews Success
      else if (serpFetcher.data.type === "reviews_data") {
        setSelectedSerpBusiness(serpFetcher.data);
        setSerpError(null);
      }
    }
  }, [serpFetcher.data, shopify]);

  const handleSerpSearch = () => {
    if(!serpQuery) return;
    setSerpError(null);
    serpFetcher.submit(
      { actionType: "search", query: serpQuery },
      { method: "POST", action: "/api/serp" }
    );
  };

  // 🔥 IMPORTANT UPDATE: Passing Title & Address to ensure correct business is found
  const handleSerpSelect = (placeId, dataId, title, address) => {
    setSerpError(null);
    serpFetcher.submit(
      { 
        actionType: "reviews", 
        placeId: placeId, 
        dataId: dataId,
        title: title,      // Main Param
        address: address   // Main Param
      }, 
      { method: "POST", action: "/api/serp" }
    );
  };

  // ==============================
  // 🖥️ UI RENDER
  // ==============================
  return (
    <AppProvider i18n={enTranslations}>
      <Page>
        <BlockStack gap="400">
          <Text as="h1" variant="headingLg">Hi, {shopName || "there"} 👋</Text>

          {showSuccessMessage && (
            <Banner title="Google Account Connected Successfully!" tone="success" onDismiss={() => {}} />
          )}

          <Card>
            <Box>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Box padding="200" borderRadius="200" background="bg-fill-subdued">
                  <img src="/logo.jpg" alt="Riview App logo" style={{ width: 50, height: 50, borderRadius: "50%", objectFit: "cover" }} />
                </Box>
                <Text as="h1" variant="headingLg" fontWeight="semibold">Riview App</Text>
              </div>
            </Box>
          </Card>

          <Layout>
            <Layout.Section>
              
              {/* ========================================= */}
              {/* 🟢 OPTION A: GOOGLE OAUTH (OWNER)       */}
              {/* ========================================= */}
              <Card>
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">Option A: Connect My Business (Verified Owner)</Text>
                  <Text tone="subdued" as="p">Use this if you are the owner and want to manage/reply to reviews.</Text>

                  {isConnected ? (
                    <div style={{ marginTop: "10px" }}>
                      <Banner tone="success">
                        <Text variant="bodyMd" as="p" fontWeight="bold">✅ Status: Account Connected</Text>
                      </Banner>

                      <div style={{ marginTop: "20px", borderTop: "1px solid #eee", paddingTop: "20px" }}>
                        {/* Load Locations Button */}
                        {locations.length === 0 && (
                          <Button 
                            onClick={fetchLocations} 
                            loading={locationsFetcher.state === "loading"}
                            variant="primary"
                          >
                            Load My Businesses
                          </Button>
                        )}

                        {/* Dropdown & Fetch Button */}
                        {locations.length > 0 && (
                          <BlockStack gap="300">
                             <Select
                               label="Select Your Business Location"
                               options={locationOptions}
                               onChange={setSelectedLocation}
                               value={selectedLocation}
                             />
                             <Button 
                               onClick={fetchReviewsForSelected} 
                               loading={isOauthLoading}
                               variant="primary"
                               disabled={!selectedLocation}
                             >
                               Fetch Reviews (OAuth)
                             </Button>
                          </BlockStack>
                        )}
                      </div>

                      {/* OAuth Reviews Display */}
                      {oauthReviewsData && (
                        <div style={{ marginTop: "20px", background: "#f4f6f8", padding: "15px", borderRadius: "8px" }}>
                          {oauthReviewsData.error ? (
                            <p style={{color: "red"}}>Error: {oauthReviewsData.error}</p>
                          ) : (
                            <>
                              <Text variant="headingSm" as="h3">Your Reviews</Text>
                              <br/>
                              {oauthReviewsData.reviews.length === 0 && <p>No reviews found.</p>}
                              <div style={{maxHeight: "300px", overflowY: "auto"}}>
                                {oauthReviewsData.reviews.map((review, index) => (
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

                      <div style={{ marginTop: "15px", borderTop: "1px solid #eee", paddingTop: "15px" }}>
                        <Button variant="primary" tone="critical" onClick={handleDisconnect}>
                          Disconnect Account
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p>Connect your Google account to import reviews securely.</p>
                      <div style={{ marginTop: "10px" }}>
                        <Button onClick={handleGoogleLogin} loading={isLoadingGoogle} variant="primary">
                          Connect Google Account
                        </Button>
                      </div>
                    </>
                  )}
                </BlockStack>
              </Card>

              {/* Spacer */}
              <Box paddingBlockStart="400"></Box>

              {/* ========================================= */}
              {/* 🔵 OPTION B: SERP API (PUBLIC SEARCH)   */}
              {/* ========================================= */}
              <Card>
                <BlockStack gap="400">
                  <div>
                    <Text as="h2" variant="headingMd">Option B: Public Search (No Login Required)</Text>
                    <p style={{color:"#666"}}>Search for any business to fetch reviews instantly without connecting an account.</p>
                  </div>

                  {/* Error Banner */}
                  {serpError && (
                    <Banner tone="critical" onDismiss={() => setSerpError(null)}>
                      <p>{serpError}</p>
                    </Banner>
                  )}

                  {/* Search Box */}
                  <InlineStack gap="300" align="start" blockAlign="end">
                    <div style={{flexGrow: 1}}>
                        <TextField 
                          label="Business Name + City" 
                          value={serpQuery} 
                          onChange={setSerpQuery} 
                          placeholder="e.g. Orange Mantra Gurgaon"
                          autoComplete="off"
                          disabled={isSerpLoading}
                        />
                    </div>
                    <Button 
                        onClick={handleSerpSearch} 
                        variant="primary" 
                        loading={isSerpLoading}
                        disabled={!serpQuery}
                    >
                        Search
                    </Button>
                  </InlineStack>

                  {/* LOADING INDICATOR */}
                  {isSerpLoading && (
                    <Box padding="400" align="center"><Spinner accessibilityLabel="Loading" size="large" /></Box>
                  )}

                  {/* 1. Show List of Businesses found */}
                  {serpResults.length > 0 && !selectedSerpBusiness && !isSerpLoading && (
                    <Box paddingBlockStart="400" background="bg-surface-secondary" padding="300" borderRadius="200">
                       <Text variant="headingSm" as="h3">Select Business:</Text>
                       <ResourceList
                          resourceName={{singular: 'business', plural: 'businesses'}}
                          items={serpResults}
                          renderItem={(item) => {
                            const {place_id, title, address, rating, thumbnail, data_id} = item;
                            const media = <Thumbnail source={thumbnail || ""} alt={title} size="medium" />;
                            return (
                              <ResourceItem
                                id={place_id}
                                media={media}
                                // 🔥 FIX: Passing Title and Address explicitly
                                onClick={() => handleSerpSelect(place_id, data_id, title, address)}
                                accessibilityLabel={`View details for ${title}`}
                              >
                                <Text variant="bodyMd" fontWeight="bold" as="h3">{title}</Text>
                                <div style={{fontSize: "12px"}}>{address}</div>
                                <div style={{color: "#e6ac00", fontSize: "12px"}}>Rating: {rating} ⭐</div>
                              </ResourceItem>
                            );
                          }}
                        />
                    </Box>
                  )}

                 {/* 2. Show Reviews for Selected Business */}
                  {selectedSerpBusiness && !isSerpLoading && (
                    <Box background="bg-surface-success" padding="400" borderRadius="200" borderColor="border">
                       <BlockStack gap="300">
                          <Banner tone="success" onDismiss={() => setSelectedSerpBusiness(null)}>
                             <Text fontWeight="bold">Reviews Loaded for: {selectedSerpBusiness.businessName}</Text>
                          </Banner>

                          <BlockStack gap="200">
                             <Text variant="headingLg" as="h2">{selectedSerpBusiness.businessName}</Text>
                             <Text tone="subdued" as="span">{selectedSerpBusiness.rating} ⭐ Average Rating</Text>
                          </BlockStack>

                          {/* Reviews List with SAFETY CHECK */}
                          <div style={{marginTop: "10px", maxHeight: "300px", overflowY: "auto", paddingRight:"5px", background: "white", padding: "10px", borderRadius: "8px"}}>
                             {/* 🔥 FIX: Check if it is an Array AND has length */}
                             {(!selectedSerpBusiness.reviews || !Array.isArray(selectedSerpBusiness.reviews) || selectedSerpBusiness.reviews.length === 0) ? (
                                 <div style={{padding: "20px", textAlign: "center"}}>
                                    <p>No text reviews available for this location.</p>
                                    <p style={{fontSize: "12px", color: "#666"}}>(It might only have star ratings)</p>
                                 </div>
                             ) : (
                                 selectedSerpBusiness.reviews.map((review, index) => (
                                   <div key={index} style={{ marginBottom: "15px", padding: "15px", background: "#f9fafb", borderRadius: "8px", border:"1px solid #eee" }}>
                                      <div style={{display: "flex", alignItems: "center", gap: "10px"}}>
                                         <Avatar source={review.link} size="sm" name={review.user?.name}/>
                                         <Text fontWeight="bold">{review.user?.name || "Google User"}</Text>
                                      </div>
                                      
                                      <div style={{margin: "8px 0"}}>
                                         {"⭐".repeat(Math.round(review.rating || 5))}
                                         <span style={{fontSize:"12px", color:"#888", marginLeft:"10px"}}>{review.date}</span>
                                      </div>
                                      
                                      <p style={{lineHeight: "1.5", fontSize: "14px"}}>{review.snippet || review.text}</p>
                                   </div>
                                 ))
                             )}
                          </div>

                          <Button onClick={() => setSelectedSerpBusiness(null)}>Search Another</Button>
                       </BlockStack>
                    </Box>
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
            Have any questions? <a href="/faq" target="_blank" rel="noreferrer" style={{ color: "#007bff", textDecoration: "underline", fontWeight: "600" }}>Read FAQ</a>
          </p>
        </div>
      </Page>
    </AppProvider>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};