// app/components/HelpGuideCard.jsx

import { Card, Text, Button, Box } from "@shopify/polaris";

export function HelpGuideCard() {
  return (
    <Card>
      <Box>
        <Text as="h2" variant="headingMd" fontWeight="semibold" marginBottom="300">
          Help Guide
        </Text>

        <div
          style={{
            display: "flex",
            gap: "24px",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          {/* ---------- USER GUIDE CARD ---------- */}
          <div
            style={{
              flex: "1",
              minWidth: "280px",
              background: "#ffffff",
              border: "1px solid #e5e5e5",
              borderRadius: "12px",
              padding: "20px",
            }}
          >
            <Text as="h3" variant="headingSm" fontWeight="semibold">
              User Guide
            </Text>

            <Text as="p" variant="bodyMd" tone="subdued">
              Our user guide has step-by-step instructions on how to set up and use the app.
            </Text>

            <div style={{ marginTop: "16px" }}>
              <Button
                icon={<span style={{ fontSize: "16px" }}>💬</span>}
                onClick={() => window.open("#", "_blank")}
              >
                User Guide
              </Button>
            </div>
          </div>

          {/* ---------- FAQ CARD ---------- */}
          <div
            style={{
              flex: "1",
              minWidth: "280px",
              background: "#ffffff",
              border: "1px solid #e5e5e5",
              borderRadius: "12px",
              padding: "20px",
            }}
          >
            <Text as="h3" variant="headingSm" fontWeight="semibold">
              FAQs
            </Text>

            <Text as="p" variant="bodyMd" tone="subdued">
              FAQs streamline user support by offering quick, clear answers to common questions.
            </Text>

            <div style={{ marginTop: "16px" }}>
              <Button
                icon={<span style={{ fontSize: "16px" }}>💬</span>}
                onClick={() => window.open("#", "_blank")}
              >
                FAQs
              </Button>
            </div>
          </div>
        </div>
      </Box>
    </Card>
  );
}
