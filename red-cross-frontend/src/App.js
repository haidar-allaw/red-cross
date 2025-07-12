import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/header";
import Footer from "./components/footer";

import HomeScreen from "./pages/homeScreen";
import DonateBlood from "./pages/donateBlood";
import HospitalMap from "./components/HospitalMap";
import AboutPage from "./pages/aboutpage";
import LoginPage from "./pages/login";
import SignUpPage from "./pages/signup";
import CenterDashboard from "./pages/medical-center/centerdashboard";
import AdminLayout from "./components/AdminLayout";
import AdminHomePage from "./pages/admin/AdminHomePage";
import AdminCentersApproval from "./pages/admin/AdminCentersApproval";
import RequestBloodPage from "./pages/requestBlood";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <AuthProvider>
      <div className="app-container">
        <Header />
        <main className="app-main">
          <Routes>
            {/* Admin section */}
            <Route path="admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index element={<AdminHomePage />} />
              {/* <Route path="users" element={<AdminUsers />} /> */}
              <Route path="centers-approval" element={<AdminCentersApproval />} />
            </Route>

            {/* Protected section */}
            <Route path="/" element={<ProtectedRoute><HomeScreen /></ProtectedRoute>} />
            <Route path="donate-blood" element={<ProtectedRoute><DonateBlood /></ProtectedRoute>} />
            <Route path="hospitals" element={<ProtectedRoute><HospitalMap /></ProtectedRoute>} />
            <Route path="about" element={<ProtectedRoute><AboutPage /></ProtectedRoute>} />
            <Route path="/center" element={<ProtectedRoute><CenterDashboard /></ProtectedRoute>} />
            <Route path="/request" element={<ProtectedRoute><RequestBloodPage /></ProtectedRoute>} />

            {/* Public section */}
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<SignUpPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
