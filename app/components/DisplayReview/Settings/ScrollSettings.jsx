// app/components/DisplayReview/Settings/ScrollSettings.jsx
import React, { useState } from "react";
import { Card, Box, Text, Button } from "@shopify/polaris";

export function ScrollSettings({ settings = {}, onChange, onSave }) {
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success'|'error', message: string }

  // Set this to the exact Remix route you created for saving scroll settings.
  const API_PATH = "/api/riview-scroll";

  const change = (field) => (e) => {
    const value =
      typeof e === "object" && e !== null && "target" in e
        ? e.target.type === "checkbox"
          ? e.target.checked
          : e.target.value
        : e;
    onChange({ ...settings, [field]: value });
  };

  // Build a payload containing ONLY the fields this component exposes
  const preparePayload = (s) => {
    const payload = {};

    // numbers: ensure numeric types
    if (s.desktop_cards !== undefined) payload.desktop_cards = Number(s.desktop_cards) || 0;

    // colors / strings: only include if provided (fall back to defaults if you want)
  
    if (s.star_color !== undefined) payload.star_color = s.star_color;
    if (s.card_bg_color !== undefined) payload.card_bg_color = s.card_bg_color;
    if (s.card_text_color !== undefined) payload.card_text_color = s.card_text_color;

    // If you later re-enable fields, add them here explicitly.
    return payload;
  };

  const saveToServer = async (payloadObj) => {
    setSaving(true);
    setStatus(null);

    try {
      const res = await fetch(API_PATH, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ settings: payloadObj }), // onlySelected keys inside
      });

      const text = await res.text().catch(() => null);
      let data = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch (e) {
        data = null;
      }

      if (!res.ok) {
        console.error("Server error saving scroll settings:", res.status, text);
        setStatus({
          type: "error",
          message:
            (data && data.error) || `Server error (${res.status}) - check console`,
        });
        return { success: false, error: data?.error || text || res.statusText };
      }

      console.log("Scroll settings saved:", data);
      setStatus({ type: "success", message: "Settings saved to theme." });
      return { success: true, data };
    } catch (err) {
      console.error("Network error saving scroll settings:", err);
      setStatus({ type: "error", message: "Network error — check console" });
      return { success: false, error: err.message };
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <Box padding="4">
        <Text variant="headingMd" as="h3">
          Scroll Widget Settings
        </Text>

        <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
          <div>
            <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
              Desktop cards
            </label>
            <input
              type="number"
              min="1"
              max="6"
              value={settings.desktop_cards ?? 3}
              onChange={(e) => change("desktop_cards")(Number(e.target.value))}
              style={{ width: 80, padding: 8 }}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 12, flexWrap: "wrap" }}>
        

          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <small>Star Color</small>
            <input type="color" value={settings.star_color || "#FBBF24"} onChange={change("star_color")} />
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <small>Card BG</small>
            <input type="color" value={settings.card_bg_color || "#FFFFFF"} onChange={change("card_bg_color")} />
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <small>Card Text</small>
            <input type="color" value={settings.card_text_color || "#111827"} onChange={change("card_text_color")} />
          </label>
        </div>

        <div style={{ marginTop: 12 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <Button
              primary
              onClick={async () => {
                // Build minimal payload (only selected keys)
                const minimal = preparePayload(settings);

                if (onSave) {
                  try {
                    setSaving(true);
                    await onSave(minimal); // parent handler receives minimal payload
                    setStatus({ type: "success", message: "Saved" });
                  } catch (err) {
                    console.error("Parent onSave error:", err);
                    setStatus({ type: "error", message: "Parent save failed" });
                  } finally {
                    setSaving(false);
                  }
                  return;
                }

                await saveToServer(minimal);
              }}
              loading={saving}
              disabled={saving}
            >
              Save to theme
            </Button>
          </div>

          <div style={{ marginTop: 10 }}>
            {status?.type === "success" && (
              <div style={{ color: "#036d34", fontWeight: 600 }}>{status.message}</div>
            )}
            {status?.type === "error" && (
              <div style={{ color: "#9b1c1c", fontWeight: 600 }}>{status.message}</div>
            )}
          </div>
        </div>
      </Box>
    </Card>
  );
}
