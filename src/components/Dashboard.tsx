import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Eye, 
  TrendingUp, 
  Clock,
  Search,
  Filter,
  MoreVertical,
  Calendar
} from 'lucide-react';
import { FaceData, Recognition, SystemStats } from '../types';
import { generateMockFaceData, generateMockRecognitions } from '../data/mockData';
import { format } from 'date-fns';
import clsx from 'clsx';

interface DashboardProps {
  className?: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ className }) => {
  const [users, setUsers] = useState<FaceData[]>([]);
  const [recognitions, setRecognitions] = useState<Recognition[]>([]);
  const [stats, setStats] = useState<SystemStats>({
    totalUsers: 0,
    totalRecognitions: 0,
    averageConfidence: 0,
    activeToday: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState<'overview' | 'users' | 'activity'>('overview');

  useEffect(() => {
    const mockUsers = generateMockFaceData();
    const mockRecognitions = generateMockRecognitions(mockUsers);
    
    setUsers(mockUsers);
    setRecognitions(mockRecognitions);
    
    // Calculate stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayRecognitions = mockRecognitions.filter(r => r.timestamp >= today);
    const avgConfidence = mockRecognitions.reduce((sum, r) => sum + r.confidence, 0) / mockRecognitions.length;
    
    setStats({
      totalUsers: 10000, // Simulating 10k dataset
      totalRecognitions: mockRecognitions.length * 50, // Scale up for demo
      averageConfidence: avgConfidence,
      activeToday: todayRecognitions.length * 10
    });
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const recentRecognitions = recognitions.slice(0, 10);

  const StatCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    value: string;
    trend?: string;
    trendColor?: string;
  }> = ({ icon, title, value, trend, trendColor = 'text-green-400' }) => (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            {icon}
          </div>
          <div>
            <p className="text-gray-400 text-sm">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
          </div>
        </div>
        {trend && (
          <div className={clsx("flex items-center gap-1 text-sm", trendColor)}>
            <TrendingUp className="h-4 w-4" />
            {trend}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={clsx("space-y-6", className)}>
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Face Recognition Dashboard</h1>
        <p className="text-gray-400">Monitor and manage your face recognition system</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'users', label: 'Users' },
          { id: 'activity', label: 'Activity' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as any)}
            className={clsx(
              "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors",
              selectedTab === tab.id
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:text-white"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {selectedTab === 'overview' && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={<Users className="h-5 w-5 text-white" />}
              title="Total Users"
              value={stats.totalUsers.toLocaleString()}
              trend="+12%"
            />
            <StatCard
              icon={<Eye className="h-5 w-5 text-white" />}
              title="Total Recognitions"
              value={stats.totalRecognitions.toLocaleString()}
              trend="+8%"
            />
            <StatCard
              icon={<TrendingUp className="h-5 w-5 text-white" />}
              title="Average Confidence"
              value={`${stats.averageConfidence.toFixed(1)}%`}
              trend="+2%"
            />
            <StatCard
              icon={<Clock className="h-5 w-5 text-white" />}
              title="Active Today"
              value={stats.activeToday.toLocaleString()}
              trend="+15%"
              trendColor="text-green-400"
            />
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-800 rounded-lg border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white">Recent Recognitions</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentRecognitions.map((recognition) => {
                  const user = users.find(u => u.id === recognition.userId);
                  return (
                    <div key={recognition.id} className="flex items-center justify-between py-3 border-b border-gray-700 last:border-b-0">
                      <div className="flex items-center gap-4">
                        <img
                          src={user?.imageUrl || 'https://via.placeholder.com/40'}
                          alt={user?.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-white font-medium">{user?.name || 'Unknown'}</p>
                          <p className="text-gray-400 text-sm">{recognition.location}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white text-sm">{recognition.confidence.toFixed(1)}%</p>
                        <p className="text-gray-400 text-xs">
                          {format(recognition.timestamp, 'MMM dd, HH:mm')}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {selectedTab === 'users' && (
        <div className="bg-gray-800 rounded-lg border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Registered Users</h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                  <Filter className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Registered
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Last Seen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Recognitions
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.imageUrl}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <span className="text-white font-medium">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                      {format(user.registeredAt, 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                      {user.lastSeen ? format(user.lastSeen, 'MMM dd, yyyy') : 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                      {user.recognitionCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button className="p-1 hover:bg-gray-600 rounded transition-colors">
                        <MoreVertical className="h-4 w-4 text-gray-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedTab === 'activity' && (
        <div className="bg-gray-800 rounded-lg border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Recognition Activity</h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-gray-300">
                <Calendar className="h-4 w-4" />
                Last 7 days
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {recognitions.map((recognition) => {
                const user = users.find(u => u.id === recognition.userId);
                return (
                  <div key={recognition.id} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <img
                        src={user?.imageUrl || 'https://via.placeholder.com/40'}
                        alt={user?.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-white font-medium">{user?.name || 'Unknown User'}</p>
                        <p className="text-gray-400 text-sm">{recognition.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <span className={clsx(
                          "px-2 py-1 rounded text-xs font-medium",
                          recognition.confidence > 90 
                            ? "bg-green-900/30 text-green-400" 
                            : recognition.confidence > 75
                            ? "bg-yellow-900/30 text-yellow-400"
                            : "bg-red-900/30 text-red-400"
                        )}>
                          {recognition.confidence.toFixed(1)}%
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mt-1">
                        {format(recognition.timestamp, 'MMM dd, yyyy HH:mm')}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};