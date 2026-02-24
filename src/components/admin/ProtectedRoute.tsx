import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminStore } from '../../store/useAdminStore';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const hasAuth = useAdminStore((state) => state.hasAuth());

  if (!hasAuth) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
