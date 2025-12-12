// app/components/LoginBusiness.jsx
import React, { useState } from "react";
import { Card, Modal, Button, Text, Icon } from "@shopify/polaris";

export default function LoginBusiness({
  imageSrc = "/loginem.svg", // replace with your image path (e.g. /assets/google-business.png)
  imageAlt = "Add your Google business",
  videoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ", // embed url (YouTube embed)
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Card sectioned>
        {/* Container to mimic screenshot spacing and centering */}
        <div
          style={{
            minHeight: 180,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            textAlign: "center",
            padding: "8px 4px",
          }}
        >
       
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: 8,
              paddingLeft: 8,
            }}
          >
            <Text as="h2" variant="headingMd" fontWeight="semibold">
              Add your Google business
            </Text>

            
            
            <button
              onClick={() => setIsOpen(true)}
              style={{
                marginLeft: 10,
                border: "none",
                background: "transparent",
                color: "#006fd6",
                textDecoration: "underline",
                cursor: "pointer",
                padding: 0,
                fontSize: 13,
                lineHeight: "20px",
              }}
              aria-label="Open video"
            >
              Watch this video
            </button>
          </div>

         
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              paddingTop: 8,
              paddingBottom: 4,
              width: "100%",
            }}
          >
            <img
              src={imageSrc}
              alt={imageAlt}
              style={{
                maxWidth: 420,
                width: "20%",
                height: "auto",
                objectFit: "contain",
                pointerEvents: "none",
              }}
            />
          </div>

          {/* Centered messages just below the image */}
          <div style={{ maxWidth: 520 }}>
            <Text as="p" variant="headingSm" fontWeight="semibold">
              No businesses added yet
            </Text>

            <Text as="p" variant="bodyMd" style={{ color: "#6b6b6b", marginTop: 6 }}>
              Add and manage your businesses.
            </Text>
          </div>

          {/* Button area (centered) */}
          <div style={{ marginTop: 8 }}>
          
<Button
  onClick={async () => {
    try {
      // call your backend which returns the Google auth URL (or redirects directly)
      const resp = await fetch('/auth/google?shop=' + encodeURIComponent(window.Shopify?.shop || ''));
      // If your backend redirects directly you won't reach here.
      // If backend returns JSON { url }, redirect top-level:
      if (resp.ok) {
        const data = await resp.json();
        // Ensure we use top-level redirect so Shopify admin iframe doesn't block it
        window.top.location.href = data.url;
      } else {
        console.error('Auth start failed');
        // show UI error / toast as needed
      }
    } catch (err) {
      console.error(err);
    }
  }}
  accessibilityLabel="Add business"
  disclosure
>
  Add business
</Button>

          </div>
        </div>
      </Card>

      {/* Modal with embedded video */}
      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title="How to link your account"
        primaryAction={{
          content: "Close",
          onAction: () => setIsOpen(false),
        }}
      >
        <Modal.Section>
          <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
            <iframe
              title="Demo video"
              src={videoUrl}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
            />
          </div>
        </Modal.Section>
      </Modal>
    </>
  );
}
