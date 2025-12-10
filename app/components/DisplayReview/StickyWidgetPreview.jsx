// app/components/StickyWidgetPreview.jsx


import { Card, Box, Text } from "@shopify/polaris";

export function StickyWidgetPreview({ visible, settings }) {
  if (!visible) {
    return (
      <Card>
        <Box padding="400">
          <Text as="p" variant="bodySm" tone="subdued">
            Select the Sticky review widget above to see the preview.
          </Text>
        </Box>
      </Card>
    );
  }

  return (
    <Card>
      <Box padding="400">
        <Text as="h2" variant="headingMd" fontWeight="semibold">
          Demo widget preview
        </Text>

        <Box paddingBlockStart="300">
          <div
            style={{
              borderRadius: "999px",
              border: `2px solid ${settings.borderColor}`,
              background: settings.backgroundColor,
              padding: "10px 20px",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: "#fff",
                border: "1px solid #ddd",
              }}
            />
            <Text as="span" variant="bodySm" fontWeight="semibold">
              Google rating • 4.8 ★
            </Text>
          </div>
        </Box>
      </Box>
    </Card>
  );
}
