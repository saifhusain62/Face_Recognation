import React, { useState } from 'react';
import { 
  Save, 
  Camera, 
  Database, 
  Shield, 
  Bell,
  Monitor,
  Sliders
} from 'lucide-react';
import clsx from 'clsx';

interface SettingsProps {
  className?: string;
}

export const Settings: React.FC<SettingsProps> = ({ className }) => {
  const [settings, setSettings] = useState({
    recognitionThreshold: 75,
    cameraResolution: '720p',
    saveUnknownFaces: true,
    enableNotifications: true,
    autoDeleteOldRecords: true,
    retentionDays: 90,
    enableLogging: true,
    maxFacesPerFrame: 5,
    confidenceDisplay: true,
    darkMode: true
  });

  const handleSave = () => {
    console.log('Settings saved:', settings);
  };

  const SettingSection: React.FC<{
    title: string;
    description: string;
    icon: React.ReactNode;
    children: React.ReactNode;
  }> = ({ title, description, icon, children }) => (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-600 rounded-lg">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="text-gray-400 text-sm">{description}</p>
        </div>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );

  const SettingItem: React.FC<{
    label: string;
    description?: string;
    children: React.ReactNode;
  }> = ({ label, description, children }) => (
    <div className="flex items-center justify-between">
      <div>
        <label className="text-white font-medium">{label}</label>
        {description && <p className="text-gray-400 text-sm">{description}</p>}
      </div>
      <div className="ml-4">
        {children}
      </div>
    </div>
  );

  return (
    <div className={clsx("space-y-6", className)}>
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Configure your face recognition system</p>
      </div>

      <SettingSection
        title="Recognition Settings"
        description="Configure face detection and recognition parameters"
        icon={<Shield className="h-5 w-5 text-white" />}
      >
        <SettingItem
          label="Recognition Threshold"
          description="Minimum confidence required for face matching"
        >
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="50"
              max="95"
              value={settings.recognitionThreshold}
              onChange={(e) => setSettings(prev => ({ 
                ...prev, 
                recognitionThreshold: parseInt(e.target.value) 
              }))}
              className="w-24"
            />
            <span className="text-white w-12 text-sm">{settings.recognitionThreshold}%</span>
          </div>
        </SettingItem>

        <SettingItem
          label="Max Faces Per Frame"
          description="Maximum number of faces to detect simultaneously"
        >
          <select
            value={settings.maxFacesPerFrame}
            onChange={(e) => setSettings(prev => ({ 
              ...prev, 
              maxFacesPerFrame: parseInt(e.target.value) 
            }))}
            className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-white"
          >
            <option value={1}>1</option>
            <option value={3}>3</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>
        </SettingItem>

        <SettingItem
          label="Save Unknown Faces"
          description="Store images of unrecognized faces for review"
        >
          <input
            type="checkbox"
            checked={settings.saveUnknownFaces}
            onChange={(e) => setSettings(prev => ({ 
              ...prev, 
              saveUnknownFaces: e.target.checked 
            }))}
            className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded"
          />
        </SettingItem>
      </SettingSection>

      <SettingSection
        title="Camera Settings"
        description="Configure camera and display options"
        icon={<Camera className="h-5 w-5 text-white" />}
      >
        <SettingItem
          label="Camera Resolution"
          description="Video capture resolution"
        >
          <select
            value={settings.cameraResolution}
            onChange={(e) => setSettings(prev => ({ 
              ...prev, 
              cameraResolution: e.target.value 
            }))}
            className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-white"
          >
            <option value="480p">480p</option>
            <option value="720p">720p</option>
            <option value="1080p">1080p</option>
          </select>
        </SettingItem>

        <SettingItem
          label="Show Confidence Scores"
          description="Display confidence percentages on detected faces"
        >
          <input
            type="checkbox"
            checked={settings.confidenceDisplay}
            onChange={(e) => setSettings(prev => ({ 
              ...prev, 
              confidenceDisplay: e.target.checked 
            }))}
            className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded"
          />
        </SettingItem>
      </SettingSection>

      <SettingSection
        title="Database Settings"
        description="Manage data storage and retention policies"
        icon={<Database className="h-5 w-5 text-white" />}
      >
        <SettingItem
          label="Auto-delete Old Records"
          description="Automatically remove old recognition records"
        >
          <input
            type="checkbox"
            checked={settings.autoDeleteOldRecords}
            onChange={(e) => setSettings(prev => ({ 
              ...prev, 
              autoDeleteOldRecords: e.target.checked 
            }))}
            className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded"
          />
        </SettingItem>

        <SettingItem
          label="Retention Period"
          description="Days to keep recognition records"
        >
          <select
            value={settings.retentionDays}
            onChange={(e) => setSettings(prev => ({ 
              ...prev, 
              retentionDays: parseInt(e.target.value) 
            }))}
            className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-white"
            disabled={!settings.autoDeleteOldRecords}
          >
            <option value={30}>30 days</option>
            <option value={90}>90 days</option>
            <option value={180}>180 days</option>
            <option value={365}>1 year</option>
          </select>
        </SettingItem>
      </SettingSection>

      <SettingSection
        title="Notifications"
        description="Configure system notifications and alerts"
        icon={<Bell className="h-5 w-5 text-white" />}
      >
        <SettingItem
          label="Enable Notifications"
          description="Receive alerts for new recognitions"
        >
          <input
            type="checkbox"
            checked={settings.enableNotifications}
            onChange={(e) => setSettings(prev => ({ 
              ...prev, 
              enableNotifications: e.target.checked 
            }))}
            className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded"
          />
        </SettingItem>

        <SettingItem
          label="System Logging"
          description="Enable detailed system logging"
        >
          <input
            type="checkbox"
            checked={settings.enableLogging}
            onChange={(e) => setSettings(prev => ({ 
              ...prev, 
              enableLogging: e.target.checked 
            }))}
            className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded"
          />
        </SettingItem>
      </SettingSection>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          Save Settings
        </button>
      </div>
    </div>
  );
};