import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomeScreen from './pages/homeScreen';
import DonateBlood from './pages/donateBlood';

const App = () => {
  return (
    <>
      <main style={{ padding: '1rem' }}>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/donate-blood" element={<DonateBlood />} />

        </Routes>
      </main>
    </>)
};

export default App;
