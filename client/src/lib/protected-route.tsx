import React from 'react';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  path?: string;
  component?: React.ComponentType<any>;
  requiredRole?: string;
  requireAuth?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  component: Component,
  requireAuth = true 
}) => {
  if (Component) {
    return <Component />;
  }
  return <>{children || null}</>;
};
