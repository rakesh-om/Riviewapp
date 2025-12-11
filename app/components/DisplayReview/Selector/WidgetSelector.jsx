// app/components/DisplayReview/Selector/WidgetSelector.jsx

import { Card, Box, Text } from "@shopify/polaris";
import { WidgetCard } from "./WidgetCard";

export function WidgetSelector({ selectedWidget, onSelect }) {
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
            gap: "16px",
            flexWrap: "wrap",
          }}
        >

         
          <WidgetCard
            selected={selectedWidget === "sticky"}
            onClick={() => onSelect("sticky")}
            title="Sticky review"
            image="/stickywidget.svg"  
          />

          <WidgetCard
            selected={selectedWidget === "scroll"}
            onClick={() => onSelect("scroll")}
            title="Scroll review"
            image="/store_locator.svg"
          />

          

        </div>
      

        
      </Box>
    </Card>
  );
}
