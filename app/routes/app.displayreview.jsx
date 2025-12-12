// app/routes/app.displayreview.jsx

import { useState } from "react";
import { AppProvider, Page } from "@shopify/polaris";
import enTranslations from "@shopify/polaris/locales/en.json";

import { StickySettings } from "../components/DisplayReview/Settings/StickySettings";
import { ScrollSettings } from "../components/DisplayReview/Settings/ScrollSettings";
import { GridSettings } from "../components/DisplayReview/Settings/GridSettings";

import { WidgetSelector } from "../components/DisplayReview/Selector/WidgetSelector";
import { StickyWidgetPreview } from "../components/DisplayReview/Preview/StickyWidgetPreview";
import ScrollPreview from "../components/DisplayReview/Preview/ScrollPreview";
import GridPreview from "../components/DisplayReview/Preview/GridPreview";


export default function DisplayReviewPage() {
 
  const [selectedWidget, setSelectedWidget] = useState("sticky");

  
  const [widgetSettings, setWidgetSettings] = useState({
    sticky: {
      position: "bottom-left",
      autoScrollDelay: 3,
      showCloseButton: true,
      bgColor: "#ffffff",
      textColor: "#222222",
      starColor: "",
    }
    ,
    scroll: {
      review_heading: "Customer Reviews",
      api_url: "",
      desktop_cards: 3,
      max_words: 15,
      header_bg_color: "#FBEFF3",
      header_text_color: "#111827",
      star_color: "#FBBF24",
      card_bg_color: "#FFFFFF",
      card_text_color: "#111827",
    }
    ,
    grid: {
      desktop_cards: 4,
      card_bg_color: "#ffffff",
      border_color: "#e6e6e6",
      star_color: "#FBBF24",
      text_color: "#111827",
      button_bg_color: "#0066cc",
      button_text_color: "#ffffff",
    }
   
  });

  const currentSettings = widgetSettings[selectedWidget];

  const updateSettings = (newSettings) => {
    setWidgetSettings((prev) => ({
      ...prev,
      [selectedWidget]: newSettings,
    }));
  };

  // Save scroll settings to server -> /api/riview-scroll
  const saveScrollSettings = async (settings) => {
    try {
      const resp = await fetch('/api/riview-scroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      });
      const data = await resp.json();
      if (data?.success) {
        console.log(' Scroll settings saved', data);
      } else {
        console.error(' Failed to save scroll settings', data);
      }
    } catch (err) {
      console.error(' Error saving scroll settings', err);
    }
  };

  return (
    <AppProvider i18n={enTranslations}>
      <Page title="Display reviews" fullWidth>
        <div
          style={{
            display: "flex",
            gap: "16px",
            alignItems: "flex-start",
          }}
        >
          
          <div
            style={{
              flexBasis: "20%",
              maxWidth: "320px",
              minWidth: "260px",
            }}
          >
           
            {selectedWidget === "sticky" && (
              <StickySettings
                settings={currentSettings}
                onChange={updateSettings}
              />
            )}

            {selectedWidget === "scroll" && (
              <ScrollSettings
                settings={currentSettings}
                onChange={updateSettings}
                onSave={saveScrollSettings}
              />
            )}

            {selectedWidget === "grid" && (
              <GridSettings
                settings={currentSettings}
                onChange={updateSettings}
              />
            )}

           
          </div>

         
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
             
              <WidgetSelector
                selectedWidget={selectedWidget}
                onSelect={setSelectedWidget}
              />

             
              <StickyWidgetPreview
                visible={selectedWidget === "sticky"}
                settings={currentSettings}
              />

              {selectedWidget === "scroll" && (
                <ScrollPreview settings={currentSettings} />
              )}

              {selectedWidget === "grid" && (
                <GridPreview settings={currentSettings} />
              )}

             
            </div>
          </div>
        </div>
      </Page>
    </AppProvider>
  );
}
