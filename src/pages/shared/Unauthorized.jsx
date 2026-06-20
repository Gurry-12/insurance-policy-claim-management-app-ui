import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { ROLE_HOME } from '../../utils/roles';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center"
      style={{ minHeight: '100vh', background: 'var(--ss-bg)', color: 'var(--ss-text-primary)' }}
    >
      <i className="bi bi-shield-x" style={{ fontSize: '4rem', color: '#ef4444' }} />
      <h1 className="fw-bold mt-3">Access Denied</h1>
      <p className="text-muted mb-4">You don&apos;t have permission to view this page.</p>
      <button
        className="btn btn-primary px-4 rounded-pill"
        onClick={() => navigate(user ? (ROLE_HOME[user.role] ?? '/') : '/login')}
      >
        <i className="bi bi-arrow-left me-2" />
        Go to Dashboard
      </button>
    </div>
  );
};

export default Unauthorized;
