// app/components/ColorPickerField.jsx
import React from 'react';
import '../styles/riviews_form.css';

const ColorPickerField = ({ label, helpText, value, onChange }) => (
  <div className="color-picker-field">
    <label htmlFor={label} className="color-label">{label}</label>
    <div className="color-picker-wrapper">
      <input
        type="color"
        id={label}
        value={value}
        onChange={onChange}
        className="color-input"
        style={{ backgroundColor: value }}
      />
      <input
        type="text"
        value={value}
        onChange={onChange}
        className="color-text-input"
      />
    </div>
    <p className="color-help-text">{helpText}</p>
  </div>
);

export default ColorPickerField;
