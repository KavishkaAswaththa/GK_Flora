import { createContext, useEffect, useState, useCallback, useContext } from "react";
import { toast } from "react-toastify";
import axios from 'axios';

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = 'application/json';

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const backendUrl = "http://localhost:8080"; 
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Handle logout logic
    const handleLogout = useCallback(() => {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setIsLoggedIn(false);
        setUserData(null);
        toast.info('You have been logged out');
    }, []);

    // Fetch user data
    const getUserData = useCallback(async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/users/me`);
            setUserData(response.data);
            setIsLoggedIn(true);
            return response.data;
        } catch (error) {
            console.error('User data fetch error:', error);
            setUserData(null);
            if (error.response?.status === 401) {
                handleLogout();
            }
            throw error;
        }
    }, [backendUrl, handleLogout]);

    // Validate auth state
    const getAuthState = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                handleLogout();
                return;
            }

            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            await getUserData();
        } catch (error) {
            console.error('Auth validation error:', error);
            handleLogout();
        } finally {
            setIsLoading(false);
        }
    }, [getUserData, handleLogout]);

    // Initialize auth and set up interceptors
    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    handleLogout();
                    toast.error('Session expired. Please login again.');
                }
                return Promise.reject(error);
            }
        );

        getAuthState();

        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, [getAuthState, handleLogout]);

    // Provide context value
    const value = {
        backendUrl,
        isLoggedIn,
        setIsLoggedIn,
        userData,
        getUserData,
        isLoading,
        handleLogout
    };

    return (
        <AppContext.Provider value={value}>
            {!isLoading && children}
        </AppContext.Provider>
    );
};

// Custom hook for easier consumption
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppContextProvider');
    }
    return context;
};