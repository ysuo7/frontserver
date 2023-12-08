import React, { useContext, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isLoggedIn, isLoading, showNotification } = useContext(AuthContext);
    const location = useLocation();

    useEffect(() => {

        if (!isLoading & !isLoggedIn && location.pathname !== '/login') {
            showNotification('请登录以访问此页面', 'error');
        }
    }, [isLoggedIn, location, showNotification, isLoading]);



    if (!isLoggedIn & !isLoading) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
