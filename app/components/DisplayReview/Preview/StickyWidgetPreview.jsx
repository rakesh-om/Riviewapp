// app/components/DisplayReview/Preview/StickyWidgetPreview.jsx

import { Card, Box, Text } from "@shopify/polaris";


function StarRating({ rating = 5, color = "#FFD700", size = 16 }) {
  const stars = Array.from({ length: 5 }, (_, i) => i < rating);
  
  return (
    <svg
      width={size * 5}
      height={size}
      viewBox="0 0 100 20"
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      {stars.map((isFilled, index) => (
        <polygon
          key={index}
          points={`${index * 20 + 10},2 ${index * 20 + 12},8 ${index * 20 + 18},8 ${index * 20 + 13},12 ${index * 20 + 15},18 ${index * 20 + 10},14 ${index * 20 + 5},18 ${index * 20 + 7},12 ${index * 20 + 2},8 ${index * 20 + 8},8`}
          fill={isFilled ? color : "#ddd"}
          stroke={color}
          strokeWidth="0.5"
        />
      ))}
    </svg>
  );
}

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

  const positionStyle = (() => {
    switch (settings.position) {
      case "bottom-right":
        return { bottom: 16, right: 16 };
      case "top-left":
        return { top: 16, left: 16 };
      case "top-right":
        return { top: 16, right: 16 };
      case "bottom-left":
      default:
        return { bottom: 16, left: 16 };
    }
  })();

  return (
    <Card>
      <Box padding="400">
        <Text as="h2" variant="headingMd" fontWeight="semibold">
          Demo widget preview
        </Text>

        <Text as="p" variant="bodySm" tone="subdued">
          This simulates how your sticky Google review banner and panel will
          look on your store.
        </Text>

        
        <div
          style={{
            marginTop: 20,
            borderRadius: 12,
            border: "1px solid #e5e5e5",
            background: "#f4f5f7",
            height: 260,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Sticky banner */}
          <div
            style={{
              position: "absolute",
              maxWidth: 320,
              width: "calc(100% - 40px)",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              borderRadius: 12,
              backgroundColor: settings.bgColor,
              color: settings.textColor,
              padding: 12,
              display: "flex",
              alignItems: "center",
              gap: 10,
              cursor: "pointer",
              ...positionStyle,
            }}
          >
            {settings.showCloseButton && (
              <button
                type="button"
                style={{
                  position: "absolute",
                  top: 6,
                  right: 6,
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  border: "none",
                  fontSize: 12,
                  lineHeight: 1,
                  background: "rgba(0,0,0,0.55)",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            )}

            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                overflow: "hidden",
                flexShrink: 0,
                border: "2px solid rgba(0,0,0,0.08)",
                background: "#fff",
              }}
            >
              {/* avatar placeholder */}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 14,
                  marginBottom: 2,
                  color: settings.textColor,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <StarRating rating={5} color={settings.starColor} size={14} />
                <strong>5.0</strong> by Jessica A.
              </div>
              <div
                style={{
                  fontSize: 12,
                  opacity: 0.8,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                Amazing product! Fast shipping and excellent quality.
              </div>
              <div
                style={{
                  fontSize: 11,
                  marginTop: 2,
                  opacity: 0.7,
                }}
              >
                Auto scroll every {settings.autoScrollDelay}s
              </div>
            </div>
          </div>

          {/* Side panel mini preview (right side) */}
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 160,
              height: "100%",
              borderLeft: "1px solid #e5e5e5",
              background: "#ffffff",
              padding: 10,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 4,
              }}
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 4,
                  background:
                    "conic-gradient(from 0deg, #4285F4, #34A853, #FBBC04, #EA4335)",
                }}
              />
              <div style={{ fontSize: 12, fontWeight: 600 }}>Google Reviews</div>
            </div>

            <div style={{ fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 20 }}>4.7</span>
              <StarRating rating={5} color={settings.starColor} size={12} />
            </div>

            <div style={{ fontSize: 11, opacity: 0.7 }}>(193,876 reviews)</div>

            <div
              style={{
                marginTop: 8,
                borderRadius: 8,
                border: "1px solid #e5e5e5",
                padding: 6,
                fontSize: 11,
                maxHeight: 120,
                overflow: "hidden",
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: 2 }}>
                Jessica A.
              </div>
              <div style={{ marginBottom: 2 }}>
                <span style={{ color: settings.starColor }}>★★★★★</span>
              </div>
              <div
                style={{
                  color: "#4b5563",
                  lineHeight: 1.4,
                }}
              >
                “Amazing product! Fast shipping and excellent quality. Highly
                recommend.”
              </div>
            </div>
          </div>
        </div>
      </Box>
    </Card>
  );
}
