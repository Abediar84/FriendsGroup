import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingScreen from './components/LoadingScreen';
import CustomCursor from './components/CustomCursor';
import { ThemeProvider } from './hooks/useTheme';
import './styles/global.css';

// Lazy load non-critical routes for smaller initial bundle
const PromotionEngine = lazy(() => import('./pages/PromotionEngine'));
const SpaMenu = lazy(() => import('./pages/SpaMenu'));
const Roadmap = lazy(() => import('./pages/Roadmap'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <div className="app-root">
        <CustomCursor />
        <div className="noise-overlay"></div>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/promotions" element={<PromotionEngine />} />
            <Route path="/menu" element={<SpaMenu />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
