import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ roles }) => {
    const { user, loading } = useAuth();

    if (loading) {
        // You can return a loading spinner here
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (!user) {
        // Not logged in, redirect to login
        return <Navigate to="/" replace />;
    }

    if (roles && !roles.includes(user.role)) {
        // Role not authorized, redirect to unauthorized page or dashboard
        // For now, redirect to dashboard which handles role-based content or just show alert
        // A better approach is usually to redirect to a "403 Unauthorized" page
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
