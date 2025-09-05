import React from 'react';
import { Camera, Users, BarChart3, Settings, UserPlus } from 'lucide-react';
import { loadUsersFromStorage } from '../utils/storage';
import clsx from 'clsx';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onRegisterUser: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ 
  activeTab, 
  onTabChange, 
  onRegisterUser 
}) => {
  const userCount = loadUsersFromStorage().length;
  
  const navItems = [
    { id: 'camera', label: 'Live Camera', icon: Camera },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <nav className="bg-gray-900 border-r border-gray-800 w-64 min-h-screen">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
            <Camera className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">FaceRecog</h1>
            <p className="text-gray-400 text-sm">AI Recognition System</p>
          </div>
        </div>

        <button
          onClick={onRegisterUser}
          className="w-full mb-6 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg text-white font-medium transition-all duration-200 flex items-center justify-center gap-2"
        >
          <UserPlus className="h-4 w-4" />
          Register New User
        </button>

        <div className="space-y-2">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={clsx(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                  activeTab === item.id
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="mt-8 p-4 bg-gray-800 rounded-lg">
          <h3 className="text-white font-medium mb-2">System Status</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Models</span>
              <span className="text-green-400">Loaded</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Database</span>
              <span className="text-green-400">{userCount} Users</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Camera</span>
              <span className="text-blue-400">Ready</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};