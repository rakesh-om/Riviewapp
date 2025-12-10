// app/routes/app.widgets.jsx

import { useState } from "react";
import {
  AppProvider,
  Page,
  BlockStack,
} from "@shopify/polaris";
import enTranslations from "@shopify/polaris/locales/en.json";

import { WidgetSettingsPanel } from "../components/DisplayReview/WidgetSettingsPanel";
import { StickyWidgetSelector } from "../components/DisplayReview/StickyWidgetSelector";
import { StickyWidgetPreview } from "../components/DisplayReview/StickyWidgetPreview";

export default function WidgetsPage() {
  const [settings, setSettings] = useState({
    backgroundColor: "#ffffff",
    borderColor: "#000000",
  });

  const [showStickyPreview, setShowStickyPreview] = useState(false);

  return (
    <AppProvider i18n={enTranslations}>
      <Page title="Display reviews" fullWidth>
        {/* 👇 Yaha custom 20% / 80% layout bana rahe hain */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            alignItems: "flex-start",
          }}
        >
          {/* LEFT: settings ~20% */}
          <div
            style={{
              flexBasis: "20%",
              maxWidth: "320px",
              minWidth: "260px",
            }}
          >
            <WidgetSettingsPanel
              settings={settings}
              onChange={setSettings}
            />
          </div>

          {/* RIGHT: selector (top) + preview (bottom) ~80% */}
          <div style={{ flex: 1 }}>
            <BlockStack gap="300">
              <StickyWidgetSelector
                isSelected={showStickyPreview}
                onSelect={setShowStickyPreview}
              />

              <StickyWidgetPreview
                visible={showStickyPreview}
                settings={settings}
              />
            </BlockStack>
          </div>
        </div>
      </Page>
    </AppProvider>
  );
}
