import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Save, Copy, Check, Download, ExternalLink, BarChart3 } from 'lucide-react';
import api from '../utils/api';
import ContentForm from '../components/qr-generator/ContentForm';
import DesignCustomizer from '../components/qr-generator/DesignCustomizer';
import QRPreview from '../components/qr-generator/QRPreview';
import StepIndicator from '../components/qr-generator/StepIndicator';

const steps = [
  { title: 'Edit Content', description: 'Update information' },
  { title: 'Customize Design', description: 'Style your QR' },
  { title: 'Download', description: 'Get your QR code' },
];

const EditQRCodePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const qrRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [copied, setCopied] = useState(false);
  
  const [qrType, setQrType] = useState('');
  const [content, setContent] = useState({});
  const [shortCode, setShortCode] = useState('');
  const [design, setDesign] = useState({
    frame: 'none',
    dotStyle: 'square',
    cornerStyle: 'square',
    fgColor: '#000000',
    bgColor: '#ffffff',
    logo: null,
  });
  const [linkData, setLinkData] = useState(null);

  useEffect(() => {
    fetchQRCode();
  }, [id]);

  const fetchQRCode = async () => {
    try {
      const { data } = await api.get(`/links/${id}`);
      setLinkData(data);
      
      // Set QR type
      setQrType(data.qrType || 'url');
      
      // Set short code
      setShortCode(data.shortCode || '');
      
      // Set content from stored data
      if (data.content) {
        setContent(data.content);
      } else {
        // Fallback for old data structure
        setContent({
          name: data.title,
          url: data.originalUrl,
        });
      }
      
      // Set design settings
      if (data.designSettings) {
        setDesign(data.designSettings);
      }
    } catch (error) {
      console.error('Error fetching QR code:', error);
      alert('QR Code not found');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getQRValue = () => {
    if (!qrType || !content) return '';

    switch (qrType) {
      case 'url':
      case 'pdf':
      case 'video':
      case 'facebook':
      case 'instagram':
        return content.url || '';
      case 'whatsapp':
        return `https://wa.me/${content.phone?.replace(/[^0-9]/g, '')}${content.message ? `?text=${encodeURIComponent(content.message)}` : ''}`;
      case 'text':
        return content.text || '';
      case 'email':
        return `mailto:${content.email || ''}?subject=${encodeURIComponent(
          content.subject || ''
        )}&body=${encodeURIComponent(content.message || '')}`;
      case 'phone':
        return `tel:${content.phone || ''}`;
      case 'sms':
        return `sms:${content.phone || ''}${content.message ? `?body=${encodeURIComponent(content.message)}` : ''}`;
      case 'wifi':
        return `WIFI:T:${content.encryption || 'WPA'};S:${content.ssid || ''};P:${content.password || ''};H:${
          content.hidden ? 'true' : 'false'
        };;`;
      case 'vcard':
        return `BEGIN:VCARD
VERSION:3.0
FN:${content.firstName || ''} ${content.lastName || ''}
TEL:${content.phone || ''}
EMAIL:${content.email || ''}
ORG:${content.company || ''}
URL:${content.website || ''}
END:VCARD`;
      case 'location':
        return `geo:${content.latitude || '0'},${content.longitude || '0'}`;
      default:
        return '';
    }
  };

  const copyShortUrl = () => {
    const shortUrl = `${window.location.origin}/r/${shortCode}`;
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = () => {
    try {
      // Try to get canvas from QR code library
      const canvas = document.querySelector('#qr-preview canvas');
      
      if (canvas) {
        // If canvas exists, download directly
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${content.name || 'qrcode'}.png`;
          link.click();
          URL.revokeObjectURL(url);
        });
      } else {
        // Fallback: try SVG method
        const svg = document.querySelector('#qr-preview svg, #qr-preview-svg');
        if (!svg) {
          alert('QR code not found. Please wait for it to load.');
          return;
        }

        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        canvas.width = 1024;
        canvas.height = 1024;

        img.onload = () => {
          ctx.fillStyle = design.bgColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${content.name || 'qrcode'}.png`;
            link.click();
            URL.revokeObjectURL(url);
          });
        };

        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
      }
    } catch (error) {
      console.error('Error downloading QR:', error);
      alert('Failed to download QR code. Please try again.');
    }
  };

  const handleSaveAndContinue = async () => {
    try {
      setSaving(true);
      const qrValue = getQRValue();

      await api.put(`/links/${id}`, {
        title: content.name || 'Untitled QR Code',
        originalUrl: qrValue,
        qrType: qrType,
        content: content,
        designSettings: design,
      });

      // Move to step 3 after saving
      setCurrentStep(3);
      alert('QR Code saved successfully!');
    } catch (error) {
      console.error('Error saving QR:', error);
      alert('Failed to save QR Code');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveChanges = async () => {
    try {
      setSaving(true);
      const qrValue = getQRValue();

      await api.put(`/links/${id}`, {
        title: content.name || 'Untitled QR Code',
        originalUrl: qrValue,
        qrType: qrType,
        content: content,
        designSettings: design,
      });

      alert('QR Code updated successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving QR:', error);
      alert('Failed to save QR Code');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Edit QR Code QR Code</h1>
          <p className="text-gray-600">Update your QR code content and design</p>
        </div>

        {/* Step Indicator */}
        <StepIndicator steps={steps} currentStep={currentStep} />

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            {currentStep === 1 ? (
              <ContentForm 
                qrType={qrType} 
                content={content} 
                onChange={setContent}
                shortCode={shortCode}
                onCopyShortUrl={copyShortUrl}
                copied={copied}
              />
            ) : currentStep === 2 ? (
              <DesignCustomizer design={design} onChange={setDesign} />
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Get Your QR Code</h2>
                
                <div className="space-y-4">
                  {/* Success Message */}
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-green-800">QR Code Ready!</h3>
                        <p className="text-sm text-green-700 mt-1">
                          Your QR code has been saved and is ready to download.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Statistics */}
                  {linkData && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <BarChart3 className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm text-blue-600 font-medium">Total Scans</p>
                          <p className="text-3xl font-bold text-blue-700">{linkData.clicks || 0}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={downloadQR}
                      className="w-full btn btn-primary flex items-center justify-center space-x-2 py-3"
                    >
                      <Download className="w-5 h-5" />
                      <span>Download QR Code</span>
                    </button>

                    <button
                      onClick={handleSaveChanges}
                      disabled={saving}
                      className="w-full btn btn-secondary flex items-center justify-center space-x-2 py-3"
                    >
                      <Save className="w-5 h-5" />
                      <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                    </button>

                    <a
                      href={`${window.location.origin}/r/${shortCode}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full btn btn-secondary flex items-center justify-center space-x-2 py-3"
                    >
                      <ExternalLink className="w-5 h-5" />
                      <span>Test Link</span>
                    </a>
                  </div>

                  {/* Short URL Display */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Short URL
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={`${window.location.origin}/r/${shortCode}`}
                        readOnly
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                      />
                      <button
                        onClick={copyShortUrl}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        {copied ? (
                          <Check className="w-5 h-5 text-green-600" />
                        ) : (
                          <Copy className="w-5 h-5 text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* QR Preview */}
          <div id="qr-preview" ref={qrRef}>
            <QRPreview value={getQRValue()} design={design} />
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="max-w-4xl mx-auto px-4 mt-8 flex justify-between">
          <button
            onClick={() => {
              if (currentStep === 1) {
                navigate('/dashboard');
              } else {
                setCurrentStep(currentStep - 1);
              }
            }}
            className="btn btn-secondary flex items-center space-x-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{currentStep === 1 ? 'Cancel' : 'Back'}</span>
          </button>
          
          {currentStep === 1 && (
            <button
              onClick={() => setCurrentStep(2)}
              className="btn btn-primary flex items-center space-x-2"
            >
              <span>Next: Customize</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}

          {currentStep === 2 && (
            <button
              onClick={handleSaveAndContinue}
              disabled={saving}
              className="btn btn-primary flex items-center space-x-2"
            >
              <span>{saving ? 'Saving...' : 'Save & Continue'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}

          {currentStep === 3 && (
            <button
              onClick={() => navigate('/dashboard')}
              className="btn btn-primary flex items-center space-x-2"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditQRCodePage;
