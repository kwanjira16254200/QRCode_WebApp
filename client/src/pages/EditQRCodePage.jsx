import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';
import api from '../utils/api';
import ContentForm from '../components/qr-generator/ContentForm';
import DesignCustomizer from '../components/qr-generator/DesignCustomizer';
import QRPreview from '../components/qr-generator/QRPreview';

const EditQRCodePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const [qrType, setQrType] = useState('');
  const [content, setContent] = useState({});
  const [design, setDesign] = useState({
    frame: 'none',
    pattern: 'square',
    fgColor: '#000000',
    bgColor: '#ffffff',
    logo: null,
  });

  useEffect(() => {
    fetchQRCode();
  }, [id]);

  const fetchQRCode = async () => {
    try {
      const { data } = await api.get(`/links/${id}`);
      
      // Set QR type
      setQrType(data.qrType || 'url');
      
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
        return content.url || '';
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
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center space-x-2 ${currentStep === 1 ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep === 1 ? 'bg-primary-600 text-white' : 'bg-gray-200'
              }`}>
                1
              </div>
              <span className="font-medium">Edit Content</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300"></div>
            <div className={`flex items-center space-x-2 ${currentStep === 2 ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep === 2 ? 'bg-primary-600 text-white' : 'bg-gray-200'
              }`}>
                2
              </div>
              <span className="font-medium">Customize Design</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            {currentStep === 1 ? (
              <ContentForm qrType={qrType} content={content} onChange={setContent} />
            ) : (
              <DesignCustomizer design={design} onChange={setDesign} />
            )}
          </div>
          <QRPreview value={getQRValue()} design={design} />
        </div>

        {/* Navigation Buttons */}
        <div className="max-w-4xl mx-auto px-4 mt-8 flex justify-between">
          {currentStep === 1 ? (
            <>
              <button
                onClick={() => navigate('/dashboard')}
                className="btn btn-secondary flex items-center space-x-2"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Cancel</span>
              </button>
              <button
                onClick={() => setCurrentStep(2)}
                className="btn btn-primary flex items-center space-x-2"
              >
                <span>Next: Customize</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setCurrentStep(1)}
                className="btn btn-secondary flex items-center space-x-2"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn btn-primary flex items-center space-x-2"
              >
                <Save className="w-5 h-5" />
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditQRCodePage;
