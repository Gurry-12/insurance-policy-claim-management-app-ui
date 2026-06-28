import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';

const GlobalApiHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
      if (location.pathname !== '/login') {
        toast.error('Session expired. Please log in again.');
        navigate('/login', { state: { from: location }, replace: true });
      }
    };

    const handleForbidden = () => {
      navigate('/unauthorized', { replace: true });
    };

    const handleApiError = (event) => {
      const message = event.detail || 'A network error occurred.';
      if (message !== 'canceled') {
        toast.error(`Error: ${message}`);
      }
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    window.addEventListener('auth:forbidden', handleForbidden);
    window.addEventListener('api:error', handleApiError);

    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
      window.removeEventListener('auth:forbidden', handleForbidden);
      window.removeEventListener('api:error', handleApiError);
    };
  }, [navigate, location, logout]);

  return null;
};

export default GlobalApiHandler;
