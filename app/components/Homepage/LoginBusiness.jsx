// app/components/LoginBusiness.jsx
import React, { useState, useEffect } from "react";
import { Card, Modal, Button, Text, Spinner } from "@shopify/polaris";

export default function LoginBusiness({
  imageSrc = "/loginem.svg",
  imageAlt = "Add your Google business",
  videoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [accounts, setAccounts] = useState(null);

  const shop = typeof window !== "undefined" ? window.Shopify?.shop || "" : "";

  useEffect(() => {
    async function check() {
      try {
        setLoading(true);
        const resp = await fetch(`/api.google.accounts?shop=${encodeURIComponent(shop)}`);
        if (resp.ok) {
          const data = await resp.json();
          setConnected(true);
          setAccounts(data.accounts);
        } else {
          setConnected(false);
          setAccounts(null);
        }
      } catch (err) {
        console.error(err);
        setConnected(false);
      } finally {
        setLoading(false);
      }
    }
    if (shop) check();
    else setLoading(false);
  }, [shop]);

  const startGoogleAuth = async () => {
    try {
      const resp = await fetch(`/auth/google?shop=${encodeURIComponent(shop)}`);
      if (!resp.ok) {
        console.error("Failed to start Google auth");
        return;
      }
      const { url } = await resp.json();
      
      try {
        if (window.top && window.top.location) {
          window.top.location.href = url;
        } else {
          window.location.href = url;
        }
      } catch (e) {
        // fallback if cross-origin prevents access to window.top
        window.location.href = url;
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Card sectioned>
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

          <div style={{ maxWidth: 520 }}>
            <Text as="p" variant="headingSm" fontWeight="semibold">
              {connected ? "Google Business connected" : "No businesses added yet"}
            </Text>

            <Text as="p" variant="bodyMd" style={{ color: "#6b6b6b", marginTop: 6 }}>
              {connected
                ? accounts?.accounts?.length
                  ? `Found ${accounts.accounts.length} account(s).`
                  : "Connected — no accounts returned."
                : "Add and manage your businesses."}
            </Text>
          </div>

          <div style={{ marginTop: 8 }}>
            {loading ? (
              <Button onClick={() => {}} disabled>
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Spinner size="small" />
                  Checking...
                </span>
              </Button>
            ) : connected ? (
              <Button
                onClick={() => {
                  console.log("Connected - show accounts or manage");
                }}
                primary
              >
                Manage connected business
              </Button>
            ) : (
              <Button onClick={startGoogleAuth} accessibilityLabel="Add business" disclosure>
                Add business
              </Button>
            )}
          </div>
        </div>
      </Card>

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
