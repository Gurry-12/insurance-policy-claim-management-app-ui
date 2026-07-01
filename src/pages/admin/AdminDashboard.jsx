import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminStats } from '../../services/dashboardService';
import useAuth from '../../hooks/useAuth';
import StatusBadge from '../../components/ui/StatusBadge';
import EmptyState  from '../../components/ui/EmptyState';
import ErrorAlert  from '../../components/ui/ErrorAlert';
import PageHeader  from '../../components/common/PageHeader';
import BentoCard   from '../../common/BentoCard';

const StatTile = ({ icon, label, value, color }) => (
  <BentoCard className="ip-bento-stat-tile">
    <div className="d-flex align-items-center gap-3">
      <div className="ip-bento-stat-icon" style={{ background: `${color}18` }}>
        <i className={`bi ${icon}`} style={{ color }} />
      </div>
      <div>
        <div className="ip-bento-stat-value">{value ?? <span className="placeholder col-4" />}</div>
        <div className="ip-bento-stat-label">{label}</div>
      </div>
    </div>
  </BentoCard>
);

const QuickAction = ({ icon, label, to, color }) => (
  <Link to={to} className="text-decoration-none" style={{ display: 'contents' }}>
    <BentoCard>
      <div className="d-flex align-items-center gap-3">
        <div className="ip-bento-stat-icon" style={{ background: `${color}18` }}>
          <i className={`bi ${icon}`} style={{ color, fontSize: '1.1rem' }} />
        </div>
        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--ip-text-primary)' }}>{label}</span>
      </div>
    </BentoCard>
  </Link>
);

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    getAdminStats()
      .then(setStats)
      .catch(() => setError('Could not load dashboard stats. Check your API connection.'))
      .finally(() => setLoading(false));
  }, []);

  const s = stats ?? {};

  const STATS = [
    { icon: 'bi-people-fill',        label: 'Total Customers',   value: s.totalCustomers, color: '#3b82f6' },
    { icon: 'bi-shield-fill-check',  label: 'Active Plans',      value: s.activePolicies, color: '#22c55e' },
    { icon: 'bi-shield-exclamation', label: 'Submitted Claims',  value: s.claims?.pendingClaims, color: '#f59e0b' },
    { icon: 'bi-shield-fill-x',      label: 'Reviewed Claims',   value: s.claims?.reviewedClaims, color: '#6b7280' },
    { icon: 'bi-person-badge-fill',  label: 'Active Users',      value: s.activeUsers,   color: '#06b6d4' },
    { icon: 'bi-box-seam-fill',      label: 'Products',          value: s.totalProducts, color: '#f05a28' },
  ];

  const QUICK_ACTIONS = [
    { icon: 'bi-person-plus',       label: 'New Staff',   to: '/admin/users/create',    color: '#3b82f6' },
    { icon: 'bi-box-seam',          label: 'New Product', to: '/admin/products/create', color: '#f05a28' },
    { icon: 'bi-layers',            label: 'New Plan',    to: '/admin/plans/create',    color: '#22c55e' },
    { icon: 'bi-file-earmark-plus', label: 'Issue Policy',to: '/admin/policies/issue',  color: '#a855f7' },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle={`Welcome back, ${user?.name ?? 'Admin'} 👋`}
        action={
          <span style={{ fontSize: '0.8rem', color: 'var(--ip-text-muted)' }}>
            <i className="bi bi-calendar3 me-1" />
            {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        }
      />

      <ErrorAlert message={error} />

      {/* Stat tiles */}
      <div className="ip-bento-grid cols-3 mb-4">
        {STATS.map(card => (
          <StatTile key={card.label} {...card} />
        ))}
      </div>

      {/* Bentogrid middle section */}
      <div className="ip-bento-grid cols-3 mb-4">
        {/* Quick Actions */}
        <div className="ip-bento-span-1">
          <BentoCard title="Quick Actions" icon="bi-lightning-charge-fill" iconColor="#f59e0b">
            <div className="row g-2">
              {QUICK_ACTIONS.map(a => (
                <div key={a.label} className="col-6">
                  <QuickAction {...a} />
                </div>
              ))}
            </div>
          </BentoCard>
        </div>

        {/* Recent Claims */}
        <div className="ip-bento-span-2">
          <BentoCard title="Recent Claims" icon="bi-shield-exclamation" iconColor="#f05a28" linkTo="/admin/claims" linkLabel="View all">
            {loading ? (
              <div className="d-flex flex-column gap-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="placeholder-glow d-flex align-items-center gap-3 p-2">
                    <span className="placeholder rounded-circle" style={{ width: 36, height: 36 }} />
                    <div style={{ flex: 1 }}>
                      <span className="placeholder col-5 d-block mb-1" style={{ height: 12 }} />
                      <span className="placeholder col-8 d-block" style={{ height: 10 }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : s.recentClaims?.length ? (
              <div className="d-flex flex-column gap-1">
                {s.recentClaims.map((claim, i) => (
                  <div key={claim.id ?? i} className="d-flex align-items-center gap-3 py-2" style={{ borderBottom: i < s.recentClaims.length - 1 ? '1px solid var(--ip-border)' : 'none' }}>
                    <div className="ip-bento-stat-icon" style={{ background: '#f59e0b18', width: 36, height: 36, borderRadius: 10 }}>
                      <i className="bi bi-shield-exclamation" style={{ color: '#f59e0b', fontSize: '0.9rem' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--ip-text-primary)' }}>
                        {claim.customerName ?? 'Customer'} — #{claim.id}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--ip-text-muted)' }}>
                        {claim.type} · {claim.date}
                      </div>
                    </div>
                    <StatusBadge status={claim.status} />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState icon="bi-shield-slash" message="No recent claims" />
            )}
          </BentoCard>
        </div>
      </div>

      {/* Recent Policies - full width */}
      <BentoCard title="Recent Policies" icon="bi-file-earmark-text" iconColor="#3b82f6" linkTo="/admin/policies" linkLabel="View all">
        {loading ? (
          <div className="placeholder-glow">
            {[1, 2, 3].map(i => (
              <span key={i} className="placeholder col-12 d-block mb-2" style={{ height: 36, borderRadius: 8 }} />
            ))}
          </div>
        ) : s.recentPolicies?.length ? (
          <div className="table-responsive">
            <table className="table align-middle mb-0" style={{ fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ color: 'var(--ip-text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  <th className="border-0">Policy #</th>
                  <th className="border-0">Customer</th>
                  <th className="border-0">Product</th>
                  <th className="border-0">Premium</th>
                  <th className="border-0">Status</th>
                  <th className="border-0">Start Date</th>
                </tr>
              </thead>
              <tbody>
                {s.recentPolicies.map((p, i) => (
                  <tr key={p.id ?? i}>
                    <td style={{ fontWeight: 600 }}>#{p.id}</td>
                    <td>{p.customerName}</td>
                    <td style={{ color: 'var(--ip-text-muted)' }}>{p.productName}</td>
                    <td style={{ fontWeight: 600 }}>₹{Number(p.premium).toLocaleString('en-IN')}</td>
                    <td><StatusBadge status={p.status} /></td>
                    <td style={{ color: 'var(--ip-text-muted)' }}>{p.startDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState icon="bi-file-earmark-x" message="No recent policies" />
        )}
      </BentoCard>
    </div>
  );
};

export default AdminDashboard;
