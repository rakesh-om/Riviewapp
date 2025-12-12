// GridPreview.jsx
import React, { useState } from "react";
import { Card, Box, Text, Button, Modal } from "@shopify/polaris";

// STAR ICON
function GrStar({ color = "#FBBF24", size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className="gr-star" aria-hidden="true">
      <path
        fill={color}
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77 6.82 21.02 8 14.14 3 9.27l6.91-1.01L12 2z"
      />
    </svg>
  );
}

export default function GridPreview({ settings = {} }) {
  const cardBg = settings.card_bg_color || "#ffffff";
  const borderColor = settings.border_color || "rgba(0,0,0,0.06)";
  const starColor = settings.star_color || "#FBBF24";
  const textColor = settings.text_color || "#111827";
  const buttonBg = settings.button_bg_color || "#0066cc";
  const buttonTextColor = settings.button_text_color || "#ffffff";

  // 10 dummy reviews
  const dummy = [
    { name: "Vicki Wilson", profileImage: "https://i.pravatar.cc/100?img=47", rating: 5, comment: "Such a great experience — views were breathtaking and the atmosphere was amazing.", date: "2025-11-01", images: [] },
    { name: "Amit Sharma", profileImage: "https://i.pravatar.cc/100?img=2", rating: 4, comment: "Beautiful craftsmanship and smooth delivery. The necklace looks stunning in daylight!", date: "2025-10-25", images: [] },
    { name: "Priya Patel", profileImage: "https://i.pravatar.cc/100?img=32", rating: 5, comment: "Absolutely loved the earrings! The sparkle is unreal ✨ and the packaging felt premium too.", date: "2025-10-18", images: [] },
    { name: "Neha Joshi", profileImage: "https://i.pravatar.cc/100?img=12", rating: 5, comment: "Great customer service and super fast delivery. The bracelet is even prettier in person!", date: "2025-10-10", images: [] },
    { name: "Karan Singh", profileImage: "https://i.pravatar.cc/100?img=65", rating: 3, comment: "Product was nice but delivery took longer than expected. Could be improved.", date: "2025-10-05", images: [] },
    { name: "Sneha Gupta", profileImage: "https://i.pravatar.cc/100?img=23", rating: 4, comment: "Lovely design and perfect fit. The finish is smooth and looks classy.", date: "2025-09-28", images: [] },
    { name: "Deepak Singh", profileImage: "https://i.pravatar.cc/100?img=70", rating: 5, comment: "Genuine quality and modern look. Definitely worth the price. Highly recommended!", date: "2025-09-20", images: [] },
    { name: "Ananya Roy", profileImage: "https://i.pravatar.cc/100?img=18", rating: 5, comment: "Quality and shine are excellent. Looks exactly like the photos. So elegant 💎", date: "2025-09-15", images: [] },
    { name: "Ritu Mehta", profileImage: "https://i.pravatar.cc/100?img=36", rating: 4, comment: "Absolutely stunning! The detailing is so fine and delicate. Got so many compliments already.", date: "2025-09-05", images: [] },
    { name: "Vikram Rao", profileImage: "https://i.pravatar.cc/100?img=9", rating: 5, comment: "Elegant pendant! Perfect for gifting. Arrived on time and beautifully packed.", date: "2025-09-01", images: [] },
  ];

  const TOTAL = dummy.length; // 10
  const [visibleCount, setVisibleCount] = useState(4);
  const [readMore, setReadMore] = useState({});
  const [modal, setModal] = useState({ open: false, images: [], idx: 0 });

  const showMore = () => setVisibleCount((c) => Math.min(TOTAL, c + 4));
  const showLess = () => setVisibleCount(4);
  const toggleRead = (i) => setReadMore((s) => ({ ...s, [i]: !s[i] }));

  const openGallery = (imgs = [], start = 0) => {
    if (!imgs || imgs.length === 0) return;
    setModal({ open: true, images: imgs, idx: start });
  };
  const closeGallery = () => setModal({ open: false, images: [], idx: 0 });
  const prevImg = () => setModal((m) => ({ ...m, idx: (m.idx - 1 + m.images.length) % m.images.length }));
  const nextImg = () => setModal((m) => ({ ...m, idx: (m.idx + 1) % m.images.length }));

  return (
    <Card>
      <Box padding="4">
        <Text variant="headingMd" as="h3" fontWeight="semibold" style={{ color: textColor }}>
          Grid Review Preview
        </Text>

        <div className="gr-grid" style={{ marginTop: 16 }}>
          {dummy.slice(0, visibleCount).map((r, idx) => (
            <div
              key={idx}
              className="gr-card"
              style={{
                background: cardBg,
                border: `1px solid ${borderColor}`,
                color: textColor,
              }}
            >
              <div className="gr-card-header">
                <img src={r.profileImage} alt={r.name} className="gr-avatar" />
                <div>
                  <div className="gr-name">{r.name}</div>
                  <div className="gr-stars" style={{ marginTop: 6 }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <GrStar key={i} color={i < r.rating ? starColor : "#e6e6e6"} size={12} />
                    ))}
                    <span style={{ marginLeft: 8, fontSize: 12, color: "rgba(0,0,0,0.5)" }}>{new Date(r.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="gr-comment" style={{ marginTop: 12 }}>
                {(() => {
                  const words = (r.comment || "").split(/\s+/);
                  const needs = words.length > 28;
                  const expanded = !!readMore[idx];
                  if (!needs) return r.comment;
                  return expanded ? (
                    <>
                      {r.comment}{" "}
                      <button className="gr-read-btn" onClick={() => toggleRead(idx)}>Read less</button>
                    </>
                  ) : (
                    <>
                      {words.slice(0, 28).join(" ")}...{" "}
                      <button className="gr-read-btn" onClick={() => toggleRead(idx)}>Read more</button>
                    </>
                  );
                })()}
              </div>

              <div className="gr-img-row" style={{ marginTop: 12 }}>
                {(r.images || []).slice(0, 3).map((img, i) => (
                  <img key={i} src={img} alt="" className="gr-thumb" onClick={() => openGallery(r.images, i)} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="gr-btn-row" style={{ marginTop: 18, textAlign: "center" }}>
          {visibleCount < TOTAL ? (
            <button
              className="gr-show-btn"
              style={{
                background: buttonBg,
                color: buttonTextColor,
                display: "inline-block",
                padding: "10px 20px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                fontWeight: 700,
              }}
              onClick={showMore}
            >
              Show more
            </button>
          ) : (
            <button
              className="gr-show-btn-outline"
              style={{
                display: "inline-block",
                borderColor: buttonBg,
                color: buttonBg,
                padding: "10px 20px",
                borderRadius: 8,
                border: `2px solid ${buttonBg}`,
                cursor: "pointer",
                fontWeight: 700,
                background: "transparent",
              }}
              onClick={showLess}
            >
              Show less
            </button>
          )}
        </div>
      </Box>

      <Modal open={modal.open} onClose={closeGallery}>
        <Modal.Section>
          <div className="gr-modal-body" style={{ textAlign: "center" }}>
            {modal.images && modal.images.length ? (
              <>
                <img src={modal.images[modal.idx]} alt="" className="gr-modal-img" style={{ maxWidth: "100%", maxHeight: "60vh", borderRadius: 8 }} />
                <div style={{ marginTop: 12, display: "flex", justifyContent: "center", gap: 12 }}>
                  <Button plain onClick={prevImg}>Prev</Button>
                  <Button plain onClick={nextImg}>Next</Button>
                </div>
              </>
            ) : (
              <div>No images</div>
            )}
          </div>
        </Modal.Section>
      </Modal>

      <style>{`
        .gr-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }
        @media (max-width: 1024px) {
          .gr-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .gr-grid { grid-template-columns: repeat(1, 1fr); }
        }

        .gr-card {
          padding: 14px;
          border-radius: 12px;
          min-height: 180px;
          display: flex;
          flex-direction: column;
        }

        .gr-card-header {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .gr-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          object-fit: cover;
          flex-shrink: 0;
          background: #eee;
        }

        .gr-name {
          font-weight: 700;
          font-size: 14px;
        }

        .gr-stars {
          display: flex;
          gap: 6px;
          align-items: center;
        }

        .gr-comment {
          margin-top: 10px;
          font-size: 14px;
          line-height: 1.4;
        }

        .gr-read-btn {
          color: ${buttonBg};
          background: none;
          border: none;
          cursor: pointer;
          font-weight: 600;
        }

        .gr-img-row {
          display: flex;
          gap: 8px;
          margin-top: 12px;
        }

        .gr-thumb {
          width: 68px;
          height: 52px;
          border-radius: 8px;
          object-fit: cover;
          cursor: pointer;
        }

        .gr-btn-row {
          margin-top: 18px;
          text-align: center;
        }

        .gr-show-btn,
        .gr-show-btn-outline {
          padding: 10px 20px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-weight: 700;
        }

        .gr-show-btn-outline {
          background: transparent;
          border: 2px solid;
        }

        .gr-modal-body { text-align: center; }
        .gr-modal-img { max-width: 100%; max-height: 60vh; border-radius: 10px; }
        .gr-modal-controls { margin-top: 10px; display: flex; justify-content: center; gap: 16px; }
      `}</style>
    </Card>
  );
}
