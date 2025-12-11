// app/components/DisplayReview/Selector/WidgetCard.jsx

import { Text } from "@shopify/polaris";

export function WidgetCard({ selected, onClick, image, title }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: 220,
        borderRadius: 12,
        border: selected ? "2px solid #008060" : "1px solid #e5e5e5",
        padding: 8,
        background: selected ? "#f0fdf6" : "#ffffff",
        cursor: "pointer",
        textAlign: "left",
      }}
    >
      {/* Thumbnail */}
      <div
        style={{
          width: "100%",
          height: 90,
          borderRadius: 8,
          overflow: "hidden",
          marginBottom: 8,
          background: "#f4f4f4",
        }}
      >
        <img
          src={image}
          alt={title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      </div>

      {/* Title */}
      <Text as="div" variant="bodySm" fontWeight="semibold">
        {title}
      </Text>
    </button>
  );
}
