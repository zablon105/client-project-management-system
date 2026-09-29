import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './layouts/AppLayout';
import Login from './pages/Login';
import Overview from './pages/Overview';
import ProjectDetail from './pages/ProjectDetail';
import ServicesCatalog from './pages/ServicesCatalog';
import StaffTaskBoard from './pages/StaffTaskBoard';
import ClientPortal from './pages/ClientPortal';
import InvoicesBilling from './pages/InvoicesBilling';
import ReportsDeliverables from './pages/ReportsDeliverables';
import NotificationsCenter from './pages/NotificationsCenter';
import UserSettings from './pages/UserSettings';
import ClientTalentManagement from './pages/ClientTalentManagement';
import SharedReport from './pages/SharedReport';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/shared-reports/:token" element={<SharedReport />} />
            
            {/* Main Workspace App Shell wrapped in ProtectedRoute */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/" element={<Navigate to="/overview" replace />} />
                <Route path="/overview" element={<Overview />} />
                <Route path="/projects" element={<Navigate to="/overview" replace />} />
                <Route path="/projects/:id" element={<ProjectDetail />} />
                <Route path="/services" element={<ServicesCatalog />} />
                <Route path="/tasks" element={<StaffTaskBoard />} />
                <Route path="/portal" element={<ClientPortal />} />
                <Route path="/invoices" element={<InvoicesBilling />} />
                <Route path="/reports" element={<ReportsDeliverables />} />
                <Route path="/notifications" element={<NotificationsCenter />} />
                <Route path="/settings" element={<UserSettings />} />
                <Route path="/talent" element={<ClientTalentManagement />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/overview" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
