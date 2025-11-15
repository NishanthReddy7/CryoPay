import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import OnboardingScreen from './pages/Onboarding';
import SignUpCustodial from './pages/SignUpCustodial';
import SignUpNonCustodial from './pages/SignUpNonCustodial';
import LoginScreen from './pages/LoginScreen';
import ForgotPasswordScreen from './pages/ForgotPasswordScreen';
import SecureWalletScreen from './pages/SecureWalletScreen';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/onboarding" element={<OnboardingScreen />} />
      <Route path="/signup-custodial" element={<SignUpCustodial />} />
      <Route path="/signup-non-custodial" element={<SignUpNonCustodial />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
      
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/secure-wallet" element={<SecureWalletScreen />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
}

export default App;

