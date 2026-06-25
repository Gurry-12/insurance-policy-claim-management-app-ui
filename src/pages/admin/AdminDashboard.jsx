import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminStats } from '../../services/dashboardService';
import useAuth from '../../hooks/useAuth';
import DashboardCard from '../../components/cards/DashboardCard';
import StatusBadge   from '../../components/ui/StatusBadge';
import EmptyState    from '../../components/ui/EmptyState';
import ErrorAlert    from '../../components/ui/ErrorAlert';
import PageHeader    from '../../components/common/PageHeader';

/* ── Quick-action tile ──────────────────────────────────────────── */
const QuickAction = ({ icon, label, to, color }) => (
  <Link to={to} className="text-decoration-none">
    <div
      className="card border-0 text-center p-3"
      style={{ borderRadius: 14, cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: 'var(--ss-shadow-sm)' }}
      onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-3px)')}
      onMouseLeave={e => (e.currentTarget.style.transform = '')}
    >
      <div style={{
        width: 44, height: 44, borderRadius: 12, margin: '0 auto 0.6rem',
        background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <i className={`bi ${icon}`} style={{ fontSize: '1.2rem', color }} />
      </div>
      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--ss-text-primary)' }}>{label}</div>
    </div>
  </Link>
);

/* ── Section card wrapper ───────────────────────────────────────── */
const SectionCard = ({ title, icon, iconColor, linkTo, linkLabel, children }) => (
  <div className="card border-0 h-100" style={{ borderRadius: 16, boxShadow: 'var(--ss-shadow)' }}>
    <div className="card-body p-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h6 style={{ fontWeight: 700, color: 'var(--ss-text-primary)', margin: 0, fontSize: '0.9rem' }}>
          <i className={`bi ${icon} me-2`} style={{ color: iconColor }} />
          {title}
        </h6>
        {linkTo && (
          <Link to={linkTo} style={{ fontSize: '0.78rem', color: '#f05a28', textDecoration: 'none', fontWeight: 600 }}>
            {linkLabel ?? 'View all'} <i className="bi bi-arrow-right" />
          </Link>
        )}
      </div>
      {children}
    </div>
  </div>
);

/* ── AdminDashboard ─────────────────────────────────────────────── */
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

  const STAT_CARDS = [
    { icon: 'bi-people-fill',        label: 'Total Customers', value: s.totalCustomers, color: '#3b82f6', to: '/admin/customers', delta: s.customersDelta },
    { icon: 'bi-shield-fill-check',  label: 'Active Policy Plans', value: s.activePolicies, color: '#22c55e', to: '/admin/plans',  delta: s.policiesDelta  },
    { icon: 'bi-shield-exclamation', label: 'Submitted Claims',     value: s.claims?.pendingClaims,     color: '#f59e0b', to: '/admin/claims',    delta: s.claimsDelta    },
     { icon: 'bi-shield-fill-x',      label: 'Reviewed Claims',   value: s.claims?.reviewedClaims, color: '#6b7280', to: '/admin/claims', delta: s.claimsDelta },
    { icon: 'bi-person-badge-fill',  label: 'Active Users',   value: s.activeUsers,   color: '#06b6d4', to: '/admin/users',     delta: s.agentsDelta    },
    { icon: 'bi-box-seam-fill',      label: 'Products',        value: s.totalProducts,  color: '#f05a28', to: '/admin/products'                           },
  ];

  const QUICK_ACTIONS = [
    { icon: 'bi-person-plus',       label: 'New Agent',    to: '/admin/users/create',    color: '#3b82f6' },
    { icon: 'bi-box-seam',          label: 'New Product',  to: '/admin/products/create', color: '#f05a28' },
    { icon: 'bi-layers',            label: 'New Plan',     to: '/admin/plans/create',    color: '#22c55e' },
    { icon: 'bi-file-earmark-plus', label: 'Issue Policy', to: '/admin/policies/issue',  color: '#a855f7' },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle={`Welcome back, ${user?.name ?? 'Admin'} 👋`}
        action={
          <span style={{ fontSize: '0.8rem', color: 'var(--ss-text-muted)' }}>
            <i className="bi bi-calendar3 me-1" />
            {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        }
      />

      <ErrorAlert message={error} />

      {/* Stat cards */}
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-3 g-3 mb-4">
        {STAT_CARDS.map(card => (
          <div key={card.label} className="col">
            <DashboardCard {...card} />
          </div>
        ))}
      </div>

      <div className="row g-3">
        {/* Quick Actions */}
        <div className="col-12 col-lg-4">
          <SectionCard title="Quick Actions" icon="bi-lightning-charge-fill" iconColor="#f59e0b">
            <div className="row g-2">
              {QUICK_ACTIONS.map(a => (
                <div key={a.label} className="col-6">
                  <QuickAction {...a} />
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* Recent Claims */}
        <div className="col-12 col-lg-8">
          <SectionCard title="Recent Claims" icon="bi-shield-exclamation" iconColor="#f05a28" linkTo="/admin/claims" linkLabel="View all">
            {loading ? (
              <div className="d-flex flex-column gap-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="placeholder-glow d-flex align-items-center gap-3 p-2">
                    <span className="placeholder rounded-circle" style={{ width: 36, height: 36, flexShrink: 0 }} />
                    <div className="grow">
                      <span className="placeholder col-5 d-block mb-1" style={{ height: 12 }} />
                      <span className="placeholder col-8 d-block" style={{ height: 10 }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : s.recentClaims?.length ? (
              <div className="d-flex flex-column gap-1">
                {s.recentClaims.map((claim, i) => (
                  <div
                    key={claim.id ?? i}
                    className="d-flex align-items-center gap-3 py-2"
                    style={{ borderBottom: i < s.recentClaims.length - 1 ? '1px solid var(--ss-border-light)' : 'none' }}
                  >
                    <div style={{
                      width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                      background: '#fee2e218', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <i className="bi bi-shield-exclamation" style={{ color: '#f59e0b', fontSize: '1rem' }} />
                    </div>
                    <div className="grow">
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--ss-text-primary)' }}>
                        {claim.customerName ?? 'Customer'} — #{claim.id}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--ss-text-muted)' }}>
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
          </SectionCard>
        </div>

        {/* Recent Policies */}
        <div className="col-12">
          <SectionCard title="Recent Policies" icon="bi-file-earmark-text" iconColor="#3b82f6" linkTo="/admin/policies" linkLabel="View all">
            {loading ? (
              <div className="placeholder-glow">
                {[1, 2, 3].map(i => (
                  <span key={i} className="placeholder col-12 d-block mb-2" style={{ height: 36, borderRadius: 8 }} />
                ))}
              </div>
            ) : s.recentPolicies?.length ? (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0" style={{ fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ color: 'var(--ss-text-muted)', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
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
                        <td style={{ color: 'var(--ss-text-muted)' }}>{p.productName}</td>
                        <td style={{ fontWeight: 600 }}>₹{Number(p.premium).toLocaleString('en-IN')}</td>
                        <td><StatusBadge status={p.status} /></td>
                        <td style={{ color: 'var(--ss-text-muted)' }}>{p.startDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState icon="bi-file-earmark-x" message="No recent policies" />
            )}
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
