// app/components/DisplayReview/Settings/StickySettings.jsx

import {
  Card,
  Box,
  BlockStack,
  Text,
  Select,
  RangeSlider,
  Button,
  Checkbox,
} from "@shopify/polaris";

const POSITION_OPTIONS = [
  { label: "Bottom left", value: "bottom-left" },
  { label: "Bottom right", value: "bottom-right" },
  { label: "Top left", value: "top-left" },
  { label: "Top right", value: "top-right" },
];

export function StickySettings({ settings, onChange }) {
  const update = (field, value) => {
    onChange({ ...settings, [field]: value });
  };
const saveSettings = async () => {
    console.log('1234')
    try {
      console.log("👉 Sending settings to /api/riview-sticky:", settings);

      const response = await fetch("/api/riview-sticky", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ settings }), // { settings: settings }
      });

      const data = await response.json();
      console.log(" API response from /api/riview-sticky:", data);

      if (!response.ok) {
        console.error("Failed to save settings:", data?.error);
      }
    } catch (error) {
      console.error("Network error during save:", error);
    }
  };
  return (
    <Card>
      <Box padding="400">
        <BlockStack gap="300">
          <Text as="h2" variant="headingMd" fontWeight="semibold">
            Sticky review settings
          </Text>

          <Text as="p" variant="bodySm" tone="subdued">
            These settings affect only the preview, not the live widget.
          </Text>

          {/* Position */}
          <Select
            label="Position"
            options={POSITION_OPTIONS}
            value={settings.position}
            onChange={(value) => update("position", value)}
          />

          {/* Auto scroll delay (seconds) */}
          <RangeSlider
            label="Auto scroll delay (seconds)"
            min={1}
            max={10}
            step={1}
            value={settings.autoScrollDelay}
            onChange={(value) => update("autoScrollDelay", value)}
            output
          />

          {/* Show close button */}
          <Checkbox
            label="Show close button"
            checked={settings.showCloseButton}
            onChange={(checked) => update("showCloseButton", checked)}
          />

          {/* Background color */}
          <div>
            <label
              style={{ display: "block", fontSize: 13, marginBottom: 4 }}
            >
              Background color
            </label>
            <input
              type="color"
              value={settings.bgColor}
              onChange={(e) => update("bgColor", e.target.value)}
              style={{ width: 60, height: 32, padding: 0, border: "none" }}
            />
          </div>

          {/* Text color */}
          <div>
            <label
              style={{ display: "block", fontSize: 13, marginBottom: 4 }}
            >
              Text color
            </label>
            <input
              type="color"
              value={settings.textColor}
              onChange={(e) => update("textColor", e.target.value)}
              style={{ width: 60, height: 32, padding: 0, border: "none" }}
            />
          </div>

          {/* Star color */}
          <div>
            <label
              style={{ display: "block", fontSize: 13, marginBottom: 4 }}
            >
              Star color
            </label>
            <input
              type="color"
              value={settings.starColor}
              onChange={(e) => update("starColor", e.target.value)}
              style={{ width: 60, height: 32, padding: 0, border: "none" }}
            />
          </div>
         <Button
  variant="primary"
  onClick={() => {
   
    saveSettings();
  }}
>
  Save sticky theme
</Button>

        </BlockStack>
      </Box>
    </Card>
  );
}
