import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/header';
import Footer from './components/footer';

import HomeScreen from './pages/homeScreen';
import DonateBlood from './pages/donateBlood';
import HospitalWrapper from './components/HospitalWrapper';
import AboutPage from './pages/aboutpage';
import LoginPage from './pages/login';
import SignUpPage from './pages/signup';
import CenterDashboard from './pages/medical-center/centerdashboard';
import AdminLayout from './components/AdminLayout';
import AdminHomePage from './pages/admin/AdminHomePage';
import AdminUserManagement from './pages/admin/AdminUserManagement';
import AdminBloodDonationManagement from './pages/admin/AdminBloodDonationManagement';
import AdminCentersApproval from './pages/admin/AdminCentersApproval';
import RequestBloodPage from './pages/requestBlood';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminBloodRequests from './pages/admin/AdminBloodRequests';

export default function App() {
  return (
    <AuthProvider>
      <div className="app-container">
        <Header />
        <main className="app-main">
          <Routes>
            {/* Public section */}
            <Route path="/" element={<HomeScreen />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="hospitals" element={<HospitalWrapper />} />
            <Route path="donate-blood" element={<DonateBlood />} />

            {/* Protected section */}
            <Route
              path="/center"
              element={
                <ProtectedRoute role="center">
                  <CenterDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/request"
              element={
                <ProtectedRoute>
                  <RequestBloodPage />
                </ProtectedRoute>
              }
            />
            {/* Admin section */}
            <Route
              path="admin"
              element={
                <ProtectedRoute role="admin">
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminHomePage />} />
              <Route path="users" element={<ProtectedRoute role="admin"><AdminUserManagement /></ProtectedRoute>} />
              <Route
                path="blood-donations"
                element={<ProtectedRoute role="admin"><AdminBloodDonationManagement /></ProtectedRoute>}
              />
              <Route
                path="centers-approval"
                element={<ProtectedRoute role="admin"><AdminCentersApproval /></ProtectedRoute>}
              />
              <Route
                path="blood-requests"
                element={<ProtectedRoute role="admin"><AdminBloodRequests /></ProtectedRoute>}
              />
            </Route>

            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<SignUpPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
