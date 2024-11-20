import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, userType }) {
    const currentUserType = localStorage.getItem('userType');
    if (currentUserType !== userType) {
        return <Navigate to="/login" />;
    }
    return children;
}

export default ProtectedRoute;
