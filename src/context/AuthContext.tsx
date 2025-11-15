import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Define the shape of your user and auth context
interface User {
  id: string;
  firstName: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('cryopay_token'));
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start with loading true
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('cryopay_token');
    if (storedToken) {
      // In a real app, you'd verify this token with a backend endpoint.
      // For now, we'll decode it (this is insecure, but fine for a demo).
      try {
        const decoded = JSON.parse(atob(storedToken.split('.')[1]));
        // A real JWT would have user data. We'll simulate it for now.
        setUser({ id: decoded.userId, firstName: 'User' }); 
      } catch (e) {
        console.error("Failed to decode token", e);
        localStorage.removeItem('cryopay_token');
        setToken(null);
      }
    }
    setIsLoading(false); // Finished initial check
  }, []);

  const login = (newToken: string, userData: User) => {
    localStorage.setItem('cryopay_token', newToken);
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('cryopay_token');
    setToken(null);
    setUser(null);
    navigate('/login'); // Redirect to login on logout
  };

  const value = { token, user, login, logout, isLoading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

