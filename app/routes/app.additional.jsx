// app/routes/app.additional.jsx
import{ useState } from 'react';
import { SettingsIcon, SettingToggle, Card, FormLayout, Alert } from '../components/SettingsComponents';
import ColorPickerField from '../components/ColorPickerField';
import ReviewCardPreview from '../components/ReviewPreview';
import '../styles/riviews_form.css';

const AdditionalPage = () => {
  const [announcementSettings, setAnnouncementSettings] = useState({
    isEnabled: true,
    featureTitle: "Special Announcement Banner",
    layoutStyle: "card",
    backgroundColor: "#fef3c7"
  });

  const [reviewSettings, setReviewSettings] = useState({
    starColor: "#800080",
    cardColor: "#FFFFFF",
    textColor: "#333333",
    nameColor: "#000000",
    accentColor: "#800080",
  });

  const [showAlert, setShowAlert] = useState(false);

  const handleAnnouncementChange = (e) => {
    const { id, value, type, checked } = e.target;
    setAnnouncementSettings(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleReviewChange = (e) => {
    const { id, value } = e.target;
    setReviewSettings(prev => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSave = () => {
    console.log('Settings Saved:', {
      announcement: announcementSettings,
      reviews: reviewSettings
    });
    setShowAlert(true);
  };

  return (
    <div className="additional-page-wrapper">
      {showAlert && <Alert message="Settings saved successfully! Check console for data." onClose={() => setShowAlert(false)} />}

      <div className="page-header-section">
        <div className="page-header-content">
          <div className="header-title-wrapper">
            <SettingsIcon />
            <h1 className="page-title">Feature Settings</h1>
          </div>
          <p className="page-subtitle">Configure all features for your app, including announcements and reviews.</p>
        </div>
      </div>

      <div className="page-layout">
        <div className="main-content">
          <Card title="Announcement Banner Status">
            <SettingToggle
              label="Enable Announcement Banner"
              content={announcementSettings.isEnabled
                ? 'The announcement banner is currently ENABLED.'
                : 'The announcement banner is currently DISABLED.'
              }
              isChecked={announcementSettings.isEnabled}
              onToggle={() => setAnnouncementSettings(p => ({ ...p, isEnabled: !p.isEnabled }))}
            />
          </Card>

          <Card title="Announcement Content and Appearance">
            <FormLayout>
              <div className="form-field">
                <label htmlFor="featureTitle" className="form-label">Banner Text Title</label>
                <input
                  type="text"
                  id="featureTitle"
                  value={announcementSettings.featureTitle}
                  onChange={handleAnnouncementChange}
                  maxLength="60"
                  className="form-input"
                />
              </div>

              <div className="form-field">
                <label htmlFor="layoutStyle" className="form-label">Display Style</label>
                <select
                  id="layoutStyle"
                  value={announcementSettings.layoutStyle}
                  onChange={handleAnnouncementChange}
                  className="form-select"
                >
                  <option value="card">Card Layout</option>
                  <option value="bar">Full Width Bar</option>
                  <option value="sticky">Sticky Header/Footer</option>
                </select>
              </div>

              <ColorPickerField
                label="Banner Background Color"
                value={announcementSettings.backgroundColor}
                onChange={(e) => handleAnnouncementChange({ target: { id: 'backgroundColor', value: e.target.value } })}
                helpText="Choose banner background color."
              />
            </FormLayout>
          </Card>

          <Card title="Review Layout Customizer">
            <FormLayout>
              <p className="form-intro-text">Design how your review cards appear on the storefront.</p>
              <ColorPickerField label="Star Color" value={reviewSettings.starColor}
                onChange={(e) => handleReviewChange({ target: { id: 'starColor', value: e.target.value } })}
                helpText="Color of stars" />
              <ColorPickerField label="Accent Color" value={reviewSettings.accentColor}
                onChange={(e) => handleReviewChange({ target: { id: 'accentColor', value: e.target.value } })}
                helpText="Avatar border color" />
              <ColorPickerField label="Card Background" value={reviewSettings.cardColor}
                onChange={(e) => handleReviewChange({ target: { id: 'cardColor', value: e.target.value } })}
                helpText="Card background" />
              <ColorPickerField label="Comment Text" value={reviewSettings.textColor}
                onChange={(e) => handleReviewChange({ target: { id: 'textColor', value: e.target.value } })}
                helpText="Review text color" />
              <ColorPickerField label="Reviewer Name" value={reviewSettings.nameColor}
                onChange={(e) => handleReviewChange({ target: { id: 'nameColor', value: e.target.value } })}
                helpText="Reviewer name color" />
            </FormLayout>
          </Card>
        </div>

        <div className="sidebar-preview">
          <Card title="Live Previews">
            <h3 className="preview-section-title">Announcement Banner</h3>
            <div className="announcement-preview" style={{ backgroundColor: announcementSettings.backgroundColor }}>
              <p className="preview-title">{announcementSettings.featureTitle}</p>
              <p className="preview-status">{announcementSettings.isEnabled ? 'Active' : 'Disabled'}</p>
            </div>

            <h3 className="preview-section-title">Review Card</h3>
            <ReviewCardPreview settings={reviewSettings} />
          </Card>
        </div>
      </div>

      <div className="save-bar">
        <button onClick={handleSave} className="save-button">Save</button>
      </div>
    </div>
  );
};

export default AdditionalPage;
