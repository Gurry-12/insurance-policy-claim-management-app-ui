/**
 * LoadingSpinner — centred spinner for page-level loading states.
 *
 * Props:
 *  text — optional label below the spinner (default: 'Loading…')
 */
const LoadingSpinner = ({ text = 'Loading…' }) => (
  <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-3">
    <div
      className="spinner-border"
      role="status"
      style={{ width: '2.25rem', height: '2.25rem', color: '#f05a28', borderWidth: 3 }}
    >
      <span className="visually-hidden">Loading…</span>
    </div>
    {text && (
      <span style={{ fontSize: '0.85rem', color: 'var(--ss-text-muted)' }}>{text}</span>
    )}
  </div>
);

export default LoadingSpinner;
