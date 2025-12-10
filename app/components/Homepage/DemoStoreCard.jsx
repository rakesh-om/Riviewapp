// app/components/DemoStoreCard.jsx

import { Card, Text, Button } from "@shopify/polaris";

export function DemoStoreCard() {
  return (
    <Card>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "24px",
          flexWrap: "wrap",
        }}
      >
        {/* LEFT SIDE CONTENT */}
        <div style={{ flex: 1 }}>
          <Text as="h2" variant="headingMd" fontWeight="semibold">
            Demo Store
          </Text>

          <Text as="p" variant="bodyMd">
            Experience the demo store with credentials below: <br />
            (password: 12345)
          </Text>

          <div style={{ marginTop: "12px" }}>
            <Button
              onClick={() =>
                window.open("https://google.com", "_blank") // 🔗 demo store link
              }
            >
              Check Demo Store
            </Button>
          </div>
        </div>

        {/* RIGHT SIDE IMAGE */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <img
            src="/demo.jpg"
            alt="Demo Store Logo"
            style={{
              width: 90,
              height: 90,
              objectFit: "contain",
            }}
          />
        </div>
      </div>
    </Card>
  );
}
