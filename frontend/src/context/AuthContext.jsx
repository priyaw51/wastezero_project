import React, { createContext, useState, useEffect, useContext } from 'react';
import AuthService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initial check for existing token (optional, simple logic for now)
    useEffect(() => {
        const checkAuth = async () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (credentials) => {
        // Updated logic: Login returns OTP or Token. Wait, our login returns OTP first.
        // So this might just initiate the process.
        try {
            const data = await AuthService.login(credentials);
            // Don't set user yet if OTP is required. Just return data.
            return data;
        } catch (error) {
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            const data = await AuthService.register(userData);
            return data;
        } catch (error) {
            throw error;
        }
    };

    const verifyOtp = async (otpData) => {
        try {
            const data = await AuthService.verifyOtp(otpData);
            // Now we have the comprehensive user data and token
            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                setUser(data.user);
            }
            return data;
        } catch (error) {
            throw error;
        }
    }

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        // window.location.href = '/login'; // Or use useNavigate() in components
    };

    const value = {
        user,
        setUser, // Expose setUser for updates like profile changes
        loading,
        login,
        register,
        verifyOtp,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
