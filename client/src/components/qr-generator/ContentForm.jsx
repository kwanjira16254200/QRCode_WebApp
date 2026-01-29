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

      case 'pdf':
        return (
          <div className="space-y-4">
            {nameField}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">PDF URL</label>
              <input
                type="url"
                value={formData.url || ''}
                onChange={(e) => handleChange('url', e.target.value)}
                placeholder="https://example.com/document.pdf"
                className="input"
                required
              />
              <p className="mt-1 text-sm text-gray-500">Enter the direct link to your PDF file</p>
            </div>
          </div>
        );

      case 'video':
        const uploadedVideo = formData.uploadedVideo;
        
        const handleVideoUpload = (e) => {
          const file = e.target.files[0];
          if (!file) return;
          
          const maxSize = 250 * 1024 * 1024; // 250MB
          
          if (file.size > maxSize) {
            alert(`Video file size exceeds 250MB. File size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
            return;
          }
          
          if (!file.type.startsWith('video/')) {
            alert('Please upload a video file');
            return;
          }
          
          const reader = new FileReader();
          reader.onload = (e) => {
            handleChange('uploadedVideo', {
              data: e.target.result,
              name: file.name,
              size: file.size,
              type: file.type
            });
          };
          reader.readAsDataURL(file);
        };
        
        const handleRemoveVideo = () => {
          handleChange('uploadedVideo', null);
        };
        
        return (
          <div className="space-y-4">
            {nameField}
            
            {/* Video Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Video</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-500 transition-colors">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                  id="video-upload"
                />
                <label htmlFor="video-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center">
                    <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-sm text-gray-600 mb-1">Click to upload video</p>
                    <p className="text-xs text-gray-500">Maximum size: 250MB</p>
                  </div>
                </label>
              </div>
              
              {uploadedVideo && (
                <div className="mt-3 p-3 bg-gray-50 rounded flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-purple-100 rounded flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">{uploadedVideo.name}</p>
                      <p className="text-xs text-gray-500">{(uploadedVideo.size / 1024 / 1024).toFixed(2)}MB</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveVideo}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
            
            {/* Video URL Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Or Enter Video URL</label>
              <input
                type="url"
                value={formData.url || ''}
                onChange={(e) => handleChange('url', e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="input"
              />
              <p className="mt-1 text-sm text-gray-500">Enter YouTube, Vimeo, or direct video link</p>
            </div>
          </div>
        );

      case 'facebook':
        return (
          <div className="space-y-4">
            {nameField}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Facebook URL</label>
              <input
                type="url"
                value={formData.url || ''}
                onChange={(e) => handleChange('url', e.target.value)}
                placeholder="https://facebook.com/yourpage"
                className="input"
                required
              />
              <p className="mt-1 text-sm text-gray-500">Link to your Facebook profile or page</p>
            </div>
          </div>
        );

      case 'instagram':
        return (
          <div className="space-y-4">
            {nameField}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Instagram URL</label>
              <input
                type="url"
                value={formData.url || ''}
                onChange={(e) => handleChange('url', e.target.value)}
                placeholder="https://instagram.com/yourusername"
                className="input"
                required
              />
              <p className="mt-1 text-sm text-gray-500">Link to your Instagram profile</p>
            </div>
          </div>
        );

      case 'whatsapp':
        return (
          <div className="space-y-4">
            {nameField}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Number</label>
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+1234567890"
                className="input"
                required
              />
              <p className="mt-1 text-sm text-gray-500">Include country code (e.g., +66 for Thailand)</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pre-filled Message (Optional)</label>
              <textarea
                value={formData.message || ''}
                onChange={(e) => handleChange('message', e.target.value)}
                placeholder="Hello! I'd like to..."
                className="input min-h-[100px]"
              />
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

      case 'image':
        const imageUrls = formData.imageUrls || [''];
        const uploadedImages = formData.uploadedImages || [];
        
        const handleAddImageUrl = () => {
          if (imageUrls.length < 7) {
            handleChange('imageUrls', [...imageUrls, '']);
          }
        };
        
        const handleImageUrlChange = (index, value) => {
          const newUrls = [...imageUrls];
          newUrls[index] = value;
          handleChange('imageUrls', newUrls);
        };
        
        const handleRemoveImageUrl = (index) => {
          const newUrls = imageUrls.filter((_, i) => i !== index);
          handleChange('imageUrls', newUrls.length > 0 ? newUrls : ['']);
        };
        
        const handleImageUpload = (e) => {
          const files = Array.from(e.target.files);
          const maxSize = 10 * 1024 * 1024; // 10MB
          
          let totalSize = uploadedImages.reduce((sum, img) => sum + (img.size || 0), 0);
          const validFiles = [];
          
          for (const file of files) {
            if (totalSize + file.size > maxSize) {
              alert(`Total file size exceeds 10MB. Remaining space: ${((maxSize - totalSize) / 1024 / 1024).toFixed(2)}MB`);
              break;
            }
            if (!file.type.startsWith('image/')) {
              alert(`${file.name} is not an image file`);
              continue;
            }
            totalSize += file.size;
            validFiles.push(file);
          }
          
          if (validFiles.length > 0) {
            const readers = validFiles.map(file => {
              return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve({ data: e.target.result, name: file.name, size: file.size });
                reader.readAsDataURL(file);
              });
            });
            
            Promise.all(readers).then(results => {
              handleChange('uploadedImages', [...uploadedImages, ...results]);
            });
          }
        };
        
        const handleRemoveUploadedImage = (index) => {
          const newImages = uploadedImages.filter((_, i) => i !== index);
          handleChange('uploadedImages', newImages);
        };
        
        return (
          <div className="space-y-4">
            {nameField}
            
            {/* Image Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Images</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-500 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center">
                    <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-sm text-gray-600 mb-1">Click to upload images</p>
                    <p className="text-xs text-gray-500">Maximum total size: 10MB</p>
                  </div>
                </label>
              </div>
              
              {uploadedImages.length > 0 && (
                <div className="mt-3 space-y-2">
                  {uploadedImages.map((img, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center space-x-2">
                        <img src={img.data} alt={img.name} className="w-10 h-10 object-cover rounded" />
                        <span className="text-sm text-gray-700">{img.name}</span>
                        <span className="text-xs text-gray-500">({(img.size / 1024).toFixed(1)}KB)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveUploadedImage(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Image URL Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Or Add Image URLs (Max 7 links)
              </label>
              {imageUrls.map((url, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => handleImageUrlChange(index, e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="input flex-1"
                  />
                  {imageUrls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveImageUrl(index)}
                      className="px-3 py-2 text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              {imageUrls.length < 7 && (
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="mt-2 text-sm text-orange-600 hover:text-orange-700"
                >
                  + Add another image URL
                </button>
              )}
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
