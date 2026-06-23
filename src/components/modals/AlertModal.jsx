
const AlertModal = ({ isOpen, title, message, onClose, type = 'info' }) => {
  if (!isOpen) return null;

  const typeConfig = {
    info: { icon: 'bi-info-circle', color: 'text-primary' },
    success: { icon: 'bi-check-circle', color: 'text-success' },
    warning: { icon: 'bi-exclamation-triangle', color: 'text-warning' },
    error: { icon: 'bi-x-circle', color: 'text-danger' }
  };

  const config = typeConfig[type] || typeConfig.info;

  return (
    <>
      <div className="modal-backdrop fade show" style={{ zIndex: 1040 }}></div>
      <div className="modal fade show d-block" tabIndex="-1" style={{ zIndex: 1050 }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content" style={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--ss-shadow-lg)' }}>
            <div className="modal-header border-0 pb-0">
              <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
            </div>
            <div className="modal-body text-center pb-4 pt-0">
              <i className={`bi ${config.icon} ${config.color} mb-3`} style={{ fontSize: '3rem' }}></i>
              <h5 className="modal-title mb-2" style={{ fontWeight: 700 }}>{title}</h5>
              <p className="text-muted mb-4">{message}</p>
              <button type="button" className="btn btn-primary px-4 py-2" style={{ borderRadius: '8px' }} onClick={onClose}>
                Okay
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AlertModal;
