import { CheckCircle, Clock, XCircle, AlertTriangle, AlertCircle, RefreshCw, HelpCircle } from "lucide-react";

const STATUS_MAP = {
  PENDING:      { label: 'PENDING',     bg: 'var(--ip-claim-submitted-bg)', color: 'var(--ip-claim-submitted)', icon: Clock },
  SUBMITTED:    { label: 'SUBMITTED',   bg: 'var(--ip-claim-submitted-bg)', color: 'var(--ip-claim-submitted)', icon: Clock },
  UNDER_REVIEW: { label: 'UNDER_REVIEW',   bg: 'var(--ip-claim-under-review-bg)', color: 'var(--ip-claim-under-review)', icon: AlertTriangle },
  APPROVED:     { label: 'APPROVED',    bg: 'var(--ip-claim-approved-bg)', color: 'var(--ip-claim-approved)', icon: CheckCircle },
  REJECTED:     { label: 'REJECTED',    bg: 'var(--ip-claim-rejected-bg)', color: 'var(--ip-claim-rejected)', icon: XCircle },
  RECOMMENDED_FOR_APPROVAL: { label: 'RECOMMENDED_FOR_APPROVAL', bg: 'var(--ip-claim-rec-approval-bg)', color: 'var(--ip-claim-rec-approval)', icon: CheckCircle },
  RECOMMENDED_FOR_REJECTION: { label: 'RECOMMENDED_FOR_REJECTION', bg: 'var(--ip-claim-rec-rejection-bg)', color: 'var(--ip-claim-rec-rejection)', icon: XCircle },
  ACTIVE:           { label: 'Active',          bg: 'var(--ip-policy-active-bg)', color: 'var(--ip-policy-active)', icon: CheckCircle },
  EXPIRED:          { label: 'Expired',         bg: 'var(--ip-policy-expired-bg)', color: 'var(--ip-policy-expired)', icon: Clock },
  CANCELLED:        { label: 'Cancelled',       bg: 'var(--ip-policy-cancelled-bg)', color: 'var(--ip-policy-cancelled)', icon: XCircle },
  PENDING_PAYMENT:  { label: 'Pending Payment', bg: 'var(--ip-policy-pending-bg)', color: 'var(--ip-policy-pending)', icon: AlertCircle },
  SUCCESS:      { label: 'Success',     bg: 'var(--ip-payment-success-bg)', color: 'var(--ip-payment-success)', icon: CheckCircle },
  FAILED:       { label: 'Failed',      bg: 'var(--ip-payment-failed-bg)', color: 'var(--ip-payment-failed)', icon: XCircle },
  REFUNDED:     { label: 'Refunded',    bg: 'var(--ip-payment-success-bg)', color: 'var(--ip-payment-success)', icon: RefreshCw },
};

const StatusBadge = ({ status, icon, className = '' }) => {
  const normalizedStatus = typeof status === 'string' ? status.toUpperCase().replace(/ /g, '_') : status;
  const s = STATUS_MAP[normalizedStatus] ?? { label: status ?? '\u2014', bg: '#f1f5f9', color: '#64748b', icon: HelpCircle };
  
  const IconComponent = s.icon;
  const renderedIcon = icon || (IconComponent ? <IconComponent size={14} className="me-1" /> : null);

  return (
    <span className={`badge badge-soft ${className}`} style={{ color: s.color }}>
      <span className="d-flex align-items-center justify-content-center">
        {renderedIcon}
        {s.label}
      </span>
    </span>
  );
};

export default StatusBadge;
