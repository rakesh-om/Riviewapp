// app/components/StickyWidgetSelector.jsx

import { Card, Box, Text } from "@shopify/polaris";

export function StickyWidgetSelector({ isSelected, onSelect }) {
  return (
    <Card>
      <Box padding="400">
        <Text as="h2" variant="headingMd" fontWeight="semibold">
          Add widgets to the storefront
        </Text>

        <Text as="p" variant="bodySm" tone="subdued">
          Select a widget
        </Text>

        <div
          style={{
            marginTop: "16px",
            display: "flex",
          }}
        >
          <button
            type="button"
            onClick={() => onSelect(true)}
            style={{
              borderRadius: "12px",
              border: isSelected ? "2px solid #008060" : "1px solid #e5e5e5",
              padding: "8px",
              background: isSelected ? "#fcd19aff" : "#ffffff",
              cursor: "pointer",
            }}
          >
            <img
              src="/stickywidget.svg"
              alt="Sticky revxiew widget"
              style={{
                display: "block",
                width: 180,
                height: 90,
                objectFit: "contain",
                borderRadius: "8px",
              }}
            />
            <Text as="div" variant="bodySm" fontWeight="semibold">
              Sticky review
            </Text>
          </button>
        </div>
      </Box>
    </Card>
  );
}
