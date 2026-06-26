import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { getMyPolicies } from "../../services/policyService";
import { getMyClaims } from "../../services/claimService";
import { getMyPayments } from "../../services/paymentService";
import DashboardCard from "../../components/cards/DashboardCard";
import StatusBadge from "../../components/ui/StatusBadge";
import EmptyState from "../../components/ui/EmptyState";
import ErrorAlert from "../../components/ui/ErrorAlert";
import PageHeader from "../../components/common/PageHeader";

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

const QuickAction = ({ icon, label, to, color }) => (
  <Link to={to} className="text-decoration-none">
    <div
      className="card border-0 text-center p-3 h-100"
      style={{ borderRadius: 14, cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: 'var(--ss-shadow-sm)' }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = 'var(--ss-shadow)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = 'var(--ss-shadow-sm)';
      }}
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

const CustomerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    totalPolicies: 0,
    pendingPolicies: 0,
    totalClaims: 0,
    totalPayments: 0,
  });
  
  const [policiesList, setPoliciesList] = useState([]);
  const [recentClaims, setRecentClaims] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");
        
        const [policyResponse, claimResponse, paymentResponse] = await Promise.all([
          getMyPolicies().catch(() => null),
          getMyClaims().catch(() => null),
          getMyPayments().catch(() => null)
        ]);

        const policies = policyResponse?.content || policyResponse?.data || [];
        const claims = claimResponse?.content || claimResponse?.data || [];
        const payments = paymentResponse?.content || paymentResponse?.data || [];

        const pendingCount = policies.filter(
          (policy) => policy.policyStatus === "PENDING_PAYMENT"
        ).length;

        setStats({
          totalPolicies: policyResponse?.totalRecords || policies.length,
          pendingPolicies: pendingCount,
          totalClaims: claimResponse?.totalRecords || claims.length,
          totalPayments: paymentResponse?.totalRecords || payments.length,
        });

        setPoliciesList(policies.slice(0, 3));
        setRecentClaims(claims.slice(0, 3));
      } catch (err) {
        console.error("Customer Dashboard Fetch Error:", err);
        setError("Could not load all dashboard details. Check your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const STAT_CARDS = [
    { icon: 'bi-file-earmark-text', label: 'My Policies',      value: stats.totalPolicies,    color: '#0284c7', to: '/customer/policies' },
    { icon: 'bi-credit-card',       label: 'Pending Payments', value: stats.pendingPolicies,  color: '#ef4444', to: '/customer/payments' },
    { icon: 'bi-shield-exclamation',label: 'Total Claims',     value: stats.totalClaims,      color: '#d97706', to: '/customer/claims' },
    { icon: 'bi-receipt',           label: 'Payment History',  value: stats.totalPayments,    color: '#10b981', to: '/customer/payments' },
  ];

  const QUICK_ACTIONS = [
    { icon: 'bi-search',            label: 'Browse Products', to: '/customer/products',     color: '#0284c7' },
    { icon: 'bi-layers',            label: 'Browse Plans',    to: '/customer/plans',        color: '#10b981' },
    { icon: 'bi-shield-exclamation',label: 'Raise Claim',     to: '/customer/claims/raise', color: '#ef4444' },
    { icon: 'bi-credit-card',       label: 'Make Payment',    to: '/customer/payments',     color: '#f59e0b' },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle={`Welcome back, ${user?.name ?? 'User'} 👋`}
        action={
          <span style={{ fontSize: '0.8rem', color: 'var(--ss-text-muted)' }}>
            <i className="bi bi-calendar3 me-1" />
            {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        }
      />

      <ErrorAlert message={error} />

      <div className="row g-3">
        {/* Stat Cards - Render immediately */}
        <div className="col-12 col-lg-5">
          <div className="row row-cols-1 row-cols-sm-2 g-3 mb-2">
            {STAT_CARDS.map(card => (
              <div key={card.label} className="col">
                <DashboardCard {...card} />
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-12 col-lg-7">
          <SectionCard title="Quick Actions" icon="bi-lightning-charge-fill" iconColor="#10b981">
            <div className="row row-cols-2 row-cols-sm-4 g-2">
              {QUICK_ACTIONS.map(a => (
                <div key={a.label} className="col">
                  <QuickAction {...a} />
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* Recent Claims */}
        <div className="col-12 col-lg-4">
          <SectionCard title="Recent Claims" icon="bi-shield-exclamation" iconColor="#d97706" linkTo="/customer/claims" linkLabel="View all">
            {loading ? (
              <div className="d-flex flex-column gap-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="placeholder-glow d-flex align-items-center gap-3 p-2">
                    <span className="placeholder rounded-circle" style={{ width: 36, height: 36, flexShrink: 0 }} />
                    <div className="grow">
                      <span className="placeholder col-6 d-block mb-1" style={{ height: 12 }} />
                      <span className="placeholder col-9 d-block" style={{ height: 10 }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentClaims.length ? (
              <div className="d-flex flex-column gap-1">
                {recentClaims.map((claim, i) => (
                  <div
                    key={claim.claimId ?? i}
                    className="d-flex align-items-center gap-3 py-2 animate-fade-in"
                    style={{ borderBottom: i < recentClaims.length - 1 ? '1px solid var(--ss-border-light)' : 'none', cursor: 'pointer' }}
                    onClick={() => navigate(`/customer/claims/${claim.claimId}`)}
                  >
                    <div style={{
                      width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                      background: '#d9770618', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <i className="bi bi-shield-exclamation" style={{ color: '#d97706', fontSize: '1rem' }} />
                    </div>
                    <div className="grow">
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--ss-text-primary)' }}>
                        #{claim.claimNumber ?? claim.claimId}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--ss-text-muted)' }}>
                        ₹{Number(claim.claimAmount).toLocaleString('en-IN')}
                      </div>
                    </div>
                    <StatusBadge status={claim.claimStatus} />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState icon="bi-shield-slash" message="You haven't raised any claims yet." />
            )}
          </SectionCard>
        </div>

        {/* Customer Policies Table */}
        <div className="col-12 col-lg-8">
          <SectionCard title="My Active Policies" icon="bi-file-earmark-text" iconColor="#0284c7" linkTo="/customer/policies" linkLabel="View all">
            {loading ? (
              <div className="placeholder-glow">
                {[1, 2, 3, 4].map(i => (
                  <span key={i} className="placeholder col-12 d-block mb-2" style={{ height: 36, borderRadius: 8 }} />
                ))}
              </div>
            ) : policiesList.length ? (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0" style={{ fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ color: 'var(--ss-text-muted)', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      <th className="border-0">Policy #</th>
                      <th className="border-0">Plan Name</th>
                      <th className="border-0">Premium Amount</th>
                      <th className="border-0">Status</th>
                      <th className="border-0">Start Date</th>
                      <th className="border-0">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {policiesList.map((p, i) => (
                      <tr key={p.policyId || p.id || i}>
                        <td style={{ fontWeight: 600 }}>#{p.policyId || p.id}</td>
                        <td>{p.planName || 'Standard Plan'}</td>
                        <td style={{ fontWeight: 600 }}>₹{Number(p.premiumAmount || p.premium || 0).toLocaleString('en-IN')}</td>
                        <td><StatusBadge status={p.policyStatus || p.status} /></td>
                        <td style={{ color: 'var(--ss-text-muted)' }}>{p.startDate || 'N/A'}</td>
                        <td>
                          {p.policyStatus === 'PENDING_PAYMENT' ? (
                            <Link
                              to={`/customer/payments/pay/${p.policyId || p.id}`}
                              className="btn btn-sm btn-warning py-1 px-3 text-dark rounded-pill fw-semibold"
                              style={{ fontSize: '0.74rem' }}
                            >
                              Pay Premium
                            </Link>
                          ) : (
                            <Link
                              to={`/customer/policies/${p.policyId || p.id}`}
                              className="btn btn-sm btn-light py-1 px-3 text-primary rounded-pill fw-semibold border"
                              style={{ fontSize: '0.74rem' }}
                            >
                              View Details
                            </Link>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState icon="bi-file-earmark-x" message="You have no active policies yet." />
            )}
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;