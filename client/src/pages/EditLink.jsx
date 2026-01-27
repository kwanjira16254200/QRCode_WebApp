import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { QRCodeSVG } from 'qrcode.react';
import { ArrowLeft, Download, ExternalLink, Save, Copy, Check } from 'lucide-react';

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
    } catch (error) {
      console.error('Error fetching link:', error);
      alert('ไม่พบ QR Code นี้');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.put(`/links/${id}`, {
        title,
        originalUrl,
        isActive
      });
      alert('บันทึกสำเร็จ');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating link:', error);
      alert('บันทึกไม่สำเร็จ');
    } finally {
      setSaving(false);
    }
  };

  const getShortUrl = () => {
    return `${window.location.origin}/r/${link?.shortCode}`;
  };

  const handleDownloadQR = () => {
    const svg = document.getElementById('qr-code');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      
      const downloadLink = document.createElement('a');
      downloadLink.download = `qr-${link.shortCode}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/dashboard" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6">
          <ArrowLeft className="w-5 h-5 mr-2" />
          กลับไปหน้า Dashboard
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">แก้ไข QR Code</h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ชื่อ QR Code
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
                  URL ปลายทาง
                </label>
                {link?.isDynamic === false && (
                  <div className="mb-2 p-3 bg-orange-50 border border-orange-200 rounded-lg text-orange-700 text-sm">
                    ⚠ นี่คือ Static QR Code - ไม่สามารถแก้ไข URL ได้
                  </div>
                )}
                <input
                  type="url"
                  value={originalUrl}
                  onChange={(e) => setOriginalUrl(e.target.value)}
                  className="input"
                  disabled={link?.isDynamic === false}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short URL
                </label>
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
                  เปิดใช้งาน QR Code
                </label>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full btn btn-primary flex items-center justify-center space-x-2"
                >
                  <Save className="w-5 h-5" />
                  <span>{saving ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}</span>
                </button>
              </div>
            </form>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">QR Code Preview</h2>

            <div className="flex flex-col items-center space-y-6">
              <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                <QRCodeSVG
                  id="qr-code"
                  value={getShortUrl()}
                  size={250}
                  level="H"
                  includeMargin={true}
                />
              </div>

              <div className="w-full space-y-3">
                <button
                  onClick={handleDownloadQR}
                  className="w-full btn btn-primary flex items-center justify-center space-x-2"
                >
                  <Download className="w-5 h-5" />
                  <span>ดาวน์โหลด QR Code</span>
                </button>

                <a
                  href={getShortUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full btn btn-secondary flex items-center justify-center space-x-2"
                >
                  <ExternalLink className="w-5 h-5" />
                  <span>ทดสอบลิงก์</span>
                </a>
              </div>

              <div className="w-full p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">สถิติ</p>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">จำนวนคลิก</span>
                  <span className="text-2xl font-bold text-primary-600">{link?.clicks || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditLink;
