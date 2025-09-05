import {
  BarChart3,
  BookOpen,
  Database,
  FileText,
  HelpCircle,
  Layers,
  LogOut,
  Menu,
  Package,
  Settings,
  User,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Debug logging
  console.log("Current location:", location.pathname);

  const navigation = [
    { name: "Dashboard", path: "/admin", icon: BarChart3 },
    { name: "Subjects", path: "/admin/subjects", icon: BookOpen },
    { name: "Chapters", path: "/admin/chapters", icon: Layers },
    { name: "Lessons", path: "/admin/lessons", icon: FileText },
    { name: "MCQs", path: "/admin/mcqs", icon: HelpCircle },
    { name: "Study Packs", path: "/admin/study-packs", icon: Package },
    { name: "Database", path: "/admin/database", icon: Database },
    { name: "Settings", path: "/admin/settings", icon: Settings },
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-black/50" />
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-dark-900 border-r border-dark-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-dark-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-purple rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">StudyPath</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-dark-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigation.map(item => {
              const Icon = item.icon;
              const isActive =
                location.pathname === item.path ||
                (item.path === "/admin" && location.pathname === "/admin") ||
                (item.path !== "/admin" &&
                  location.pathname.startsWith(item.path));
              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className={`group flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary-600 text-white shadow-lg"
                      : "text-dark-300 hover:bg-dark-800 hover:text-white"
                  }`}
                >
                  <Icon className="mr-3 w-5 h-5" />
                  {item.name}
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* User section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-dark-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-dark-700 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-dark-300" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.email || "Admin"}
              </p>
              <p className="text-xs text-dark-400">Administrator</p>
            </div>
            <button
              onClick={handleSignOut}
              className="text-dark-400 hover:text-white transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <div className="sticky top-0 z-30 bg-dark-900 border-b border-dark-800">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-dark-400 hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center space-x-4">
              <h1 className="text-lg font-semibold text-white">
                {(() => {
                  if (location.pathname === "/admin") return "Dashboard";
                  const currentNav = navigation.find(
                    item =>
                      item.path !== "/admin" &&
                      location.pathname.startsWith(item.path),
                  );
                  return currentNav ? currentNav.name : "Admin Dashboard";
                })()}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 text-sm text-dark-400">
                <span>Welcome back,</span>
                <span className="text-white font-medium">
                  {user?.email?.split("@")[0] || "Admin"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
