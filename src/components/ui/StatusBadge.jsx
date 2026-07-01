const STATUS_MAP = {
  PENDING:      { label: 'Pending',     bg: 'var(--ip-claim-submitted-bg)', color: 'var(--ip-claim-submitted)' },
  UNDER_REVIEW: { label: 'In Review',   bg: 'var(--ip-claim-under-review-bg)', color: 'var(--ip-claim-under-review)' },
  APPROVED:     { label: 'Approved',    bg: 'var(--ip-claim-approved-bg)', color: 'var(--ip-claim-approved)' },
  REJECTED:     { label: 'Rejected',    bg: 'var(--ip-claim-rejected-bg)', color: 'var(--ip-claim-rejected)' },
  RECOMMENDED_FOR_APPROVAL: { label: 'Recommended For Approval', bg: 'var(--ip-claim-rec-approval-bg)', color: 'var(--ip-claim-rec-approval)'},
  RECOMMENDED_FOR_REJECTION: { label: 'Recommended For Rejection', bg: 'var(--ip-claim-rec-rejection-bg)', color: 'var(--ip-claim-rec-rejection)'},
  ACTIVE:           { label: 'Active',          bg: 'var(--ip-policy-active-bg)', color: 'var(--ip-policy-active)' },
  EXPIRED:          { label: 'Expired',         bg: 'var(--ip-policy-expired-bg)', color: 'var(--ip-policy-expired)' },
  CANCELLED:        { label: 'Cancelled',       bg: 'var(--ip-policy-cancelled-bg)', color: 'var(--ip-policy-cancelled)' },
  PENDING_PAYMENT:  { label: 'Pending Payment', bg: 'var(--ip-policy-pending-bg)', color: 'var(--ip-policy-pending)' },
  SUCCESS:      { label: 'Success',     bg: 'var(--ip-payment-success-bg)', color: 'var(--ip-payment-success)' },
  FAILED:       { label: 'Failed',      bg: 'var(--ip-payment-failed-bg)', color: 'var(--ip-payment-failed)' },
  REFUNDED:     { label: 'Refunded',    bg: 'var(--ip-payment-success-bg)', color: 'var(--ip-payment-success)' },
};

const StatusBadge = ({ status }) => {
  const s = STATUS_MAP[status] ?? { label: status ?? '\u2014', bg: '#f1f5f9', color: '#64748b' };
  return (
    <span
      style={{
        background: s.bg, color: s.color,
        fontSize: '0.7rem', fontWeight: 600,
        padding: '2px 10px', borderRadius: 20,
        whiteSpace: 'nowrap',
      }}
    >
      {s.label}
    </span>
  );
};

export default StatusBadge;
