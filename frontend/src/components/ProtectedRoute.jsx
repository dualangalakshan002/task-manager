import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/** Guards routes: redirects to /login when not authenticated. */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}
