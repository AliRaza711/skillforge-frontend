import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import type { UserRole } from '../types';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
  children?: React.ReactNode;
}

export function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || !user) {
    // If not authenticated, redirect to /login
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If authenticated but role not allowed, redirect to /unauthorized
    return <Navigate to="/unauthorized" replace />;
  }

  // If authenticated and role matches, render child components (or Outlet for nested routing)
  return children ? <>{children}</> : <Outlet />;
}
