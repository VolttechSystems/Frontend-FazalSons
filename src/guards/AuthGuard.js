import React from 'react'
import { Navigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const AuthGuard = ({ element: Component, requiredPermission }) => {
  const { token, systemRoles } = useAuth()

  // Redirect to login if not authenticated
  if (!token) {
    return <Navigate to="/pages/Login" replace />
  }

  // Check if user has the required permission
  if (
    requiredPermission &&
    !systemRoles.length > 0 &&
    systemRoles[0].permissions.some((p) => p.permission_name === requiredPermission)
  ) {
    return <Navigate to="/unauthorized" replace />
  }

  return <Component />
}

export default AuthGuard
