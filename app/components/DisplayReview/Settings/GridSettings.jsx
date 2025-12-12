// GridSettings.jsx
import React, { useState } from "react";
import { Card, Box, Text, Button, RangeSlider } from "@shopify/polaris";

/**
 * GridSettings
 * props:
 *  - settings: object (initial values)
 *  - onChange: fn(updatedSettings) // called as user edits inputs
 *  - onSave: optional fn(minimalPayload) // if provided, used instead of internal POST
 *
 * Saves minimal payload to /api/riview-grid as { settings: {...} }
 */
export function GridSettings({ settings = {}, onChange = () => {}, onSave }) {
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null); // {type:'success'|'error', message}

  const API_PATH = "/api/riview-grid";

  // helper to update parent settings live
  const update = (key, value) => {
    onChange({ ...settings, [key]: value });
  };

  // prepare minimal payload: ONLY allowed keys
  const preparePayload = (s) => {
    const payload = {};
    if (s.card_bg_color !== undefined) payload.card_bg_color = s.card_bg_color;
    if (s.border_color !== undefined) payload.border_color = s.border_color;
    if (s.star_color !== undefined) payload.star_color = s.star_color;
    if (s.text_color !== undefined) payload.text_color = s.text_color;
    if (s.button_bg_color !== undefined) payload.button_bg_color = s.button_bg_color;
    if (s.button_text_color !== undefined) payload.button_text_color = s.button_text_color;
    return payload;
  };

  const saveToServer = async (payloadObj) => {
    setSaving(true);
    setStatus(null);

    // LOG payload being sent
    console.log("🔜 Sending grid settings to /api/riview-grid:", payloadObj);

    try {
      const res = await fetch(API_PATH, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ settings: payloadObj }),
      });

      const text = await res.text().catch(() => null);
      let data = null;
      try { data = text ? JSON.parse(text) : null; } catch (e) { data = null; }

      // LOG response summary
      console.log("🔁 Response from /api/riview-grid:", { status: res.status, ok: res.ok, body: data ?? text });

      if (!res.ok) {
        console.error("Grid settings save error:", res.status, text);
        setStatus({ type: "error", message: (data && data.error) || `Server error (${res.status})` });
        return { success: false, error: data?.error || text || res.statusText };
      }

      setStatus({ type: "success", message: "Grid settings saved." });
      return { success: true, data };
    } catch (err) {
      console.error("Network error saving grid settings:", err);
      setStatus({ type: "error", message: "Network error — check console" });
      return { success: false, error: err.message };
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    const minimal = preparePayload(settings);
    if (onSave) {
      try {
        setSaving(true);
        // LOG before calling parent handler
        console.log("🔜 Calling onSave (parent handler) with:", minimal);
        await onSave(minimal);
        setStatus({ type: "success", message: "Saved (parent handler)" });
      } catch (err) {
        console.error("Parent onSave error:", err);
        setStatus({ type: "error", message: "Parent save failed" });
      } finally {
        setSaving(false);
      }
      return;
    }
    await saveToServer(minimal);
  };

  return (
    <Card>
      <Box padding="4">
        <Text as="h3" variant="headingMd" fontWeight="semibold">Grid Widget Settings</Text>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <small>Card BG</small>
            <input type="color" value={settings.card_bg_color || "#ffffff"} onChange={(e) => update("card_bg_color", e.target.value)} />
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <small>Border color</small>
            <input type="color" value={settings.border_color || "#e6e6e6"} onChange={(e) => update("border_color", e.target.value)} />
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <small>Star color</small>
            <input type="color" value={settings.star_color || "#FBBF24"} onChange={(e) => update("star_color", e.target.value)} />
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <small>Text color</small>
            <input type="color" value={settings.text_color || "#111827"} onChange={(e) => update("text_color", e.target.value)} />
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <small>Button BG</small>
            <input type="color" value={settings.button_bg_color || "#0066cc"} onChange={(e) => update("button_bg_color", e.target.value)} />
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <small>Button text</small>
            <input type="color" value={settings.button_text_color || "#ffffff"} onChange={(e) => update("button_text_color", e.target.value)} />
          </label>
        </div>

        <div style={{ marginTop: 14, display: "flex", gap: 12, alignItems: "center" }}>
          <Button primary onClick={handleSave} loading={saving} disabled={saving}>Save grid settings</Button>
        </div>

        <div style={{ marginTop: 10 }}>
          {status?.type === "success" && <div style={{ color: "#036d34", fontWeight: 600 }}>{status.message}</div>}
          {status?.type === "error" && <div style={{ color: "#9b1c1c", fontWeight: 600 }}>{status.message}</div>}
        </div>
      </Box>
    </Card>
  );
}
