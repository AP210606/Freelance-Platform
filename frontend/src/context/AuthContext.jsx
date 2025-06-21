import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Create the Auth Context
const AuthContext = createContext();

// Create the Auth Provider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token')); // Get token from localStorage
    const [loading, setLoading] = useState(true); // To indicate if auth state is being loaded

    const API_URL = 'http://localhost:5000/api/users'; // Your backend API base URL for user auth

    // Effect to set Axios default header for token and load user if token exists
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            fetchCurrentUser();
        } else {
            delete axios.defaults.headers.common['Authorization'];
            setLoading(false); // No token, no user, loading complete
        }
    }, [token]); // Re-run if token changes

    // Function to fetch current user's details (e.g., after token is set or on app load)
    const fetchCurrentUser = async () => {
        try {
            // This is a placeholder; in a real app, you'd have a /api/users/me endpoint
            // For now, we rely on the token content which has user ID
            // Or you can decode JWT here to get basic user info without another API call.
            // For simplicity, we'll assume the login/register response is enough,
            // or we'll add a /me endpoint in backend later if needed.
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch current user:', error);
            logout(); // If token is invalid, log out
            setLoading(false);
        }
    };

    // Login function
    const login = async (email, password) => {
        try {
            const response = await axios.post(`${API_URL}/login`, { email, password });
            const { user, token } = response.data;
            setUser(user);
            setToken(token);
            localStorage.setItem('token', token); // Store token in localStorage
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            return response.data; // Return data for component to handle success
        } catch (error) {
            console.error('Login failed:', error.response ? error.response.data : error.message);
            throw error; // Re-throw for component to handle errors
        }
    };

    // Register function
    const register = async (name, email, password, role) => {
        try {
            const response = await axios.post(`${API_URL}/register`, { name, email, password, role });
            const { user, token } = response.data;
            setUser(user);
            setToken(token);
            localStorage.setItem('token', token); // Store token in localStorage
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            return response.data; // Return data for component to handle success
        } catch (error) {
            console.error('Registration failed:', error.response ? error.response.data : error.message);
            throw error;
        }
    };

    // Logout function
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token'); // Remove token from localStorage
        delete axios.defaults.headers.common['Authorization']; // Remove auth header
        window.location.href = '/login'; // Redirect to login page after logout
    };

    // Provide the context values to children components
    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
    return useContext(AuthContext);
};