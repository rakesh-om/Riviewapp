// app/components/WidgetSettingsPanel.jsx

import { Card, Box, BlockStack, Text } from "@shopify/polaris";

export function WidgetSettingsPanel({ settings, onChange }) {
  const handleChange = (field) => (event) => {
    const value = event.target.value;
    onChange({ ...settings, [field]: value });
  };

  return (
    <Card>
      <Box padding="400">
        <BlockStack gap="300">
          <Text as="h2" variant="headingMd" fontWeight="semibold">
            Widget design settings
          </Text>

          <Text as="p" variant="bodySm" tone="subdued">
            These settings affect only the preview, not the live widget.
          </Text>

          {/* Background color */}
          <div>
            <label style={{ display: "block", fontSize: 13, marginBottom: 4 }}>
              Background color
            </label>
            <input
              type="color"
              value={settings.backgroundColor}
              onChange={handleChange("backgroundColor")}
              style={{ width: 60, height: 32, padding: 0, border: "none" }}
            />
          </div>

          {/* Border color */}
          <div>
            <label style={{ display: "block", fontSize: 13, marginBottom: 4 }}>
              Border color
            </label>
            <input
              type="color"
              value={settings.borderColor}
              onChange={handleChange("borderColor")}
              style={{ width: 60, height: 32, padding: 0, border: "none" }}
            />
          </div>
        </BlockStack>
      </Box>
    </Card>
  );
}
