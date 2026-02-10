import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { useQRCode } from '../hooks/useQRCode';
import { ArrowLeft, ArrowRight, Download, ExternalLink, Save, Copy, Check } from 'lucide-react';
import StepIndicator from '../components/qr-generator/StepIndicator';
import DesignCustomizer from '../components/qr-generator/DesignCustomizer';
import QRPreview from '../components/qr-generator/QRPreview';

const steps = [
  { title: 'Edit Content', description: 'Update information' },
  { title: 'Customize Design', description: 'Style your QR' },
  { title: 'Save & Download', description: 'Get your QR code' },
];

const EditLink = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [link, setLink] = useState(null);
  const [title, setTitle] = useState('');
  const [originalUrl, setOriginalUrl] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [design, setDesign] = useState({
    frame: 'none',
    dotStyle: 'square',
    cornerStyle: 'square',
    fgColor: '#000000',
    bgColor: '#ffffff',
    logo: null,
  });

  const getShortUrl = () => {
    return link ? `${window.location.origin}/r/${link.shortCode}` : '';
  };

  const qrOptions = {
    width: 250,
    height: 250,
    data: getShortUrl(),
    margin: 10,
    qrOptions: {
      typeNumber: 0,
      mode: 'Byte',
      errorCorrectionLevel: 'H'
    },
    dotsOptions: {
      color: link?.designSettings?.fgColor || '#000000',
      type: link?.designSettings?.dotStyle || 'square'
    },
    cornersSquareOptions: {
      color: link?.designSettings?.fgColor || '#000000',
      type: link?.designSettings?.cornerStyle || 'square'
    },
    cornersDotOptions: {
      color: link?.designSettings?.fgColor || '#000000',
      type: 'dot'
    },
    backgroundOptions: {
      color: link?.designSettings?.bgColor || '#ffffff',
    },
    imageOptions: {
      crossOrigin: 'anonymous',
      margin: 10
    },
    image: link?.designSettings?.logo || undefined
  };

  const { qrCodeRef, download } = useQRCode(qrOptions);

  useEffect(() => {
    fetchLink();
  }, [id]);

  const fetchLink = async () => {
    try {
      const { data } = await api.get(`/links/${id}`);
      setLink(data);
      setTitle(data.title);
      setOriginalUrl(data.originalUrl);
      setIsActive(data.isActive);
      
      // Load design settings if available
      if (data.designSettings) {
        setDesign(data.designSettings);
      }
    } catch (error) {
      console.error('Error fetching link:', error);
      alert('QR Code not found');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const normalizeUrl = (inputUrl) => {
    let normalized = inputUrl.trim();
    
    // If empty, return as is
    if (!normalized) return '';
    
    // If no protocol, add https://
    if (!normalized.match(/^https?:\/\//i)) {
      normalized = 'https://' + normalized;
    }
    
    return normalized;
  };

  const validateUrl = (urlToValidate) => {
    if (!urlToValidate) return false;
    
    try {
      const urlObj = new URL(urlToValidate);
      
      // Check if it has a valid protocol and hostname
      if ((urlObj.protocol === 'http:' || urlObj.protocol === 'https:') && urlObj.hostname) {
        // Check if hostname has at least one dot
        if (urlObj.hostname.includes('.')) {
          // Split domain into parts
          const parts = urlObj.hostname.split('.');
          const domainName = parts[parts.length - 2]; // e.g., "google" from "google.com"
          const tld = parts[parts.length - 1]; // e.g., "com" from "google.com"
          
          // Domain name must contain at least one letter (not just numbers)
          if (!/[a-zA-Z]/.test(domainName)) {
            return false;
          }
          
          // TLD must be letters only and at least 2 characters
          if (!/^[a-zA-Z]{2,}$/.test(tld)) {
            return false;
          }
          
          // Check if hostname looks like a valid domain
          const domainPattern = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?(\.[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?)*\.[a-zA-Z]{2,}$/;
          if (domainPattern.test(urlObj.hostname)) {
            return true;
          }
        }
      }
      return false;
    } catch {
      return false;
    }
  };

  const checkUrlReachable = async (urlToCheck) => {
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        resolve(false); // Timeout - assume unreachable
      }, 5000);

      // Try to fetch with no-cors mode
      fetch(urlToCheck, { 
        method: 'GET', 
        mode: 'no-cors',
        cache: 'no-cache'
      })
        .then(() => {
          clearTimeout(timeout);
          resolve(true); // URL is reachable
        })
        .catch(() => {
          clearTimeout(timeout);
          resolve(false); // URL is not reachable
        });
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const qrType = link?.qrType || 'url';
      let finalUrl = originalUrl;

      // Only validate URLs for 'url' and 'image' types
      if (qrType === 'url') {
        // Normalize and validate URL
        const normalizedUrl = normalizeUrl(originalUrl);
        
        // Validate URL format
        const isValid = validateUrl(normalizedUrl);
        if (!isValid) {
          alert('Invalid URL. Please enter a valid URL such as example.com or https://example.com');
          setSaving(false);
          return;
        }

        // Check if URL is actually reachable
        const isReachable = await checkUrlReachable(normalizedUrl);
        
        if (!isReachable) {
          alert('Unable to access this URL. Please check that the website exists and is working');
          setSaving(false);
          return;
        }

        finalUrl = normalizedUrl;
      } else if (qrType === 'image') {
        // For image type, validate if it's a URL (not base64)
        if (!originalUrl.startsWith('data:')) {
          const normalizedUrl = normalizeUrl(originalUrl);
          
          const isValid = validateUrl(normalizedUrl);
          if (!isValid) {
            alert('Invalid image URL. Please enter a valid URL');
            setSaving(false);
            return;
          }

          const isReachable = await checkUrlReachable(normalizedUrl);
          
          if (!isReachable) {
            alert('Unable to access this image URL');
            setSaving(false);
            return;
          }

          finalUrl = normalizedUrl;
        }
      } else if (qrType === 'text') {
        // For text type, no URL validation needed
        if (!originalUrl.trim()) {
          alert('Please enter some text');
          setSaving(false);
          return;
        }
        finalUrl = originalUrl.trim();
      }

      await api.put(`/links/${id}`, {
        title,
        originalUrl: finalUrl,
        isActive,
        designSettings: design
      });
      alert('Saved successfully');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating link:', error);
      alert('Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadQR = () => {
    download('png', `qr-${link.shortCode}`);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(getShortUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit QR Code</h2>

              <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  QR Code Name
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {link?.qrType === 'text' ? 'Text Content' : link?.qrType === 'image' ? 'Image URL' : 'Destination URL'}
                </label>
                {link?.isDynamic === false && (
                  <div className="mb-2 p-3 bg-orange-50 border border-orange-200 rounded-lg text-orange-700 text-sm">
                    ⚠ This is a Static QR Code - Cannot edit {link?.qrType === 'text' ? 'content' : link?.qrType === 'image' ? 'image' : 'URL'}
                  </div>
                )}
                {link?.qrType === 'text' ? (
                  <textarea
                    value={originalUrl}
                    onChange={(e) => setOriginalUrl(e.target.value)}
                    className="input min-h-[120px]"
                    disabled={link?.isDynamic === false}
                    required
                  />
                ) : (
                  <input
                    type={link?.qrType === 'url' ? 'url' : 'text'}
                    value={originalUrl}
                    onChange={(e) => setOriginalUrl(e.target.value)}
                    className="input"
                    disabled={link?.isDynamic === false}
                    required
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short URL
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  This is the shortened link that redirects to your destination URL. Use this URL in your QR code.
                </p>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={getShortUrl()}
                    className="input flex-1"
                    readOnly
                  />
                  <button
                    type="button"
                    onClick={handleCopyUrl}
                    className="btn btn-secondary px-3"
                  >
                    {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  Enable QR Code
                </label>
              </div>

              </div>
            </div>
            <QRPreview value={getShortUrl()} design={design} />
          </div>
        );
      case 2:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DesignCustomizer design={design} onChange={setDesign} />
            <QRPreview value={getShortUrl()} design={design} />
          </div>
        );
      case 3:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Save & Download</h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    ✓ Your QR code is ready! You can download it or save your changes.
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleDownloadQR}
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
                    href={getShortUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full btn btn-secondary flex items-center justify-center space-x-2"
                  >
                    <ExternalLink className="w-5 h-5" />
                    <span>Test Link</span>
                  </a>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Statistics</p>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Total Clicks</span>
                    <span className="text-2xl font-bold text-primary-600">{link?.clicks || 0}</span>
                  </div>
                </div>
              </div>
            </div>
            <QRPreview value={getShortUrl()} design={design} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/dashboard" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit QR Code</h1>
          <p className="text-gray-600">Update your QR code design and settings</p>
        </div>

        <StepIndicator steps={steps} currentStep={currentStep} />

        <div className="mt-8">
          {renderStep()}
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className="btn btn-secondary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          
          {currentStep < 3 && (
            <button
              onClick={handleNext}
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

export default EditLink;
