import React from 'react';
import { Navigate } from 'react-router-dom';

const AuthGuard = ({ element: Component, requiredPermission }) => {
  const authToken = localStorage.getItem('authToken');
  const permissions = JSON.parse(localStorage.getItem('Permissions') || '[]');

  // Redirect to login if not authenticated
  if (!authToken) {
    return <Navigate to="/pages/Login" replace />;
  }

  // Check if user has the required permission
  if (requiredPermission && !permissions.some((p) => p.permission_name === requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Component />;
};

export default AuthGuard;
