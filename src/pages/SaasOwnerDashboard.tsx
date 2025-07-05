import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Building2, 
  MessageCircle, 
  Calendar, 
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';

interface PlatformStats {
  total_organizations: number;
  active_organizations: number;
  total_users: number;
  total_messages: number;
  total_appointments: number;
  top_organizations: Array<{
    name: string;
    messages: number;
    appointments: number;
  }>;
}

export default function SaasOwnerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const platformStats = await apiService.getPlatformAnalytics();
        setStats(platformStats);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'saas_owner') {
      fetchData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-500">Failed to load dashboard data</p>
        </div>
      </div>
    );
  }

  const dashboardStats = [
    { 
      name: 'Total Tenants', 
      value: stats.total_organizations.toString(), 
      change: '+12%', 
      trend: 'up', 
      icon: Building2 
    },
    { 
      name: 'Active Users', 
      value: stats.total_users.toString(), 
      change: '+8%', 
      trend: 'up', 
      icon: Users 
    },
    { 
      name: 'Monthly Messages', 
      value: stats.total_messages.toLocaleString(), 
      change: '+23%', 
      trend: 'up', 
      icon: MessageCircle 
    },
    { 
      name: 'Total Appointments', 
      value: stats.total_appointments.toLocaleString(), 
      change: '-2%', 
      trend: 'down', 
      icon: Calendar 
    },
  ];

  // Generate mock monthly data for charts (in a real app, this would come from the API)
  const monthlyData = [
    { name: 'Jan', messages: Math.floor(stats.total_messages * 0.1), appointments: Math.floor(stats.total_appointments * 0.1) },
    { name: 'Feb', messages: Math.floor(stats.total_messages * 0.12), appointments: Math.floor(stats.total_appointments * 0.12) },
    { name: 'Mar', messages: Math.floor(stats.total_messages * 0.14), appointments: Math.floor(stats.total_appointments * 0.14) },
    { name: 'Apr', messages: Math.floor(stats.total_messages * 0.16), appointments: Math.floor(stats.total_appointments * 0.16) },
    { name: 'May', messages: Math.floor(stats.total_messages * 0.18), appointments: Math.floor(stats.total_appointments * 0.18) },
    { name: 'Jun', messages: Math.floor(stats.total_messages * 0.2), appointments: Math.floor(stats.total_appointments * 0.2) },
  ];

  const channelData = [
    { name: 'WhatsApp', value: 65, color: '#25D366' },
    { name: 'Telegram', value: 35, color: '#0088cc' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">SaaS Platform Overview</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span>Last updated: 2 minutes ago</span>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <stat.icon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
              <div className={`flex items-center space-x-1 ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.trend === 'up' ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <ArrowDownRight className="h-4 w-4" />
                )}
                <span className="text-sm font-medium">{stat.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="messages" stroke="#3B82F6" strokeWidth={2} />
              <Line type="monotone" dataKey="appointments" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Channel Distribution</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={channelData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {channelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-6 mt-4">
            {channelData.map((entry) => (
              <div key={entry.name} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                <span className="text-sm text-gray-600">{entry.name} ({entry.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Tenants */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Top Performing Tenants</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Organization</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Messages</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Appointments</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Growth</th>
              </tr>
            </thead>
            <tbody>
              {stats.top_organizations.map((tenant, index) => (
                <tr key={index} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {tenant.name.charAt(0)}
                        </span>
                      </div>
                      <span className="font-medium text-gray-900">{tenant.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{tenant.messages?.toLocaleString?.() ?? tenant.messages}</td>
                  <td className="py-4 px-6 text-gray-600">{tenant.appointments}</td>
                  <td className="py-4 px-6">
                    <span className="text-green-600 font-medium">+{Math.floor(Math.random() * 20 + 5)}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}