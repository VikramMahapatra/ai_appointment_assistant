import React, { useState } from 'react';
import { 
  MessageCircle, 
  Calendar, 
  Clock, 
  TrendingUp, 
  Download,
  Phone,
  Send,
  Users,
  CheckCircle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const dailyActivity = [
  { day: 'Mon', messages: 45, appointments: 8, avgResponseTime: 2.3 },
  { day: 'Tue', messages: 52, appointments: 12, avgResponseTime: 1.8 },
  { day: 'Wed', messages: 48, appointments: 10, avgResponseTime: 2.1 },
  { day: 'Thu', messages: 61, appointments: 15, avgResponseTime: 1.9 },
  { day: 'Fri', messages: 55, appointments: 13, avgResponseTime: 2.0 },
  { day: 'Sat', messages: 38, appointments: 7, avgResponseTime: 2.5 },
  { day: 'Sun', messages: 33, appointments: 5, avgResponseTime: 2.8 },
];

const monthlyTrends = [
  { month: 'Jan', messages: 1200, appointments: 85, satisfaction: 4.2 },
  { month: 'Feb', messages: 1450, appointments: 102, satisfaction: 4.3 },
  { month: 'Mar', messages: 1680, appointments: 118, satisfaction: 4.1 },
  { month: 'Apr', messages: 1920, appointments: 134, satisfaction: 4.4 },
  { month: 'May', messages: 2150, appointments: 156, satisfaction: 4.2 },
  { month: 'Jun', messages: 2380, appointments: 178, satisfaction: 4.5 },
];

const channelBreakdown = [
  { name: 'WhatsApp', messages: 1850, appointments: 98, color: '#25D366' },
  { name: 'Telegram', messages: 995, appointments: 58, color: '#0088cc' },
];

const appointmentTypes = [
  { name: 'Consultation', value: 40, color: '#3B82F6' },
  { name: 'Demo', value: 35, color: '#10B981' },
  { name: 'Support', value: 25, color: '#F59E0B' },
];

const topQueries = [
  { query: 'Pricing information', count: 245, percentage: 18 },
  { query: 'Product features', count: 198, percentage: 15 },
  { query: 'Technical support', count: 156, percentage: 12 },
  { query: 'Account setup', count: 134, percentage: 10 },
  { query: 'Integration help', count: 89, percentage: 7 },
];

export default function OrgAnalytics() {
  const [timeRange, setTimeRange] = useState('30days');
  const [selectedChannel, setSelectedChannel] = useState('all');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Detailed insights into your AI assistant performance</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="1year">Last Year</option>
          </select>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Messages</p>
              <p className="text-2xl font-bold text-gray-900">2,845</p>
              <p className="text-sm text-green-600">+15% from last month</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <MessageCircle className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Appointments</p>
              <p className="text-2xl font-bold text-gray-900">156</p>
              <p className="text-sm text-green-600">+8% from last month</p>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Response Time</p>
              <p className="text-2xl font-bold text-gray-900">2.1s</p>
              <p className="text-sm text-green-600">-0.2s from last month</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-full">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Satisfaction</p>
              <p className="text-2xl font-bold text-gray-900">4.5/5</p>
              <p className="text-sm text-green-600">+0.3 from last month</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-full">
              <TrendingUp className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyActivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="messages" fill="#3B82F6" />
              <Bar dataKey="appointments" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="messages" stroke="#3B82F6" strokeWidth={2} />
              <Line type="monotone" dataKey="appointments" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Channel Performance and Appointment Types */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Channel Performance</h3>
          <div className="space-y-4">
            {channelBreakdown.map((channel) => (
              <div key={channel.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: channel.color }}></div>
                  <div>
                    <p className="font-medium text-gray-900">{channel.name}</p>
                    <p className="text-sm text-gray-600">{channel.messages} messages</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{channel.appointments}</p>
                  <p className="text-sm text-gray-600">appointments</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment Types</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={appointmentTypes}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {appointmentTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            {appointmentTypes.map((entry) => (
              <div key={entry.name} className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                  <span className="text-sm text-gray-600">{entry.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{entry.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Queries */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Top Customer Queries</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {topQueries.map((query, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{query.query}</span>
                    <span className="text-sm text-gray-600">{query.count} queries</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${query.percentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="ml-4 text-sm font-medium text-gray-600">
                  {query.percentage}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}