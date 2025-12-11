// import { Card, Box, Text } from "@shopify/polaris";
// import React from "react";

// export function ScrollSettings({ settings = {}, onChange, onSave }) {
//   const change = (field) => (e) => {
//     const value = e && e.target ? (e.target.type === 'checkbox' ? e.target.checked : e.target.value) : e;
//     onChange({ ...settings, [field]: value });
//   };

//   return (
//     <Card>
//       <Box padding="400">
//         <Text variant="headingMd" fontWeight="semibold">
//           Scroll Widget Settings
//         </Text>

//         <div style={{ marginTop: 12 }}>
//           <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>Heading</label>
//           <input
//             type="text"
//             value={settings.heading || "Customer Reviews"}
//             onChange={change("heading")}
//             style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ddd" }}
//           />
//         </div>

//         <div style={{ marginTop: 12 }}>
//           <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>API URL</label>
//           <input
//             type="text"
//             value={settings.api_url || ""}
//             onChange={change("api_url")}
//             placeholder="https://yourdomain.com/api/reviews"
//             style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ddd" }}
//           />
//         </div>

//         <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
//           <div>
//             <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>Desktop cards</label>
//             <input type="number" min="1" max="6" value={settings.desktop_cards || 3} onChange={(e) => change('desktop_cards')(Number(e.target.value))} style={{ width: 80, padding: 8 }} />
//           </div>

//           <div>
//             <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>Max words</label>
//             <input type="number" min="5" max="50" value={settings.max_words || 15} onChange={(e) => change('max_words')(Number(e.target.value))} style={{ width: 80, padding: 8 }} />
//           </div>
//         </div>

//         <div style={{ display: 'flex', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
//           <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//             <small>Header BG</small>
//             <input type="color" value={settings.header_bg_color || '#FBEFF3'} onChange={change('header_bg_color')} />
//           </label>

//           <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//             <small>Header Text</small>
//             <input type="color" value={settings.header_text_color || '#111827'} onChange={change('header_text_color')} />
//           </label>

//           <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//             <small>Star Color</small>
//             <input type="color" value={settings.star_color || '#FBBF24'} onChange={change('star_color')} />
//           </label>

//           <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//             <small>Card BG</small>
//             <input type="color" value={settings.card_bg_color || '#FFFFFF'} onChange={change('card_bg_color')} />
//           </label>

//           <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//             <small>Card Text</small>
//             <input type="color" value={settings.card_text_color || '#111827'} onChange={change('card_text_color')} />
//           </label>
//         </div>

//         <div style={{ marginTop: 12 }}>
//           <button onClick={() => onSave && onSave(settings)} style={{ padding: '8px 12px', background: '#008060', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
//             Save to theme
//           </button>
//         </div>
//       </Box>
//     </Card>
//   );
// }
