import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null); // { id, role, ... }
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // On mount, check for token and decode user info
        const token = localStorage.getItem('authToken');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUser({ id: payload.id, role: payload.role });
            } catch {
                setUser(null);
            }
        }
        setLoading(false);
    }, []);

    const login = (token) => {
        localStorage.setItem('authToken', token);
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ id: payload.id, role: payload.role });
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
} 