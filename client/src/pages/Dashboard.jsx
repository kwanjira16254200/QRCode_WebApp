import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Plus, QrCode, MousePointerClick, TrendingUp, ExternalLink, Edit, Trash2, BarChart3 } from 'lucide-react';
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
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Create QR Code</span>
          </button>
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
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn btn-primary"
              >
                Create your first QR Code
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {links.map((link) => (
                <div key={link._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-center mb-4">
                    <QRCodeSVG
                      value={getShortUrl(link.shortCode)}
                      size={150}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 truncate flex-1">{link.title}</h3>
                    {link.isDynamic ? (
                      <span className="ml-2 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Dynamic</span>
                    ) : (
                      <span className="ml-2 px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">Static</span>
                    )}
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
                      to={`/link/${link._id}`}
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
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [isDynamic, setIsDynamic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/links', {
        title,
        originalUrl: url,
        isDynamic
      });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Creation failed');
    } finally {
      setLoading(false);
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Destination URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="input"
              placeholder="https://example.com"
              required
            />
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
                <div className="text-sm text-gray-600 mt-1">
                  {isDynamic ? (
                    <span className="text-green-600">✓ Can edit URL later (Recommended)</span>
                  ) : (
                    <span className="text-orange-600">⚠ Cannot edit URL (Static QR)</span>
                  )}
                </div>
              </div>
            </label>
          </div>

          <div className="flex space-x-3 pt-4">
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
              className="flex-1 btn btn-primary disabled:opacity-50"
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
