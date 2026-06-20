import { Link } from 'react-router-dom';

const NotFound = () => (
  <div
    className="d-flex flex-column align-items-center justify-content-center"
    style={{ minHeight: '100vh', background: 'var(--ss-bg)', color: 'var(--ss-text-primary)' }}
  >
    <i className="bi bi-map" style={{ fontSize: '4rem', color: 'var(--ss-text-muted)' }} />
    <h1 className="fw-bold mt-3" style={{ fontSize: '4rem', lineHeight: 1 }}>404</h1>
    <p className="text-muted mb-4">Oops — page not found.</p>
    <Link to="/" className="btn btn-primary px-4 rounded-pill">
      <i className="bi bi-house me-2" />Go Home
    </Link>
  </div>
);

export default NotFound;
