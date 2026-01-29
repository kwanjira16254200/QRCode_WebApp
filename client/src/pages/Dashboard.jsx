import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Plus, QrCode, MousePointerClick, TrendingUp, ExternalLink, Edit, Trash2, BarChart3, Link2, FileText, Image as ImageIcon, Cloud } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, linksRes] = await Promise.all([
        api.get('/links/dashboard/stats'),
        api.get('/links')
      ]);
      setStats(statsRes.data);
      setLinks(linksRes.data);
      
      // Debug: Log design settings for each link
      console.log('Links fetched:', linksRes.data.length);
      linksRes.data.forEach((link, index) => {
        console.log(`Link ${index + 1} (${link.title}):`, {
          hasDesignSettings: !!link.designSettings,
          designSettings: link.designSettings
        });
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this QR Code?')) return;

    try {
      await api.delete(`/links/${id}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting link:', error);
      alert('Delete failed');
    }
  };

  const getShortUrl = (shortCode) => {
    return `${window.location.origin}/r/${shortCode}`;
  };

  const getQRValue = (link) => {
    // If link has content stored, use it to generate proper QR value
    if (link.content && link.qrType) {
      const content = link.content;
      switch (link.qrType) {
        case 'url':
          return content.url || link.originalUrl || '';
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
          return link.originalUrl || '';
      }
    }
    // Fallback to originalUrl for old data
    return link.originalUrl || '';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your QR Codes</p>
          </div>
          <Link
            to="/qr-generator"
            className="btn btn-primary flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Create QR Code</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total QR Codes</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats?.totalLinks || 0}</p>
              </div>
              <QrCode className="w-12 h-12 text-primary-600" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Clicks</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats?.totalClicks || 0}</p>
              </div>
              <MousePointerClick className="w-12 h-12 text-green-600" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Last 7 Days</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats?.weeklyClicks || 0}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Your QR Codes</h2>
          
          {links.length === 0 ? (
            <div className="text-center py-12">
              <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">You don't have any QR Codes yet</p>
              <Link
                to="/qr-generator"
                className="btn btn-primary"
              >
                Create your first QR Code
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {links.map((link) => (
                <div key={link._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow relative">
                  <div className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md border border-gray-200">
                    {link.qrType === 'url' && <Link2 className="w-4 h-4 text-blue-600" />}
                    {link.qrType === 'text' && <FileText className="w-4 h-4 text-purple-600" />}
                    {link.qrType === 'image' && <ImageIcon className="w-4 h-4 text-pink-600" />}
                    {!link.qrType && <Link2 className="w-4 h-4 text-blue-600" />}
                  </div>
                  <div className="flex justify-center mb-4">
                    <div
                      className={`p-2 ${
                        link.designSettings?.frame === 'rounded'
                          ? 'rounded-xl'
                          : link.designSettings?.frame === 'circle'
                          ? 'rounded-full'
                          : link.designSettings?.frame === 'square'
                          ? 'rounded-lg'
                          : ''
                      } ${link.designSettings?.frame !== 'none' && link.designSettings?.frame ? 'shadow-sm border-2 border-gray-200' : ''}`}
                      style={{ backgroundColor: link.designSettings?.bgColor || '#ffffff' }}
                    >
                      <QRCodeSVG
                        value={getQRValue(link)}
                        size={150}
                        level="H"
                        includeMargin={true}
                        fgColor={link.designSettings?.fgColor || '#000000'}
                        bgColor={link.designSettings?.bgColor || '#ffffff'}
                        imageSettings={
                          link.designSettings?.logo
                            ? {
                                src: link.designSettings.logo,
                                height: 30,
                                width: 30,
                                excavate: true,
                              }
                            : undefined
                        }
                      />
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <h3 className="font-semibold text-gray-900 truncate mb-2">{link.title}</h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      {link.qrType === 'url' && (
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">🔗 Link</span>
                      )}
                      {link.qrType === 'text' && (
                        <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">📝 Text</span>
                      )}
                      {link.qrType === 'image' && (
                        <span className="px-2 py-1 text-xs font-medium bg-pink-100 text-pink-800 rounded-full">🖼️ Image</span>
                      )}
                      {link.isDynamic ? (
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Dynamic</span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">Static</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      <a
                        href={getShortUrl(link.shortCode)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:underline truncate"
                      >
                        /r/{link.shortCode}
                      </a>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MousePointerClick className="w-4 h-4 mr-2" />
                      <span>{link.clicks} clicks</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Link
                      to={`/edit/${link._id}`}
                      className="flex-1 btn btn-secondary text-sm flex items-center justify-center space-x-1"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </Link>
                    <Link
                      to={`/analytics/${link._id}`}
                      className="flex-1 btn btn-secondary text-sm flex items-center justify-center space-x-1"
                    >
                      <BarChart3 className="w-4 h-4" />
                      <span>Analytics</span>
                    </Link>
                    <button
                      onClick={() => handleDelete(link._id)}
                      className="btn btn-danger text-sm px-3"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showCreateModal && (
        <CreateLinkModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchData();
          }}
        />
      )}
    </div>
  );
};

const CreateLinkModal = ({ onClose, onSuccess }) => {
  const [qrType, setQrType] = useState('url'); // 'url', 'text', 'image'
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageSource, setImageSource] = useState('upload'); // 'upload' or 'url'
  const [isDynamic, setIsDynamic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [urlPreview, setUrlPreview] = useState('');
  const [validating, setValidating] = useState(false);

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

  const handleUrlChange = (e) => {
    const inputUrl = e.target.value;
    setUrl(inputUrl);
    
    // Show preview of normalized URL
    if (inputUrl.trim()) {
      const normalized = normalizeUrl(inputUrl);
      setUrlPreview(normalized);
      
      // Validate and show error if invalid
      if (!validateUrl(normalized)) {
        setError('Invalid URL. Please enter a valid URL such as example.com or www.example.com');
      } else {
        setError('');
      }
    } else {
      setUrlPreview('');
      setError('');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setValidating(true);

    try {
      let finalUrl = '';

      // Handle different QR code types
      if (qrType === 'url') {
        // Normalize the URL
        const normalizedUrl = normalizeUrl(url);
        
        // Validate URL format
        const isValid = validateUrl(normalizedUrl);
        if (!isValid) {
          setError('Invalid URL. Please enter a valid URL such as example.com or https://example.com');
          setLoading(false);
          setValidating(false);
          return;
        }

        // Check if URL is actually reachable
        const isReachable = await checkUrlReachable(normalizedUrl);
        setValidating(false);
        
        if (!isReachable) {
          setError('Unable to access this URL. Please check that the website exists and is working');
          setLoading(false);
          return;
        }

        finalUrl = normalizedUrl;
      } else if (qrType === 'text') {
        // For text type, just use the text as-is
        if (!text.trim()) {
          setError('Please enter some text');
          setLoading(false);
          setValidating(false);
          return;
        }
        finalUrl = text.trim();
        setValidating(false);
      } else if (qrType === 'image') {
        // For image type, check if it's a file upload (base64) or URL
        if (!imageUrl) {
          setError('Please upload an image or provide an image URL');
          setLoading(false);
          setValidating(false);
          return;
        }

        // If it's base64 data (uploaded file), use it directly
        if (imageUrl.startsWith('data:')) {
          finalUrl = imageUrl;
          setValidating(false);
        } else {
          // If it's a URL, validate it
          const normalizedImageUrl = normalizeUrl(imageUrl);
          
          const isValid = validateUrl(normalizedImageUrl);
          if (!isValid) {
            setError('Invalid image URL. Please enter a valid URL');
            setLoading(false);
            setValidating(false);
            return;
          }

          const isReachable = await checkUrlReachable(normalizedImageUrl);
          setValidating(false);
          
          if (!isReachable) {
            setError('Unable to access this image URL');
            setLoading(false);
            return;
          }

          finalUrl = normalizedImageUrl;
        }
      }

      // Create QR code
      await api.post('/links', {
        title,
        originalUrl: finalUrl,
        isDynamic: isDynamic, // All types can be dynamic
        qrType: qrType
      });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create QR Code');
    } finally {
      setLoading(false);
      setValidating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Create New QR Code</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              QR Code Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setQrType('url')}
                className={`p-3 border rounded-lg text-center transition-all ${
                  qrType === 'url'
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Link2 className="w-6 h-6 mx-auto mb-1" />
                <div className="text-sm font-medium">Link</div>
              </button>
              <button
                type="button"
                onClick={() => setQrType('text')}
                className={`p-3 border rounded-lg text-center transition-all ${
                  qrType === 'text'
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <FileText className="w-6 h-6 mx-auto mb-1" />
                <div className="text-sm font-medium">Text</div>
              </button>
              <button
                type="button"
                onClick={() => setQrType('image')}
                className={`p-3 border rounded-lg text-center transition-all ${
                  qrType === 'image'
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <ImageIcon className="w-6 h-6 mx-auto mb-1" />
                <div className="text-sm font-medium">Image</div>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              QR Code Name
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input"
              placeholder="e.g. My Website"
              required
            />
          </div>

          {qrType === 'url' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Destination URL
                </label>
                <input
                  type="text"
                  value={url}
                  onChange={handleUrlChange}
                  className="input"
                  placeholder="example.com or www.example.com"
                  required
                />
                {urlPreview && (
                  <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                    <span className="text-gray-600">Will be saved as: </span>
                    <span className="text-blue-700 font-medium">{urlPreview}</span>
                  </div>
                )}
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isDynamic}
                    onChange={(e) => setIsDynamic(e.target.checked)}
                    className="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Dynamic QR Code</div>
                    <p className="text-sm text-gray-600 mt-1">
                      Can edit URL later (Recommended)
                    </p>
                  </div>
                </label>
              </div>
            </>
          )}

          {qrType === 'text' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text Content
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="input min-h-[120px]"
                  placeholder="Enter any text, phone number, email, or message..."
                  required
                />
                <p className="mt-2 text-sm text-gray-500">
                  The QR code will contain this text. When scanned, it will display the text directly.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isDynamic}
                    onChange={(e) => setIsDynamic(e.target.checked)}
                    className="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Dynamic QR Code</div>
                    <p className="text-sm text-gray-600 mt-1">
                      Can edit content later (Recommended)
                    </p>
                  </div>
                </label>
              </div>
            </>
          )}

          {qrType === 'image' && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 uppercase text-xs tracking-wide">
                  Image Source
                </label>
                <div className="flex gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setImageSource('upload')}
                    className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-all ${
                      imageSource === 'upload'
                        ? 'bg-white text-primary-600 border-2 border-primary-500'
                        : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                    }`}
                  >
                    Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageSource('url')}
                    className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-all ${
                      imageSource === 'url'
                        ? 'bg-white text-primary-600 border-2 border-primary-500'
                        : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                    }`}
                  >
                    Image URL
                  </button>
                </div>
              </div>

              {imageSource === 'upload' ? (
                !imageUrl ? (
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-400 transition-colors cursor-pointer"
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.add('border-primary-500', 'bg-primary-50');
                    }}
                    onDragLeave={(e) => {
                      e.currentTarget.classList.remove('border-primary-500', 'bg-primary-50');
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.remove('border-primary-500', 'bg-primary-50');
                      const file = e.dataTransfer.files[0];
                      if (file && file.type.startsWith('image/')) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setImageUrl(reader.result);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    onClick={() => document.getElementById('imageFileInput').click()}
                  >
                    <Cloud className="w-12 h-12 mx-auto mb-3 text-primary-500" />
                    <p className="text-gray-600 mb-2">
                      Drag and drop your image here, or
                    </p>
                    <button
                      type="button"
                      className="btn btn-primary inline-block"
                      onClick={(e) => {
                        e.stopPropagation();
                        document.getElementById('imageFileInput').click();
                      }}
                    >
                      Upload Image
                    </button>
                    <p className="text-xs text-gray-500 mt-3">
                      JPG, PNG OR SVG (MAX 5MB)
                    </p>
                    <input
                      id="imageFileInput"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setImageUrl(reader.result);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="relative">
                      <div className="absolute top-2 left-2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                        PREVIEW
                      </div>
                      <button
                        type="button"
                        onClick={() => setImageUrl('')}
                        className="absolute top-2 right-2 bg-gray-600 text-white rounded-full p-1.5 hover:bg-gray-700 transition-colors shadow-lg"
                        title="Remove image"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      <img 
                        src={imageUrl} 
                        alt="Preview" 
                        className="w-full rounded"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-3 text-center">
                      Successfully fetched image. When scanned, users will be directed to this file.
                    </p>
                  </div>
                )
              ) : (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={typeof imageUrl === 'string' && !imageUrl.startsWith('data:') ? imageUrl : ''}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="input"
                    placeholder="https://example.com/logo.png"
                  />
                  {imageUrl && !imageUrl.startsWith('data:') && (
                    <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="relative">
                        <div className="absolute top-2 left-2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                          PREVIEW
                        </div>
                        <button
                          type="button"
                          onClick={() => setImageUrl('')}
                          className="absolute top-2 right-2 bg-gray-600 text-white rounded-full p-1.5 hover:bg-gray-700 transition-colors shadow-lg"
                          title="Remove image"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        <img 
                          src={imageUrl} 
                          alt="Preview" 
                          className="w-full rounded"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                      <p className="text-xs text-gray-600 mt-3 text-center">
                        Successfully fetched image. When scanned, users will be directed to this file.
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="border border-gray-200 rounded-lg p-4">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isDynamic}
                    onChange={(e) => setIsDynamic(e.target.checked)}
                    className="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Dynamic QR Code</div>
                    <p className="text-sm text-gray-600 mt-1">
                      Can edit image later (Recommended)
                    </p>
                  </div>
                </label>
              </div>
            </div>
          )}

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn btn-primary"
            >
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;
