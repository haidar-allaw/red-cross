import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomeScreen from './pages/homeScreen';
import DonateBlood from './pages/donateBlood';
import HospitalMap from './components/HospitalMap';   // ① import it
import Header from './components/header';
import Footer from './components/footer';
import './index.css'

const App = () => {
  return (
    <div className="app-container">
      <Header />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/donate-blood" element={<DonateBlood />} />
          <Route path="/hospitals" element={<HospitalMap />} />  {/* ② new route */}
        </Routes>
      </main>
      <Footer />
    </div>
  )
};

export default App;
