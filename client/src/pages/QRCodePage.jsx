import { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StepIndicator from '../components/qr-generator/StepIndicator';
import TypeSelector from '../components/qr-generator/TypeSelector';
import ContentForm from '../components/qr-generator/ContentForm';
import DesignCustomizer from '../components/qr-generator/DesignCustomizer';
import QRPreview from '../components/qr-generator/QRPreview';
import DownloadOptions from '../components/qr-generator/DownloadOptions';
import api from '../utils/api';
import { nanoid } from 'nanoid';

const steps = [
  { title: 'Select Type', description: 'Choose QR type' },
  { title: 'Add Content', description: 'Enter information' },
  { title: 'Customize', description: 'Design your QR' },
  { title: 'Download', description: 'Get your QR code' },
];

export default function QRCodePage() {
  const navigate = useNavigate();
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

  const handleNext = () => {
    if (currentStep === 1 && !qrType) {
      alert('Please select a QR code type');
      return;
    }
    if (currentStep === 2) {
      if (!content.name || !content.name.trim()) {
        alert('Please enter a QR Code Name');
        return;
      }
      if (!getQRValue()) {
        alert('Please fill in the required fields');
        return;
      }
    }
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveDynamic = async () => {
    try {
      const shortCode = nanoid(8);
      const qrValue = getQRValue();

      await api.post('/links', {
        title: content.name || `${qrType.toUpperCase()} QR Code`,
        originalUrl: qrValue,
        isDynamic: true,
        qrType: qrType,
        designSettings: design,
        content: content,
      });

      alert('QR Code saved successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving QR:', error);
      throw error;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <TypeSelector onSelectType={(type) => { setQrType(type); setCurrentStep(2); }} />;
      case 2:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ContentForm qrType={qrType} content={content} onChange={setContent} />
            <QRPreview value={getQRValue()} design={design} />
          </div>
        );
      case 3:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DesignCustomizer design={design} onChange={setDesign} />
            <QRPreview value={getQRValue()} design={design} />
          </div>
        );
      case 4:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DownloadOptions qrData={getQRValue()} design={design} onSaveDynamic={handleSaveDynamic} />
            <QRPreview value={getQRValue()} design={design} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">QR Code Generator</h1>
          <p className="text-gray-600">Create beautiful, customizable QR codes in minutes</p>
        </div>

        <StepIndicator currentStep={currentStep} steps={steps} />

        <div className="mt-8">{renderStep()}</div>

        {/* Navigation Buttons */}
        {currentStep > 1 && currentStep < 4 && (
          <div className="max-w-4xl mx-auto px-4 mt-8 flex justify-between">
            <button onClick={handleBack} className="btn btn-secondary flex items-center space-x-2">
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <button onClick={handleNext} className="btn btn-primary flex items-center space-x-2">
              <span>Next</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
