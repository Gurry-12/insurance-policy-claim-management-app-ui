import React from "react";

const toTitleCase = (str) => {
  if (!str) return "";
  return str.toLowerCase().split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const StatusBadge = ({ status }) => {
  let badgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '0.35em 0.85em',
    borderRadius: 'var(--ip-radius-pill)',
    fontWeight: '600',
    letterSpacing: '0.02em',
    fontSize: '0.75rem',
    border: '1px solid transparent'
  };
  
  let iconClass = "";
  let label = status;

  switch (status) {
    case "ACTIVE":
      badgeStyle.backgroundColor = '#d1fae5'; // emerald-100
      badgeStyle.color = '#047857'; // emerald-700
      badgeStyle.borderColor = '#a7f3d0'; // emerald-200
      iconClass = "bi-check-circle-fill";
      break;
    case "APPROVED":
      badgeStyle.backgroundColor = '#dcfce7'; // green-100
      badgeStyle.color = '#166534'; // green-800
      badgeStyle.borderColor = '#bbf7d0'; // green-200
      iconClass = "bi-check-circle-fill";
      break;
    case "SUCCESS":
      badgeStyle.backgroundColor = '#ccfbf1'; // teal-100
      badgeStyle.color = '#0f766e'; // teal-700
      badgeStyle.borderColor = '#99f6e4'; // teal-200
      iconClass = "bi-check-circle-fill";
      break;
    case "ASSIGNED":
      badgeStyle.backgroundColor = '#e0e7ff'; // indigo-100
      badgeStyle.color = '#3730a3'; // indigo-800
      badgeStyle.borderColor = '#c7d2fe'; // indigo-200
      iconClass = "bi-person-check-fill";
      break;
    case "PENDING":
      badgeStyle.backgroundColor = '#fef08a'; // yellow-200
      badgeStyle.color = '#854d0e'; // yellow-800
      badgeStyle.borderColor = '#fde047'; // yellow-300
      iconClass = "bi-clock-fill";
      break;
    case "UNDER_REVIEW":
      badgeStyle.backgroundColor = '#ede9fe'; // violet-100
      badgeStyle.color = '#5b21b6'; // violet-800
      badgeStyle.borderColor = '#ddd6fe'; // violet-200
      iconClass = "bi-search";
      break;
    case "SUBMITTED":
      badgeStyle.backgroundColor = '#dbeafe'; // blue-100
      badgeStyle.color = '#1e3a8a'; // blue-900
      badgeStyle.borderColor = '#bfdbfe'; // blue-200
      iconClass = "bi-file-earmark-check-fill";
      break;
    case "PENDING_PAYMENT":
      badgeStyle.backgroundColor = '#ffedd5'; // orange-100
      badgeStyle.color = '#9a3412'; // orange-800
      badgeStyle.borderColor = '#fed7aa'; // orange-200
      iconClass = "bi-credit-card-fill";
      break;
    case "REJECTED":
      badgeStyle.backgroundColor = '#fee2e2'; // red-100
      badgeStyle.color = '#b91c1c'; // red-700
      badgeStyle.borderColor = '#fecaca'; // red-200
      iconClass = "bi-x-circle-fill";
      break;
    case "CANCELLED":
      badgeStyle.backgroundColor = '#ffe4e6'; // rose-100
      badgeStyle.color = '#be123c'; // rose-700
      badgeStyle.borderColor = '#fecdd3'; // rose-200
      iconClass = "bi-slash-circle-fill";
      break;
    case "EXPIRED":
      badgeStyle.backgroundColor = '#f3f4f6'; // gray-100
      badgeStyle.color = '#374151'; // gray-700
      badgeStyle.borderColor = '#e5e7eb'; // gray-200
      iconClass = "bi-hourglass-bottom";
      break;
    case "FAILED":
      badgeStyle.backgroundColor = '#fce7f3'; // pink-100
      badgeStyle.color = '#9d174d'; // pink-800
      badgeStyle.borderColor = '#fbcfe8'; // pink-200
      iconClass = "bi-exclamation-triangle-fill";
      break;
    case "RECOMMENDED_FOR_APPROVAL":
      badgeStyle.backgroundColor = '#e0e7ff'; // indigo-100
      badgeStyle.color = '#3730a3'; // indigo-800
      badgeStyle.borderColor = '#c7d2fe'; // indigo-200
      iconClass = "bi-hand-thumbs-up-fill";
      label = "Recommended for Approval";
      break;
    case "RECOMMENDED_FOR_REJECTION":
      badgeStyle.backgroundColor = '#fae8ff'; // fuchsia-100
      badgeStyle.color = '#86198f'; // fuchsia-800
      badgeStyle.borderColor = '#f5d0fe'; // fuchsia-200
      iconClass = "bi-hand-thumbs-down-fill";
      label = "Recommended for Rejection";
      break;
    default:
      badgeStyle.backgroundColor = '#f1f5f9'; // slate-100
      badgeStyle.color = '#475569'; // slate-700
      badgeStyle.borderColor = '#e2e8f0'; // slate-200
      iconClass = "bi-info-circle-fill";
      break;
  }

  // Use the override label if set (e.g. Reviewed), otherwise title case the raw status
  const finalLabel = label === status ? toTitleCase(status) : label;

  return (
    <span style={badgeStyle}>
      {iconClass && <i className={`bi ${iconClass}`} style={{ fontSize: '0.8rem' }}></i>}
      {finalLabel}
    </span>
  );
};

export default StatusBadge;
