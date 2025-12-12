// app/routes/app._index.jsx

import { json } from "@remix-run/node";
import { useEffect, useState} from "react";
import { useFetcher, useLoaderData } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { VideoHelpCard } from "../components/Homepage/VideoHelpCard";
import {HelpGuideCard} from "../components/Homepage/HelpGuideCard";
import {DemoStoreCard } from "../components/Homepage/DemoStoreCard";
import LoginBusiness from "../components/Homepage/LoginBusiness";

import {
  AppProvider,
  Page,
  Card,
  Text,
  BlockStack,
  Box,
  Button,
  Modal,
} from "@shopify/polaris";

import enTranslations from "@shopify/polaris/locales/en.json";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);

  let shopName = session?.shop || "";

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

  return json({ shopName });
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const color = ["Red", "Orange", "Yellow", "Green"][
    Math.floor(Math.random() * 4)
  ];

  const response = await admin.graphql(
    `#graphql
      mutation populateProduct($product: ProductCreateInput!) {
        productCreate(product: $product) {
          product {
            id
            title
            handle
            status
            variants(first: 1) {
              edges {
                node {
                  id
                  price
                }
              }
            }
          }
        }
      }`,
    {
      variables: {
        product: {
          title: `${color} Snowboard`,
        },
      },
    }
  );

  const responseJson = await response.json();
  return json({ product: responseJson.data.productCreate.product });
};

export default function Index() {
  const { shopName } = useLoaderData();
  const fetcher = useFetcher();
  const shopify = useAppBridge();

  const isLoading =
    ["loading", "submitting"].includes(fetcher.state) &&
    fetcher.formMethod === "POST";

  useEffect(() => {
    if (fetcher.data?.product?.id) {
      shopify.toast.show("Product created");
    }
  }, [fetcher.data?.product?.id, shopify]);

  const generateProduct = () => fetcher.submit({}, { method: "POST" });

  return (
    <AppProvider i18n={enTranslations}>
      <Page>
        <BlockStack gap="400">
          {/* Top greeting */}
          <Text as="h1" variant="headingLg">
            Hi, {shopName || "there"} 👋
          </Text>

          {/* Card: logo + app name in one row */}
          <Card>
            <Box>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <Box
                  padding="200"
                  borderRadius="200"
                  background="bg-fill-subdued"
                >
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
          
        <LoginBusiness />

        <DemoStoreCard />

        <HelpGuideCard />

        <VideoHelpCard />

        </BlockStack>
          <div
    style={{
      width: "100%",
      textAlign: "center",
      marginTop: "20px",
    }}
  >
    <p style={{ fontSize: "14px", color: "#555" }}>
      Have any questions?{" "}
      <a
        href="/faq"
        target="_blank"
        rel="noreferrer"
        style={{
          color: "#007bff",
          textDecoration: "underline",
          fontWeight: "600",
        }}
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
