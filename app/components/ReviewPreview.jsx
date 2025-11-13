// app/components/ReviewPreview.jsx
import React from 'react';
import '../styles/riviews_form.css';

const ReviewCardPreview = ({ settings }) => {
  const { starColor, cardColor, textColor, nameColor, accentColor } = settings;
  const stars = "★★★★★";

  return (
    <div className="review-card-preview" style={{ backgroundColor: cardColor, borderColor: accentColor }}>
      <div className="preview-avatar-wrapper" style={{ borderColor: accentColor }}>
        <img
          src="https://placehold.co/80x80/E2E8F0/4A5568?text=User"
          alt="Preview Avatar"
          className="preview-avatar"
        />
      </div>
      <p className="preview-stars" style={{ color: starColor }}>{stars}</p>
      <p className="preview-comment" style={{ color: textColor }}>
        "This is a fantastic product! Highly recommended to everyone."
      </p>
      <p className="preview-name" style={{ color: nameColor }}>- Jane Doe</p>
    </div>
  );
};

export default ReviewCardPreview;
