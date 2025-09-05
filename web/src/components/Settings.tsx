import {
  Bell,
  Database,
  Globe,
  Mail,
  Save,
  Shield,
  Trash2,
  User,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { SupabaseService } from "../lib/supabaseService";

interface SettingsData {
  // General Settings
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  adminEmail: string;

  // Notification Settings
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyReports: boolean;

  // Security Settings
  requireEmailVerification: boolean;
  allowUserRegistration: boolean;
  sessionTimeout: number;

  // Data Settings
  autoBackup: boolean;
  backupFrequency: string;
  dataRetentionDays: number;
}

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<SettingsData>({
    siteName: "StudyPath",
    siteDescription: "Modern Learning Platform",
    siteUrl: "https://studypath.app",
    adminEmail: "",
    emailNotifications: true,
    pushNotifications: true,
    weeklyReports: false,
    requireEmailVerification: true,
    allowUserRegistration: true,
    sessionTimeout: 24,
    autoBackup: true,
    backupFrequency: "daily",
    dataRetentionDays: 365,
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      // In a real app, you'd fetch settings from your backend
      // For now, we'll use the default values
      const { user } = await SupabaseService.getCurrentUser();
      if (user) {
        setSettings(prev => ({
          ...prev,
          adminEmail: user.email || "",
        }));
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // In a real app, you'd save settings to your backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Error saving settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    try {
      // In a real app, you'd reset settings to defaults
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setSettings({
        siteName: "StudyPath",
        siteDescription: "Modern Learning Platform",
        siteUrl: "https://studypath.app",
        adminEmail: "",
        emailNotifications: true,
        pushNotifications: true,
        weeklyReports: false,
        requireEmailVerification: true,
        allowUserRegistration: true,
        sessionTimeout: 24,
        autoBackup: true,
        backupFrequency: "daily",
        dataRetentionDays: 365,
      });
      setShowResetModal(false);
      alert("Settings reset to defaults!");
    } catch (error) {
      console.error("Error resetting settings:", error);
      alert("Error resetting settings. Please try again.");
    }
  };

  const handleClearData = async () => {
    if (
      !confirm(
        "Are you sure you want to clear all data? This action cannot be undone!",
      )
    )
      return;

    try {
      // In a real app, you'd implement data clearing logic
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      alert("All data has been cleared successfully!");
    } catch (error) {
      console.error("Error clearing data:", error);
      alert("Error clearing data. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-dark-400 mt-2">
            Configure your StudyPath admin panel and platform settings
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary flex items-center space-x-2"
        >
          <Save className="w-5 h-5" />
          <span>{saving ? "Saving..." : "Save Settings"}</span>
        </button>
      </div>

      {/* General Settings */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
            <Globe className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">
              General Settings
            </h2>
            <p className="text-dark-400 text-sm">
              Basic platform configuration
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-white font-medium mb-2">
              Site Name
            </label>
            <input
              type="text"
              value={settings.siteName}
              onChange={e =>
                setSettings(prev => ({ ...prev, siteName: e.target.value }))
              }
              className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter site name"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              Admin Email
            </label>
            <input
              type="email"
              value={settings.adminEmail}
              onChange={e =>
                setSettings(prev => ({ ...prev, adminEmail: e.target.value }))
              }
              className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="admin@studypath.app"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-white font-medium mb-2">
              Site Description
            </label>
            <textarea
              value={settings.siteDescription}
              onChange={e =>
                setSettings(prev => ({
                  ...prev,
                  siteDescription: e.target.value,
                }))
              }
              className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 h-24 resize-none"
              placeholder="Describe your learning platform"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              Site URL
            </label>
            <input
              type="url"
              value={settings.siteUrl}
              onChange={e =>
                setSettings(prev => ({ ...prev, siteUrl: e.target.value }))
              }
              className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="https://studypath.app"
            />
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
            <Bell className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">
              Notification Settings
            </h2>
            <p className="text-dark-400 text-sm">
              Configure notification preferences
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-dark-800 rounded-lg">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-green-500" />
              <div>
                <h3 className="text-white font-medium">Email Notifications</h3>
                <p className="text-dark-400 text-sm">
                  Receive notifications via email
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={e =>
                  setSettings(prev => ({
                    ...prev,
                    emailNotifications: e.target.checked,
                  }))
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-dark-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-dark-800 rounded-lg">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-blue-500" />
              <div>
                <h3 className="text-white font-medium">Push Notifications</h3>
                <p className="text-dark-400 text-sm">
                  Receive push notifications in browser
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.pushNotifications}
                onChange={e =>
                  setSettings(prev => ({
                    ...prev,
                    pushNotifications: e.target.checked,
                  }))
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-dark-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-dark-800 rounded-lg">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-purple-500" />
              <div>
                <h3 className="text-white font-medium">Weekly Reports</h3>
                <p className="text-dark-400 text-sm">
                  Receive weekly analytics reports
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.weeklyReports}
                onChange={e =>
                  setSettings(prev => ({
                    ...prev,
                    weeklyReports: e.target.checked,
                  }))
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-dark-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">
              Security Settings
            </h2>
            <p className="text-dark-400 text-sm">
              Configure security and access controls
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-dark-800 rounded-lg">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-red-500" />
              <div>
                <h3 className="text-white font-medium">
                  Require Email Verification
                </h3>
                <p className="text-dark-400 text-sm">
                  Users must verify their email before accessing the platform
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.requireEmailVerification}
                onChange={e =>
                  setSettings(prev => ({
                    ...prev,
                    requireEmailVerification: e.target.checked,
                  }))
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-dark-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-dark-800 rounded-lg">
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-blue-500" />
              <div>
                <h3 className="text-white font-medium">
                  Allow User Registration
                </h3>
                <p className="text-dark-400 text-sm">
                  Allow new users to register on the platform
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.allowUserRegistration}
                onChange={e =>
                  setSettings(prev => ({
                    ...prev,
                    allowUserRegistration: e.target.checked,
                  }))
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-dark-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
            </label>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              Session Timeout (hours)
            </label>
            <input
              type="number"
              min="1"
              max="168"
              value={settings.sessionTimeout}
              onChange={e =>
                setSettings(prev => ({
                  ...prev,
                  sessionTimeout: parseInt(e.target.value),
                }))
              }
              className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
            <Database className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">
              Data Management
            </h2>
            <p className="text-dark-400 text-sm">
              Configure data backup and retention policies
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-dark-800 rounded-lg">
            <div className="flex items-center space-x-3">
              <Database className="w-5 h-5 text-orange-500" />
              <div>
                <h3 className="text-white font-medium">Automatic Backup</h3>
                <p className="text-dark-400 text-sm">
                  Automatically backup data at regular intervals
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoBackup}
                onChange={e =>
                  setSettings(prev => ({
                    ...prev,
                    autoBackup: e.target.checked,
                  }))
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-dark-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white font-medium mb-2">
                Backup Frequency
              </label>
              <select
                value={settings.backupFrequency}
                onChange={e =>
                  setSettings(prev => ({
                    ...prev,
                    backupFrequency: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                Data Retention (days)
              </label>
              <input
                type="number"
                min="30"
                max="3650"
                value={settings.dataRetentionDays}
                onChange={e =>
                  setSettings(prev => ({
                    ...prev,
                    dataRetentionDays: parseInt(e.target.value),
                  }))
                }
                className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card border-red-500/20">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Danger Zone</h2>
            <p className="text-dark-400 text-sm">
              Irreversible and destructive actions
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-red-500/5 border border-red-500/20 rounded-lg">
            <div className="flex items-center space-x-3">
              <Trash2 className="w-5 h-5 text-red-500" />
              <div>
                <h3 className="text-white font-medium">Clear All Data</h3>
                <p className="text-dark-400 text-sm">
                  Permanently delete all subjects, chapters, MCQs, and user data
                </p>
              </div>
            </div>
            <button
              onClick={handleClearData}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Clear Data
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
            <div className="flex items-center space-x-3">
              <X className="w-5 h-5 text-yellow-500" />
              <div>
                <h3 className="text-white font-medium">Reset Settings</h3>
                <p className="text-dark-400 text-sm">
                  Reset all settings to their default values
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowResetModal(true)}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Reset Settings
            </button>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-900 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                <X className="w-5 h-5 text-yellow-500" />
              </div>
              <h3 className="text-xl font-semibold text-white">
                Reset Settings
              </h3>
            </div>

            <p className="text-dark-400 mb-6">
              Are you sure you want to reset all settings to their default
              values? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end space-x-4">
              <button
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 bg-dark-700 text-white rounded-lg hover:bg-dark-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
              >
                Reset Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
