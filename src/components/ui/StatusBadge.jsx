const STATUS_MAP = {
  PENDING:      { label: 'Pending',     bg: 'var(--ip-claim-submitted-bg)', color: 'var(--ip-claim-submitted)' },
  SUBMITTED:    { label: 'Pending',     bg: 'var(--ip-claim-submitted-bg)', color: 'var(--ip-claim-submitted)' },
  UNDER_REVIEW: { label: 'In Review',   bg: 'var(--ip-claim-under-review-bg)', color: 'var(--ip-claim-under-review)' },
  APPROVED:     { label: 'Approved',    bg: 'var(--ip-claim-approved-bg)', color: 'var(--ip-claim-approved)' },
  REJECTED:     { label: 'Rejected',    bg: 'var(--ip-claim-rejected-bg)', color: 'var(--ip-claim-rejected)' },
  RECOMMENDED_FOR_APPROVAL: { label: 'Rec. Approval', bg: 'var(--ip-claim-rec-approval-bg)', color: 'var(--ip-claim-rec-approval)'},
  RECOMMENDED_FOR_REJECTION: { label: 'Rec. Rejection', bg: 'var(--ip-claim-rec-rejection-bg)', color: 'var(--ip-claim-rec-rejection)'},
  ACTIVE:           { label: 'Active',          bg: 'var(--ip-policy-active-bg)', color: 'var(--ip-policy-active)' },
  EXPIRED:          { label: 'Expired',         bg: 'var(--ip-policy-expired-bg)', color: 'var(--ip-policy-expired)' },
  CANCELLED:        { label: 'Cancelled',       bg: 'var(--ip-policy-cancelled-bg)', color: 'var(--ip-policy-cancelled)' },
  PENDING_PAYMENT:  { label: 'Pending Payment', bg: 'var(--ip-policy-pending-bg)', color: 'var(--ip-policy-pending)' },
  SUCCESS:      { label: 'Success',     bg: 'var(--ip-payment-success-bg)', color: 'var(--ip-payment-success)' },
  FAILED:       { label: 'Failed',      bg: 'var(--ip-payment-failed-bg)', color: 'var(--ip-payment-failed)' },
  REFUNDED:     { label: 'Refunded',    bg: 'var(--ip-payment-success-bg)', color: 'var(--ip-payment-success)' },
};

const StatusBadge = ({ status, icon, className = '' }) => {
  const s = STATUS_MAP[status] ?? { label: status ?? '\u2014', bg: '#f1f5f9', color: '#64748b' };
  return (
    <span className={`badge badge-soft ${className}`} style={{ color: s.color }}>
      <span className="d-flex align-items-center gap-1">
        {icon}
        {s.label}
      </span>
    </span>
  );
};

export default StatusBadge;
