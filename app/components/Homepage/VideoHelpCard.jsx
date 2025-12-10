// app/components/VideoHelpCard.jsx

import { useState } from "react";
import { Card, Text, Button, Modal } from "@shopify/polaris";

export function VideoHelpCard() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card>
        <div
          style={{
            display: "flex",
            gap: "16px",
            alignItems: "stretch",
            flexWrap: "wrap",
          }}
        >
          {/* LEFT SIDE – VIDEO THUMBNAIL */}
          <div
            onClick={() => setOpen(true)}
            style={{
              position: "relative",
              width: "320px",
              maxWidth: "100%",
              borderRadius: "12px",
              overflow: "hidden",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <img
              src="/thumbnail.jpg"
              alt="How to add Google Reviews to Shopify"
              style={{
                width: "100%",
                height: "100%",
                display: "block",
                objectFit: "cover",
              }}
            />

            {/* Play overlay + duration */}
            <div
              style={{
                position: "absolute",
                left: "12px",
                bottom: "12px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(0,0,0,0.65)",
                color: "#fff",
                padding: "4px 8px",
                borderRadius: "999px",
                fontSize: "12px",
              }}
            >
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  border: "1px solid #fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "10px",
                }}
              >
                ▶
              </div>
              <span>1:02</span>
            </div>
          </div>

          {/* RIGHT SIDE – TEXT + LINKS + BUTTONS */}
          <div
            style={{
              flex: 1,
              minWidth: "240px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <Text as="h2" variant="headingMd" fontWeight="semibold">
                Enhance credibility with Google reviews
              </Text>

              <Text as="p" variant="bodyMd">
                Import reviews from Google My Business (Google Maps) or Google
                Merchant (Google Shopping Reviews).
              </Text>

              <div style={{ marginTop: "12px" }}>
                <Text as="p" variant="bodySm" fontWeight="semibold">
                  Frequently asked questions:
                </Text>

                <ul style={{ paddingLeft: "18px", marginTop: "4px" }}>
                  <li>
                    <a href="#" target="_blank" rel="noreferrer">
                      How to collect Google Customer Reviews?
                    </a>
                  </li>
                  <li>
                    <a href="#" target="_blank" rel="noreferrer">
                      How to collect Google Business Reviews?
                    </a>
                  </li>
                  <li>
                    <a href="#" target="_blank" rel="noreferrer">
                      How to add multiple locations?
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* BUTTONS ROW */}
            <div
              style={{
                marginTop: "16px",
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
              }}
            >
              <Button onClick={() => setOpen(true)}>▶ Watch video</Button>

              {/* <Button
                onClick={() =>
                  window.open("https://your-feature-request-form.com", "_blank")
                }
              >
                👍 Vote for new features
              </Button> */}
            </div>
          </div>
        </div>
      </Card>

      {/* ---------------- VIDEO POPUP MODAL ---------------- */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Google review Add to Shopify Tutorial"
        large
      >
        <Modal.Section>
          <div
            style={{
              position: "relative",
              width: "100%",
              paddingBottom: "56.25%", // 16:9 aspect ratio
              height: 0,
            }}
          >
            <iframe
              src="https://www.youtube.com/embed/UBCTyQhafhk?autoplay=1"
              title="YouTube video"
              frameBorder="0"
              allow="autoplay; fullscreen"
              allowFullScreen
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                borderRadius: "8px",
              }}
            ></iframe>
          </div>
        </Modal.Section>
      </Modal>
    </>
  );
}
