import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomeScreen from './pages/homeScreen';
import DonateBlood from './pages/donateBlood';
import HospitalMap from './components/HospitalMap';   // ① import it
import Header from './components/header';
import Footer from './components/footer';
import AboutPage from './pages/aboutpage';
import './index.css'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import LoginPage from './pages/login';
import SignUpPage from './pages/signup';

const App = () => {
  return (
    <div className="app-container">
      <Header />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/donate-blood" element={<DonateBlood />} />
          <Route path="/hospitals" element={<HospitalMap />} />  
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<SignUpPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
};

export default App;
