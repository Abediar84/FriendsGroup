import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PromotionEngine from './pages/PromotionEngine';
import SpaMenu from './pages/SpaMenu';
import Roadmap from './pages/Roadmap';
import NotFound from './pages/NotFound';

import CustomCursor from './components/CustomCursor';
import './styles/global.css';

function App() {
  return (
    <div className="app-root">
      <CustomCursor />
      <div className="noise-overlay"></div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/promotions" element={<PromotionEngine />} />
        <Route path="/menu" element={<SpaMenu />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
