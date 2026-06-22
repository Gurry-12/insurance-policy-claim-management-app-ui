/**
 * EmptyState — centred empty placeholder for lists and tables.
 *
 * Props:
 *  icon    — bootstrap-icons class (default: 'bi-inbox')
 *  message — text to display (default: 'No data found')
 */
const EmptyState = ({ icon = 'bi-inbox', message = 'No data found' }) => (
  <div className="text-center py-5" style={{ color: 'var(--ss-text-muted)', fontSize: '0.875rem' }}>
    <i className={`bi ${icon} d-block mb-2`} style={{ fontSize: '2.25rem', opacity: 0.4 }} />
    {message}
  </div>
);

export default EmptyState;
