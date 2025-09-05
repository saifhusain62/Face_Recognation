import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { Camera } from './components/Camera';
import { Dashboard } from './components/Dashboard';
import { Settings } from './components/Settings';
import { UserRegistration } from './components/UserRegistration';

function App() {
  const [activeTab, setActiveTab] = useState('camera');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'camera':
        return (
          <div className="p-6 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Live Camera Feed</h1>
              <p className="text-gray-400">Real-time face detection and recognition</p>
            </div>
            <Camera
              isActive={isCameraActive}
              onToggle={() => setIsCameraActive(!isCameraActive)}
              className="w-full h-96"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-2">Detection Status</h3>
                <p className="text-gray-400">
                  {isCameraActive ? 'Camera is active and detecting faces' : 'Camera is inactive'}
                </p>
              </div>
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-2">Recognition Mode</h3>
                <p className="text-gray-400">Real-time face matching enabled</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-2">Database</h3>
                <p className="text-gray-400">10,000 registered faces</p>
              </div>
            </div>
          </div>
        );
      case 'dashboard':
        return <Dashboard className="p-6" />;
      case 'users':
        return <Dashboard className="p-6" />;
      case 'settings':
        return <Settings className="p-6" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onRegisterUser={() => setIsRegistrationOpen(true)}
      />
      
      <main className="flex-1 overflow-auto">
        {renderContent()}
      </main>

      <UserRegistration
        isOpen={isRegistrationOpen}
        onClose={() => setIsRegistrationOpen(false)}
        onSuccess={() => {
          console.log('User registered successfully');
        }}
      />
    </div>
  );
}

export default App;