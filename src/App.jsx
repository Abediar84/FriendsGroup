import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PromotionEngine from './pages/PromotionEngine';
import SpaMenu from './pages/SpaMenu';
import Roadmap from './pages/Roadmap';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/promotions" element={<PromotionEngine />} />
      <Route path="/menu" element={<SpaMenu />} />
      <Route path="/roadmap" element={<Roadmap />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
