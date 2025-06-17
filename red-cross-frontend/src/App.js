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

import AdminLayout from "./components/AdminLayout";
import AdminHomePage from "./pages/admin/AdminHomePage";
import AdminCentersApproval from "./pages/admin/AdminCentersApproval";

export default function App() {
  return (
    <div className="app-container">
      <Header />
      <main className="app-main">
        <Routes>
          {/* Admin section */}
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<AdminHomePage />} />
            <Route path="centers-approval" element={<AdminCentersApproval />} />
          </Route>

          {/* Public section */}
          <Route path="/" element={<HomeScreen />} />
          <Route path="donate-blood" element={<DonateBlood />} />
          <Route path="hospitals" element={<HospitalMap />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<SignUpPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
