import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { ArrowLeft, MousePointerClick, Calendar, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Analytics = () => {
  const { id } = useParams();
  const [link, setLink] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [linkRes, analyticsRes] = await Promise.all([
        api.get(`/links/${id}`),
        api.get(`/links/${id}/analytics`)
      ]);
      setLink(linkRes.data);
      setAnalytics(analyticsRes.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
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
        <Link to="/dashboard" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6">
          <ArrowLeft className="w-5 h-5 mr-2" />
          กลับไปหน้า Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{link?.title}</h1>
          <p className="text-gray-600 mt-1">สถิติและการวิเคราะห์</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">คลิกทั้งหมด</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{analytics?.totalClicks || 0}</p>
              </div>
              <MousePointerClick className="w-12 h-12 text-primary-600" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">คลิกล่าสุด</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {analytics?.recentClicks?.length || 0}
                </p>
              </div>
              <Calendar className="w-12 h-12 text-green-600" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">สถานะ</p>
                <p className="text-lg font-bold mt-1">
                  {link?.isActive ? (
                    <span className="text-green-600">เปิดใช้งาน</span>
                  ) : (
                    <span className="text-red-600">ปิดใช้งาน</span>
                  )}
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">กราฟสถิติรายวัน (30 วันล่าสุด)</h2>
          
          {analytics?.dailyStats?.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.dailyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="clicks" 
                    stroke="#0ea5e9" 
                    strokeWidth={2}
                    dot={{ fill: '#0ea5e9' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              ยังไม่มีข้อมูลสถิติ
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">การคลิกล่าสุด</h2>
          
          {analytics?.recentClicks?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">วันที่</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">เวลา</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">User Agent</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.recentClicks.map((click, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {new Date(click.timestamp).toLocaleDateString('th-TH')}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {new Date(click.timestamp).toLocaleTimeString('th-TH')}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 truncate max-w-md">
                        {click.userAgent || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              ยังไม่มีการคลิก
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
