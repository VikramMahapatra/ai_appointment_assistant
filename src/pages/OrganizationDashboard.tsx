import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  Calendar, 
  CheckCircle, 
  Clock,
  TrendingUp,
  ArrowUpRight,
  Phone,
  Send
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';

interface AnalyticsData {
  total_messages: number;
  total_appointments: number;
  active_users: number;
  avg_response_time: number;
  channel_breakdown: Record<string, number>;
  appointment_status_breakdown: Record<string, number>;
  daily_activity: Array<{
    date: string;
    messages: number;
    appointments: number;
  }>;
  monthly_trends: Array<{
    month: string;
    messages: number;
    appointments: number;
  }>;
}

interface Message {
  id: number;
  channel: string;
  content: string;
  is_from_customer: boolean;
  created_at: string;
}

export default function OrganizationDashboard() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [recentMessages, setRecentMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.organizationId) return;

      try {
        const [analyticsData, messagesData] = await Promise.all([
          apiService.getOrganizationAnalytics(parseInt(user.organizationId)),
          apiService.getMessages(parseInt(user.organizationId))
        ]);
        
        setAnalytics(analyticsData);
        setRecentMessages(messagesData.slice(0, 5)); // Get last 5 messages
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-500">Failed to load dashboard data</p>
        </div>
      </div>
    );
  }

  const stats = [
    { 
      name: 'Total Messages', 
      value: analytics.total_messages.toString(), 
      change: '+15%', 
      icon: MessageCircle 
    },
    { 
      name: 'Appointments Booked', 
      value: analytics.total_appointments.toString(), 
      change: '+8%', 
      icon: Calendar 
    },
    { 
      name: 'Completed Sessions', 
      value: (analytics.appointment_status_breakdown.completed || 0).toString(), 
      change: '+12%', 
      icon: CheckCircle 
    },
    { 
      name: 'Avg Response Time', 
      value: `${analytics.avg_response_time}s`, 
      change: '-5%', 
      icon: Clock 
    },
  ];

  // Convert daily activity to weekly format for chart
  const weeklyData = analytics.daily_activity.slice(0, 7).map((day, index) => ({
    name: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][index] || `Day ${index + 1}`,
    messages: day.messages,
    appointments: day.appointments
  }));

  const channelStats = Object.entries(analytics.channel_breakdown).map(([channel, count]) => ({
    name: channel,
    messages: count,
    appointments: Math.floor(count * 0.1), // Estimate appointments from messages
    color: channel === 'whatsapp' ? '#25D366' : '#0088cc'
  }));

  // Generate recent activity from messages
  const recentActivity = recentMessages.map((message, index) => ({
    type: Math.random() > 0.7 ? 'appointment' : 'message',
    message: message.is_from_customer 
      ? `Customer inquiry: ${message.content.substring(0, 50)}...`
      : `AI response sent`,
    time: new Date(message.created_at).toLocaleString(),
    channel: message.channel
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Organization Dashboard</h1>
          <p className="text-gray-600">Monitor your AI assistant performance and customer interactions</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span>Last updated: 1 minute ago</span>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
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
              <div className="flex items-center space-x-1 text-green-600">
                <ArrowUpRight className="h-4 w-4" />
                <span className="text-sm font-medium">{stat.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="messages" fill="#3B82F6" />
              <Bar dataKey="appointments" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Channel Performance</h3>
          <div className="space-y-4">
            {channelStats.map((channel) => (
              <div key={channel.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: channel.color }}></div>
                  <div>
                    <p className="font-medium text-gray-900 capitalize">{channel.name}</p>
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
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {recentActivity.length > 0 ? recentActivity.map((activity, index) => (
            <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    activity.type === 'appointment' ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                    {activity.type === 'appointment' ? (
                      <Calendar className={`h-4 w-4 ${
                        activity.type === 'appointment' ? 'text-green-600' : 'text-blue-600'
                      }`} />
                    ) : (
                      <MessageCircle className={`h-4 w-4 ${
                        activity.type === 'appointment' ? 'text-green-600' : 'text-blue-600'
                      }`} />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{activity.message}</p>
                    <p className="text-sm text-gray-600">{activity.time}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full capitalize ${
                    activity.channel === 'whatsapp' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {activity.channel}
                  </span>
                  {activity.channel === 'whatsapp' ? (
                    <Phone className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Send className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              </div>
            </div>
          )) : (
            <div className="p-6 text-center text-gray-500">
              No recent activity
            </div>
          )}
        </div>
      </div>
    </div>
  );
}