import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Forbidden from '../pages/Forbidden';

export default function ProtectedRoute({ children, role }) {
    const { user, loading } = useAuth();
    if (loading) return null;
    if (!user) return <Navigate to="/login" replace />;
    if (role && user.role !== role) return <Forbidden />;
    return children;
} 