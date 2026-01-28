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
    const file = e.target.files[0];
    if (file) {
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

          // Convert to base64 with compression (0.7 quality)
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          handleChange('logo', compressedBase64);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
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
              {['none', 'square', 'rounded', 'circle'].map((frame) => (
                <button
                  key={frame}
                  onClick={() => handleChange('frame', frame)}
                  className={`p-4 border-2 rounded-lg capitalize transition-all ${
                    design.frame === frame
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {frame}
                </button>
              ))}
            </div>
          </div>

          {/* QR Pattern */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">QR Pattern</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {['square', 'dots', 'rounded'].map((pattern) => (
                <button
                  key={pattern}
                  onClick={() => handleChange('pattern', pattern)}
                  className={`p-4 border-2 rounded-lg capitalize transition-all ${
                    design.pattern === pattern
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {pattern}
                </button>
              ))}
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
