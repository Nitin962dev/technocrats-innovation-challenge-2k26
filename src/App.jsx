import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Contexts
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';

// Layouts
import AppLayout from './layouts/AppLayout';

// Pages
import Dashboard from './pages/Dashboard';
import SafeRoute from './pages/SafeRoute';
import FakeCall from './pages/FakeCall';
import Evidence from './pages/Evidence';
import Timer from './pages/Timer';
import Login from './pages/Login';
import DigiLocker from './pages/DigiLocker';
import GuardiansSetup from './pages/GuardiansSetup';
import LiveSession from './pages/LiveSession';
import FeaturesMenu from './pages/FeaturesMenu'; // Added generic features grid import
import NearbyPolice from './pages/NearbyPolice'; // Added nearby police

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="menu" element={<FeaturesMenu />} />
          <Route path="map" element={<SafeRoute />} />
          <Route path="fake-call" element={<FakeCall />} />
          <Route path="evidence" element={<Evidence />} />
          <Route path="timer" element={<Timer />} />
          <Route path="digilocker" element={<DigiLocker />} />
          <Route path="police" element={<NearbyPolice />} />
        </Route>
        
        <Route path="/guardians" element={<ProtectedRoute><GuardiansSetup /></ProtectedRoute>} />
        <Route path="/live-session" element={<ProtectedRoute><LiveSession /></ProtectedRoute>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <AnimatedRoutes />
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
