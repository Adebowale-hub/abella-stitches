import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const data = await adminAPI.getMe();
            setAdmin(data);
        } catch (error) {
            setAdmin(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const data = await adminAPI.login(email, password);
        setAdmin(data);
        return data;
    };

    const logout = async () => {
        await adminAPI.logout();
        setAdmin(null);
    };

    const value = {
        admin,
        loading,
        login,
        logout,
        checkAuth
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Protected Route Component
export const ProtectedRoute = ({ children }) => {
    const { admin, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !admin) {
            navigate('/admin/login');
        }
    }, [admin, loading, navigate]);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    return admin ? children : null;
};
