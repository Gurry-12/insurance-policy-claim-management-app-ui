import { Link } from 'react-router-dom';

/**
 * DashboardCard — stat metric card used on dashboard overview pages.
 *
 * Props:
 *  icon    — bootstrap-icons class e.g. 'bi-people-fill'
 *  label   — metric label string
 *  value   — the number/string to display (undefined = skeleton)
 *  color   — hex accent colour
 *  to      — react-router link target (optional)
 *  delta   — number: % change this month (optional, + green / - red)
 */
const DashboardCard = ({ icon, label, value, color, to, delta }) => {
  const content = (
    <div
      className="dashboard-metric-card card border-0 h-100"
      style={{
        borderRadius: 16,
        cursor: to ? 'pointer' : 'default',
        transition: 'transform 0.2s, box-shadow 0.2s',
        boxShadow: 'var(--ss-shadow)',
      }}
    >
      <div className="card-body d-flex align-items-center gap-3 p-4">
        <div
          style={{
            width: 52, height: 52, borderRadius: 14, flexShrink: 0,
            background: `${color}18`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <i className={`bi ${icon}`} style={{ fontSize: '1.4rem', color }} />
        </div>
        <div>
          <div
            style={{
              fontSize: '1.7rem', fontWeight: 700,
              color: 'var(--ss-text-primary)', lineHeight: 1.1,
            }}
          >
            {value ?? <span className="placeholder col-6" />}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--ss-text-muted)', marginTop: 2 }}>
            {label}
          </div>
          {delta !== undefined && (
            <div
              style={{
                fontSize: '0.72rem', marginTop: 4, fontWeight: 600,
                color: delta >= 0 ? '#22c55e' : '#ef4444',
              }}
            >
              <i className={`bi bi-arrow-${delta >= 0 ? 'up' : 'down'}-short`} />
              {Math.abs(delta)}% this month
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return to ? (
    <Link to={to} className="text-decoration-none">{content}</Link>
  ) : (
    content
  );
};

export default DashboardCard;
