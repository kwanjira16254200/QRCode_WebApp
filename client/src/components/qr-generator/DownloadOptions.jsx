import { useState } from 'react';
import { Download, Save, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';

const DownloadOptions = ({ qrData, design, onSaveDynamic }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const downloadQR = (format) => {
    const svg = document.querySelector('#qr-preview svg');
    if (!svg) return;

    if (format === 'svg') {
      const svgData = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `qrcode-${Date.now()}.svg`;
      link.click();
      URL.revokeObjectURL(url);
    } else if (format === 'png') {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width * 2;
        canvas.height = img.height * 2;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `qrcode-${Date.now()}.png`;
          link.click();
          URL.revokeObjectURL(url);
        });
      };

      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    }
  };

  const handleSaveDynamic = async () => {
    if (!isAuthenticated) {
      if (window.confirm('You need to login to save Dynamic QR Codes. Go to login page?')) {
        navigate('/login');
      }
      return;
    }

    setSaving(true);
    try {
      await onSaveDynamic();
    } catch (error) {
      console.error('Error saving QR:', error);
      alert('Failed to save QR Code');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Download Your QR Code</h2>

        {/* Preview */}
        <div id="qr-preview" className="flex justify-center mb-6">
          <div
            className={`p-4 bg-white ${
              design.frame === 'rounded'
                ? 'rounded-2xl'
                : design.frame === 'circle'
                ? 'rounded-full'
                : design.frame === 'square'
                ? 'rounded-lg'
                : ''
            } ${design.frame !== 'none' ? 'shadow-md border-4 border-gray-200' : ''}`}
            style={{ backgroundColor: design.bgColor }}
          >
            <QRCodeSVG
              value={qrData}
              size={300}
              level="H"
              includeMargin={true}
              fgColor={design.fgColor}
              bgColor={design.bgColor}
              imageSettings={
                design.logo
                  ? {
                      src: design.logo,
                      height: 60,
                      width: 60,
                      excavate: true,
                    }
                  : undefined
              }
            />
          </div>
        </div>

        {/* Download Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => downloadQR('png')}
            className="w-full btn btn-primary flex items-center justify-center space-x-2"
          >
            <Download className="w-5 h-5" />
            <span>Download PNG</span>
          </button>

          <button
            onClick={() => downloadQR('svg')}
            className="w-full btn btn-secondary flex items-center justify-center space-x-2"
          >
            <Download className="w-5 h-5" />
            <span>Download SVG</span>
          </button>
        </div>

        {/* Dynamic QR Section */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          {!isAuthenticated ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800 mb-3">
                <strong>This is a Static QR Code.</strong> Want Dynamic QR with analytics and editable content?
              </p>
              <button
                onClick={() => navigate('/register')}
                className="w-full btn btn-primary flex items-center justify-center space-x-2"
              >
                <LogIn className="w-5 h-5" />
                <span>Sign up for free!</span>
              </button>
            </div>
          ) : (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Save as Dynamic QR Code</h3>
              <p className="text-sm text-gray-600 mb-4">
                Track scans, edit content anytime, and get detailed analytics
              </p>
              <button
                onClick={handleSaveDynamic}
                disabled={saving}
                className="w-full btn btn-primary flex items-center justify-center space-x-2"
              >
                <Save className="w-5 h-5" />
                <span>{saving ? 'Saving...' : 'Save as Dynamic QR'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DownloadOptions;
