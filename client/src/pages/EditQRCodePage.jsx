import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Save, Copy, Check, Download, ExternalLink } from 'lucide-react';
import api from '../utils/api';
import ContentForm from '../components/qr-generator/ContentForm';
import DesignCustomizer from '../components/qr-generator/DesignCustomizer';
import QRPreview from '../components/qr-generator/QRPreview';
import StepIndicator from '../components/qr-generator/StepIndicator';

const steps = [
  { title: 'Edit Content', description: 'Update information' },
  { title: 'Customize Design', description: 'Style your QR' },
  { title: 'Save & Download', description: 'Get your QR code' },
];

const EditQRCodePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
    const svg = document.querySelector('#qr-preview-svg');
    if (!svg) return;

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
  };

  const handleSave = async () => {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Edit QR Code</h1>
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
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Save & Download</h2>
                
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      ✓ Your QR code is ready! You can download it or save your changes.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={downloadQR}
                      className="w-full btn btn-primary flex items-center justify-center space-x-2"
                    >
                      <Download className="w-5 h-5" />
                      <span>Download QR Code</span>
                    </button>

                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="w-full btn btn-secondary flex items-center justify-center space-x-2"
                    >
                      <Save className="w-5 h-5" />
                      <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                    </button>

                    <a
                      href={`${window.location.origin}/r/${shortCode}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full btn btn-secondary flex items-center justify-center space-x-2"
                    >
                      <ExternalLink className="w-5 h-5" />
                      <span>Test Link</span>
                    </a>
                  </div>

                  {linkData && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-2">Statistics</p>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Total Clicks</span>
                        <span className="text-2xl font-bold text-primary-600">{linkData.clicks || 0}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <QRPreview value={getQRValue()} design={design} />
        </div>

        {/* Navigation Buttons */}
        <div className="max-w-4xl mx-auto px-4 mt-8 flex justify-between">
          <button
            onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : navigate('/dashboard')}
            className="btn btn-secondary flex items-center space-x-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{currentStep === 1 ? 'Cancel' : 'Back'}</span>
          </button>
          
          {currentStep < 3 && (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="btn btn-primary flex items-center space-x-2"
            >
              <span>Next</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditQRCodePage;
