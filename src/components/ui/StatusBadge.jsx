/**
 * StatusBadge — pill badge for policy/claim/payment status values.
 *
 * Props:
 *  status — one of the known status strings (see map below)
 */
const STATUS_MAP = {
  // Claims
  PENDING:      { label: 'Pending',     bg: '#fef9c3', color: '#a16207' },
  UNDER_REVIEW: { label: 'In Review',   bg: '#dbeafe', color: '#1d4ed8' },
  APPROVED:     { label: 'Approved',    bg: '#dcfce7', color: '#16a34a' },
  REJECTED:     { label: 'Rejected',    bg: '#fee2e2', color: '#dc2626' },
  // Policies
  ACTIVE:           { label: 'Active',          bg: '#dcfce7', color: '#16a34a' },
  EXPIRED:          { label: 'Expired',         bg: '#f1f5f9', color: '#64748b' },
  CANCELLED:        { label: 'Cancelled',       bg: '#fee2e2', color: '#dc2626' },
  PENDING_PAYMENT:  { label: 'Pending Payment', bg: '#fef9c3', color: '#a16207' },
  // Payments
  SUCCESS:      { label: 'Success',     bg: '#dcfce7', color: '#16a34a' },
  FAILED:       { label: 'Failed',      bg: '#fee2e2', color: '#dc2626' },
  REFUNDED:     { label: 'Refunded',    bg: '#f3e8ff', color: '#7c3aed' },
};

const StatusBadge = ({ status }) => {
  const s = STATUS_MAP[status] ?? { label: status ?? '—', bg: '#f1f5f9', color: '#64748b' };
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
