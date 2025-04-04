import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = 'application/json';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

  // Centralized error handler
  const handleError = (error, defaultMessage) => {
    console.error(error);
    const message = error.response?.data?.message || defaultMessage;
    toast.error(message);
    return { success: false, message };
  };

  // Fetch user data
  const fetchUser = useCallback(async (token) => {
    try {
      const response = await axios.get(`${backendUrl}/api/users/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setUser(response.data);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
      }
      return false;
    }
  }, [backendUrl]);

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        await fetchUser(token);
      }
      setIsLoading(false);
    };

    // Set up response interceptor
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          logout();
          toast.error('Session expired. Please login again.');
        }
        return Promise.reject(error);
      }
    );

    initializeAuth();

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [fetchUser]);

  const login = async (email, password, secretKey = null) => {
    try {
      const response = await axios.post(`${backendUrl}/api/auth/login`, {
        email,
        password,
        secretKey
      });

      if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        const userLoaded = await fetchUser(response.data.token);
        if (!userLoaded) {
          return handleError(new Error('Failed to load user'), 'Login failed');
        }

        navigate(response.data.redirect || '/');
        toast.success('Login successful');
        return { success: true };
      }
      return handleError(new Error('No token received'), 'Login failed');
    } catch (error) {
      return handleError(error, 'Login failed');
    }
  };

  const register = async (email, password, secretKey = null) => {
    try {
      const response = await axios.post(`${backendUrl}/api/auth/register`, {
        email,
        password,
        secretKey
      });

      if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        const userLoaded = await fetchUser(response.data.token);
        if (!userLoaded) {
          return handleError(new Error('Failed to load user'), 'Registration failed');
        }

        navigate(response.data.redirect || '/');
        toast.success('Registration successful');
        return { success: true };
      }
      return handleError(new Error('No token received'), 'Registration failed');
    } catch (error) {
      return handleError(error, 'Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
    toast.info('You have been logged out');
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    fetchUser // Expose fetchUser for manual refreshes
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};