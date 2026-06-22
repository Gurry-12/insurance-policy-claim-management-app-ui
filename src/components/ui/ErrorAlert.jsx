/**
 * ErrorAlert — inline error banner.
 *
 * Props:
 *  message — error string to display
 */
const ErrorAlert = ({ message }) => {
  if (!message) return null;
  return (
    <div
      className="d-flex align-items-center gap-2 mb-4"
      style={{
        background: '#fff1f2', border: '1px solid #ffe4e6',
        borderRadius: 12, padding: '0.7rem 1rem',
        color: '#9f1239', fontSize: '0.85rem',
      }}
      role="alert"
    >
      <i className="bi bi-exclamation-circle-fill text-danger" />
      {message}
    </div>
  );
};

export default ErrorAlert;
