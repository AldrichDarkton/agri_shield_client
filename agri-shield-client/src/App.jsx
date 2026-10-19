import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import LoginPage from './pages/auth/LoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserHomepage from './pages/user/UserHomepage';

// Global Components
import ChatbotSidebar from './components/ChatbotSidebar';

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Admin Flow */}
      {user?.role === 'admin' && (
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      )}

      {/* User Flow */}
      {user?.role === 'user' && (
        <Route path="/home" element={<UserHomepage />} />
      )}

      {/* Default / Fallback Route */}
      <Route
        path="*"
        element={
          user ? (
            <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/home'} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}

// Wrapper component to selectively show/hide the chatbot when logged in
function MainLayout() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-base-100 relative">
      <AppRoutes />
      
      {/* Show the chatbot globally whenever a user is logged in */}
      {user && <ChatbotSidebar />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <MainLayout />
      </BrowserRouter>
    </AuthProvider>
  );
}