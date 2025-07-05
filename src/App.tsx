import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import SaasOwnerDashboard from './pages/SaasOwnerDashboard';
import OrganizationDashboard from './pages/OrganizationDashboard';
import SaasOwnerLayout from './layouts/SaasOwnerLayout';
import OrganizationLayout from './layouts/OrganizationLayout';
import SaasAnalytics from './pages/SaasAnalytics';
import TenantManagement from './pages/TenantManagement';
import OrgAnalytics from './pages/OrgAnalytics';
import Configuration from './pages/Configuration';
import KnowledgeBase from './pages/KnowledgeBase';
import AppointmentSettings from './pages/AppointmentSettings';

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* SaaS Owner Routes */}
      <Route path="/saas" element={
        <ProtectedRoute allowedRoles={['saas_owner']}>
          <SaasOwnerLayout />
        </ProtectedRoute>
      }>
        <Route index element={<SaasOwnerDashboard />} />
        <Route path="analytics" element={<SaasAnalytics />} />
        <Route path="tenants" element={<TenantManagement />} />
      </Route>

      {/* Organization Routes */}
      <Route path="/org" element={
        <ProtectedRoute allowedRoles={['org_admin', 'org_manager', 'org_support']}>
          <OrganizationLayout />
        </ProtectedRoute>
      }>
        <Route index element={<OrganizationDashboard />} />
        <Route path="analytics" element={<OrgAnalytics />} />
        <Route path="configuration" element={<Configuration />} />
        <Route path="knowledge-base" element={<KnowledgeBase />} />
        <Route path="appointments" element={<AppointmentSettings />} />
      </Route>

      {/* Default redirects */}
      <Route path="/" element={
        user ? (
          user.role === 'saas_owner' ? <Navigate to="/saas" replace /> : <Navigate to="/org" replace />
        ) : (
          <Navigate to="/login" replace />
        )
      } />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;