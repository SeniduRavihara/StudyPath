import React from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import AdminLayout from "./components/AdminLayout";
import Dashboard from "./components/Dashboard";
import DatabaseOverview from "./components/DatabaseOverview";
import Login from "./components/Login";
import MCQManager from "./components/MCQManager";
import Settings from "./components/Settings";
import StudyPackManager from "./components/StudyPackManager";
import SubjectManager from "./components/SubjectManager";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import "./index.css";

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Admin Routes Component
const AdminRoutes: React.FC = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/subjects" element={<SubjectManager />} />
        <Route
          path="/chapters"
          element={
            <div className="text-white text-center py-20">
              Chapters Management - Coming Soon
            </div>
          }
        />
        <Route
          path="/lessons"
          element={
            <div className="text-white text-center py-20">
              Lessons Management - Coming Soon
            </div>
          }
        />
        <Route path="/mcqs" element={<MCQManager />} />
        <Route path="/study-packs" element={<StudyPackManager />} />
        <Route path="/database" element={<DatabaseOverview />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AdminLayout>
  );
};

// Main App Component
const AppContent: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/admin" replace /> : <Login />}
        />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminRoutes />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
