import { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';

const ContentForm = ({ qrType, content, onChange, shortCode, onCopyShortUrl, copied }) => {
  const [formData, setFormData] = useState(content || {});

  useEffect(() => {
    setFormData(content || {});
  }, [content]);

  const handleChange = (field, value) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onChange(newData);
  };

  const renderForm = () => {
    const nameField = (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">QR Code Name</label>
        <input
          type="text"
          value={formData.name || ''}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="e.g., My Website QR, Contact Card, WiFi Access"
          className="input"
          required
        />
        <p className="mt-1 text-sm text-gray-500">Give your QR code a memorable name</p>
      </div>
    );

    switch (qrType) {
      case 'url':
        return (
          <div className="space-y-4">
            {nameField}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
              <input
                type="url"
                value={formData.url || ''}
                onChange={(e) => handleChange('url', e.target.value)}
                placeholder="https://example.com"
                className="input"
                required
              />
              <p className="mt-1 text-sm text-gray-500">Enter the full URL including https://</p>
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="space-y-4">
            {nameField}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Text Content</label>
              <textarea
                value={formData.text || ''}
                onChange={(e) => handleChange('text', e.target.value)}
                placeholder="Enter your text message..."
                className="input min-h-[150px]"
                required
              />
              <p className="mt-1 text-sm text-gray-500">Any text, message, or information you want to share</p>
            </div>
          </div>
        );

      case 'email':
        return (
          <div className="space-y-4">
            {nameField}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="contact@example.com"
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject (Optional)</label>
              <input
                type="text"
                value={formData.subject || ''}
                onChange={(e) => handleChange('subject', e.target.value)}
                placeholder="Email subject"
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message (Optional)</label>
              <textarea
                value={formData.message || ''}
                onChange={(e) => handleChange('message', e.target.value)}
                placeholder="Email message..."
                className="input min-h-[100px]"
              />
            </div>
          </div>
        );

      case 'phone':
        return (
          <div className="space-y-4">
            {nameField}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+1234567890"
                className="input"
                required
              />
              <p className="mt-1 text-sm text-gray-500">Include country code (e.g., +1 for US)</p>
            </div>
          </div>
        );

      case 'sms':
        return (
          <div className="space-y-4">
            {nameField}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+1234567890"
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message (Optional)</label>
              <textarea
                value={formData.message || ''}
                onChange={(e) => handleChange('message', e.target.value)}
                placeholder="Pre-filled SMS message..."
                className="input min-h-[100px]"
              />
            </div>
          </div>
        );

      case 'wifi':
        return (
          <div className="space-y-4">
            {nameField}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Network Name (SSID)</label>
              <input
                type="text"
                value={formData.ssid || ''}
                onChange={(e) => handleChange('ssid', e.target.value)}
                placeholder="MyWiFiNetwork"
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="text"
                value={formData.password || ''}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder="WiFi password"
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Encryption Type</label>
              <select
                value={formData.encryption || 'WPA'}
                onChange={(e) => handleChange('encryption', e.target.value)}
                className="input"
              >
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">None</option>
              </select>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="hidden"
                checked={formData.hidden || false}
                onChange={(e) => handleChange('hidden', e.target.checked)}
                className="w-4 h-4 text-primary-600 rounded"
              />
              <label htmlFor="hidden" className="ml-2 text-sm text-gray-700">
                Hidden Network
              </label>
            </div>
          </div>
        );

      case 'vcard':
        return (
          <div className="space-y-4">
            {nameField}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  value={formData.firstName || ''}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  placeholder="John"
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName || ''}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  placeholder="Doe"
                  className="input"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+1234567890"
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="john@example.com"
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company (Optional)</label>
              <input
                type="text"
                value={formData.company || ''}
                onChange={(e) => handleChange('company', e.target.value)}
                placeholder="Company Name"
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Website (Optional)</label>
              <input
                type="url"
                value={formData.website || ''}
                onChange={(e) => handleChange('website', e.target.value)}
                placeholder="https://example.com"
                className="input"
              />
            </div>
          </div>
        );

      case 'location':
        return (
          <div className="space-y-4">
            {nameField}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
                <input
                  type="text"
                  value={formData.latitude || ''}
                  onChange={(e) => handleChange('latitude', e.target.value)}
                  placeholder="37.7749"
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
                <input
                  type="text"
                  value={formData.longitude || ''}
                  onChange={(e) => handleChange('longitude', e.target.value)}
                  placeholder="-122.4194"
                  className="input"
                  required
                />
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Or paste Google Maps link and we'll extract coordinates automatically
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Google Maps Link (Optional)</label>
              <input
                type="url"
                value={formData.mapsLink || ''}
                onChange={(e) => {
                  handleChange('mapsLink', e.target.value);
                  // Extract coordinates from Google Maps link if possible
                  const match = e.target.value.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
                  if (match) {
                    handleChange('latitude', match[1]);
                    handleChange('longitude', match[2]);
                  }
                }}
                placeholder="https://maps.google.com/..."
                className="input"
              />
            </div>
          </div>
        );

      default:
        return <div>Unknown QR type</div>;
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Enter Content</h2>
        {renderForm()}
        
        {/* Short URL Section */}
        {shortCode && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Short URL
            </label>
            <p className="text-sm text-gray-500 mb-3">
              This is the shortened link that redirects to your destination URL. Use this URL in your QR code.
            </p>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={`${window.location.origin}/r/${shortCode}`}
                readOnly
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 font-mono text-sm"
              />
              <button
                onClick={onCopyShortUrl}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                title="Copy to clipboard"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : (
                  <Copy className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentForm;
