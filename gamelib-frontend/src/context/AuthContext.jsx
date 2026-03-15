import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await api.get('/auth/me');
                    setUser(res.data);
                } catch (error) {
                    console.error('Failed to restore session', error);
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        const { access_token } = res.data;
        localStorage.setItem('token', access_token);

        // Fetch the user information immediately after login
        const userRes = await api.get('/auth/me');
        setUser(userRes.data);
    };

    const register = async (email, password) => {
        await api.post('/auth/register', { email, password });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const googleLogin = async (credential) => {
        const res = await api.post('/auth/google', { credential });
        const { access_token } = res.data;
        localStorage.setItem('token', access_token);

        const userRes = await api.get('/auth/me');
        setUser(userRes.data);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, googleLogin, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
