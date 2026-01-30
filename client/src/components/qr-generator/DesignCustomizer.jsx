import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Upload, X } from 'lucide-react';

const DesignCustomizer = ({ design, onChange }) => {
  const [showFgPicker, setShowFgPicker] = useState(false);
  const [showBgPicker, setShowBgPicker] = useState(false);

  const handleChange = (field, value) => {
    onChange({ ...design, [field]: value });
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, etc.)');
      return;
    }

    // Compress image before upload
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 200;
        const MAX_HEIGHT = 200;
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to base64 with compression (0.7 quality for JPEG, 0.9 for PNG)
        const isPng = file.type === 'image/png';
        const compressedBase64 = canvas.toDataURL(isPng ? 'image/png' : 'image/jpeg', isPng ? 0.9 : 0.7);
        handleChange('logo', compressedBase64);
      };
      img.onerror = () => {
        alert('Failed to load image. Please try another file.');
      };
      img.src = event.target.result;
    };
    reader.onerror = () => {
      alert('Failed to read file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Customize Design</h2>

        <div className="space-y-6">
          {/* Frame/Border */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Frame Style</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { id: 'none', label: 'None', icon: <div className="w-12 h-12 border-2 border-gray-400"></div> },
                { id: 'square', label: 'Square', icon: <div className="w-12 h-12 border-4 border-gray-400 rounded"></div> },
                { id: 'rounded', label: 'Rounded', icon: <div className="w-12 h-12 border-4 border-gray-400 rounded-xl"></div> },
                { id: 'circle', label: 'Circle', icon: <div className="w-12 h-12 border-4 border-gray-400 rounded-full"></div> }
              ].map((frame) => (
                <button
                  key={frame.id}
                  onClick={() => handleChange('frame', frame.id)}
                  className={`p-4 border-2 rounded-lg transition-all flex flex-col items-center space-y-2 ${
                    design.frame === frame.id
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {frame.icon}
                  <span className="text-xs font-medium">{frame.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* QR Pattern Styles */}
          <div className="space-y-4">
            {/* Dot Pattern */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">QR Pattern (Dot Style)</label>
              <select
                value={design.dotStyle || 'square'}
                onChange={(e) => handleChange('dotStyle', e.target.value)}
                className="w-full border-2 border-gray-200 rounded-lg p-3 hover:border-gray-300 focus:border-orange-500 focus:outline-none"
              >
                <option value="square">Square</option>
                <option value="dots">Dots</option>
                <option value="rounded">Rounded</option>
                <option value="extra-rounded">Extra Rounded</option>
                <option value="classy">Classy</option>
                <option value="classy-rounded">Classy Rounded</option>
              </select>
            </div>

            {/* Corner Style */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Corner Style</label>
              <select
                value={design.cornerStyle || 'square'}
                onChange={(e) => handleChange('cornerStyle', e.target.value)}
                className="w-full border-2 border-gray-200 rounded-lg p-3 hover:border-gray-300 focus:border-orange-500 focus:outline-none"
              >
                <option value="square">Square</option>
                <option value="extra-rounded">Extra Rounded</option>
                <option value="dot">Dot</option>
              </select>
            </div>
          </div>

          {/* Colors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Foreground Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Foreground Color</label>
              <div className="relative">
                <button
                  onClick={() => setShowFgPicker(!showFgPicker)}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg flex items-center justify-between hover:border-gray-300"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-8 h-8 rounded border border-gray-300"
                      style={{ backgroundColor: design.fgColor }}
                    />
                    <span className="font-mono text-sm">{design.fgColor}</span>
                  </div>
                </button>
                {showFgPicker && (
                  <div className="absolute z-10 mt-2">
                    <div className="fixed inset-0" onClick={() => setShowFgPicker(false)} />
                    <div className="relative bg-white p-3 rounded-lg shadow-xl border border-gray-200">
                      <HexColorPicker color={design.fgColor} onChange={(color) => handleChange('fgColor', color)} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Background Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
              <div className="relative">
                <button
                  onClick={() => setShowBgPicker(!showBgPicker)}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg flex items-center justify-between hover:border-gray-300"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-8 h-8 rounded border border-gray-300"
                      style={{ backgroundColor: design.bgColor }}
                    />
                    <span className="font-mono text-sm">{design.bgColor}</span>
                  </div>
                </button>
                {showBgPicker && (
                  <div className="absolute z-10 mt-2">
                    <div className="fixed inset-0" onClick={() => setShowBgPicker(false)} />
                    <div className="relative bg-white p-3 rounded-lg shadow-xl border border-gray-200">
                      <HexColorPicker color={design.bgColor} onChange={(color) => handleChange('bgColor', color)} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Logo (Optional)</label>
            {!design.logo ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  id="logo-upload"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <label htmlFor="logo-upload" className="cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600 mb-1">Click to upload logo</p>
                  <p className="text-xs text-gray-400">PNG, JPG up to 2MB</p>
                </label>
              </div>
            ) : (
              <div className="relative border-2 border-gray-200 rounded-lg p-4">
                <button
                  onClick={() => handleChange('logo', null)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
                <img src={design.logo} alt="Logo" className="max-h-24 mx-auto" />
              </div>
            )}
            <p className="mt-2 text-xs text-gray-500">Logo will be placed in the center of the QR code</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignCustomizer;
