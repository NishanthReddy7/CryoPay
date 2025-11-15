const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';

// API endpoints
const apiEndpoints = {
  signupCustodial: `${API_BASE_URL}/api/auth/signup-custodial`,
  loginCustodial: `${API_BASE_URL}/api/auth/login-custodial`,
  generate2fa: `${API_BASE_URL}/api/auth/generate-2fa`,
  verify2fa: `${API_BASE_URL}/api/auth/verify-2fa`,
  sendEmailOtp: `${API_BASE_URL}/api/auth/send-email-otp`,
  verifyEmailOtp: `${API_BASE_URL}/api/auth/verify-email-otp`,
  getProfile: `${API_BASE_URL}/api/auth/profile`,
};

export default apiEndpoints;