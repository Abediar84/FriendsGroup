import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PromotionEngine from './pages/PromotionEngine';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/promotions" element={<PromotionEngine />} />
    </Routes>
  );
}

export default App;
