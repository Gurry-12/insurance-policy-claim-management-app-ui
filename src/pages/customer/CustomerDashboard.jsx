import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { getMyPolicies } from "../../services/policyService";
import { getMyClaims } from "../../services/claimService";
import { getMyPayments } from "../../services/paymentService";
import StatusBadge from "../../components/ui/StatusBadge";
import EmptyState  from "../../components/ui/EmptyState";
import ErrorAlert  from "../../components/ui/ErrorAlert";
import PageHeader  from "../../components/common/PageHeader";
import BentoCard   from "../../common/BentoCard";

const StatTile = ({ icon, label, value, color }) => (
  <BentoCard className="ip-bento-stat-tile">
    <div className="d-flex align-items-center gap-3">
      <div className="ip-bento-stat-icon" style={{ background: `${color}18` }}>
        <i className={`bi ${icon}`} style={{ color }} />
      </div>
      <div>
        <div className="ip-bento-stat-value">{value}</div>
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

const CustomerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    totalPolicies: 0, pendingPolicies: 0, totalClaims: 0, totalPayments: 0,
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
        const pendingCount = policies.filter(p => p.policyStatus === "PENDING_PAYMENT").length;
        setStats({
          totalPolicies: policyResponse?.totalRecords || policies.length,
          pendingPolicies: pendingCount,
          totalClaims: claimResponse?.totalRecords || claims.length,
          totalPayments: paymentResponse?.totalRecords || payments.length,
        });
        setPoliciesList(policies.slice(0, 4));
        setRecentClaims(claims.slice(0, 4));
      } catch (err) {
        console.error("Customer Dashboard Fetch Error:", err);
        setError("Could not load all dashboard details. Check your connection.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const STATS = [
    { icon: 'bi-file-earmark-text', label: 'My Policies',      value: stats.totalPolicies,  color: '#0284c7' },
    { icon: 'bi-credit-card',       label: 'Pending Payments', value: stats.pendingPolicies,color: '#ef4444' },
    { icon: 'bi-shield-exclamation',label: 'Total Claims',     value: stats.totalClaims,    color: '#d97706' },
    { icon: 'bi-receipt',           label: 'Payment History',  value: stats.totalPayments,  color: '#10b981' },
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
          <span style={{ fontSize: '0.8rem', color: 'var(--ip-text-muted)' }}>
            <i className="bi bi-calendar3 me-1" />
            {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        }
      />

      <ErrorAlert message={error} />

      {/* Stat tiles */}
      <div className="ip-bento-grid cols-4 mb-4">
        {STATS.map(card => (
          <StatTile key={card.label} {...card} />
        ))}
      </div>

      {/* Bentogrid middle */}
      <div className="ip-bento-grid cols-3 mb-4">
        {/* Quick Actions */}
        <div className="ip-bento-span-1">
          <BentoCard title="Quick Actions" icon="bi-lightning-charge-fill" iconColor="#10b981">
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
          <BentoCard title="Recent Claims" icon="bi-shield-exclamation" iconColor="#d97706" linkTo="/customer/claims" linkLabel="View all">
            {loading ? (
              <div className="d-flex flex-column gap-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="placeholder-glow d-flex align-items-center gap-3 p-2">
                    <span className="placeholder rounded-circle" style={{ width: 36, height: 36 }} />
                    <div style={{ flex: 1 }}>
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
                    className="d-flex align-items-center gap-3 py-2"
                    style={{ borderBottom: i < recentClaims.length - 1 ? '1px solid var(--ip-border)' : 'none', cursor: 'pointer' }}
                    onClick={() => navigate(`/customer/claims/${claim.claimId}`)}
                  >
                    <div className="ip-bento-stat-icon" style={{ background: '#d9770618', width: 36, height: 36, borderRadius: 10 }}>
                      <i className="bi bi-shield-exclamation" style={{ color: '#d97706', fontSize: '0.9rem' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--ip-text-primary)' }}>
                        #{claim.claimNumber ?? claim.claimId}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--ip-text-muted)' }}>
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
          </BentoCard>
        </div>
      </div>

      {/* Active Policies Cards */}
      <BentoCard title="My Active Policies" icon="bi-file-earmark-text" iconColor="#0284c7" linkTo="/customer/policies" linkLabel="View all">
        {loading ? (
          <div className="row g-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="col-md-6 col-lg-4">
                <span className="placeholder col-12 d-block" style={{ height: 120, borderRadius: 12 }} />
              </div>
            ))}
          </div>
        ) : policiesList.length ? (
          <div className="row g-3">
            {policiesList.map((p, i) => (
              <div key={p.policyId || p.id || i} className="col-md-6 col-lg-4">
                <div 
                  className="border rounded-3 p-3 h-100 position-relative shadow-sm"
                  style={{ 
                    background: p.policyStatus === 'PENDING_PAYMENT' ? 'linear-gradient(135deg, var(--ip-policy-pending-bg) 0%, var(--ip-surface) 100%)' : 'linear-gradient(135deg, var(--ip-policy-active-bg) 0%, var(--ip-surface) 100%)',
                    borderColor: p.policyStatus === 'PENDING_PAYMENT' ? 'var(--ip-warning-subtle)' : 'var(--ip-success-subtle)'
                  }}
                >
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="badge bg-white text-dark border shadow-sm rounded-pill px-2 py-1 fw-medium" style={{ fontSize: '0.7rem' }}>
                      #{p.policyNumber || p.policyId || p.id}
                    </span>
                    <StatusBadge status={p.policyStatus || p.status} />
                  </div>
                  <h6 className="fw-bold mb-3 text-truncate" style={{ fontSize: '0.9rem' }}>{p.planName || 'Standard Plan'}</h6>
                  
                  <div className="d-flex justify-content-between align-items-center mt-auto pt-2 border-top">
                    <div>
                      <div className="text-muted" style={{ fontSize: '0.65rem', textTransform: 'uppercase' }}>Premium</div>
                      <div className="fw-bold" style={{ fontSize: '0.85rem' }}>₹{Number(p.premiumAmount || p.premium || 0).toLocaleString('en-IN')}</div>
                    </div>
                    <div>
                      {p.policyStatus === 'PENDING_PAYMENT' ? (
                        <Link to={`/customer/payments/pay/${p.policyId || p.id}`}
                          className="btn btn-warning py-1 px-3 text-dark rounded-pill fw-semibold shadow-sm"
                          style={{ fontSize: '0.75rem' }}>
                          Pay Now
                        </Link>
                      ) : (
                        <Link to={`/customer/policies/${p.policyId || p.id}`}
                          className="btn btn-light py-1 px-3 text-primary rounded-pill fw-semibold shadow-sm border"
                          style={{ fontSize: '0.75rem' }}>
                          View
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState icon="bi-file-earmark-x" message="You have no active policies yet." />
        )}
      </BentoCard>
    </div>
  );
};

export default CustomerDashboard;
