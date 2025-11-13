// app/components/SettingsComponents.jsx
import React from 'react';
import '../styles/riviews_form.css';

export const SettingsIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className="settings-icon" {...props}>
    <path d="M12.22 2h-.44C11.64 2 11.09 2.19 10.84 2.65L8.53 7.5A.8.8 0 0 1 7.27 8H3.34A.8.8 0 0 0 2.5 8.78l-.34 2.87a.8.8 0 0 0 .62.91l4.03.7A.8.8 0 0 1 7.22 13v3.74a.8.8 0 0 1-.62.79l-4.03.7a.8.8 0 0 0-.62.91l.34 2.87a.8.8 0 0 0 .7.75h3.93a.8.8 0 0 1 .74.47l2.31 4.85c.25.46.8.65 1.25.65h.44c.45 0 1-.19 1.25-.65l2.31-4.85a.8.8 0 0 1 .74-.47h3.93a.8.8 0 0 0 .7-.75l.34-2.87a.8.8 0 0 0-.62-.91l-4.03-.7a.8.8 0 0 1-.74-.79V13a.8.8 0 0 1 .62-.79l4.03-.7a.8.8 0 0 0 .62-.91l-.34-2.87a.8.8 0 0 0-.7-.75h-3.93a.8.8 0 0 1-.74-.47L12.5 2.65C12.25 2.19 11.7 2 11.25 2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const SettingToggle = ({ isChecked, onToggle, label, content }) => (
  <div className="setting-toggle">
    <div className="toggle-content">
      <label className="toggle-label" onClick={onToggle}>{label}</label>
      <p className="toggle-description">{content}</p>
    </div>
    <div className="toggle-switch-wrapper">
      <div className={`toggle-switch ${isChecked ? 'active' : ''}`} onClick={onToggle}>
        <div className="toggle-slider"></div>
      </div>
    </div>
  </div>
);

export const Card = ({ title, children }) => (
  <div className="card">
    {title && <div className="card-header"><h3 className="card-title">{title}</h3></div>}
    <div className="card-content">{children}</div>
  </div>
);

export const FormLayout = ({ children }) => (
  <div className="form-layout">{children}</div>
);

export const Alert = ({ message, onClose }) => (
  <div className="alert-overlay">
    <div className="alert-modal">
      <p className="alert-message">{message}</p>
      <button onClick={onClose} className="alert-button">OK</button>
    </div>
  </div>
);
