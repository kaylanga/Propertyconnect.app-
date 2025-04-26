import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

type UserRole = 'client' | 'landlord' | 'broker' | 'admin';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
  roles?: UserRole[];
}

export function ProtectedRoute({ children, adminOnly = false, roles = [] }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
} 