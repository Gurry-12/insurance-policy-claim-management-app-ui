import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { getAllPaymentsPaginated as getAllPayments } from "../../services/paymentService";
import { getAllClaimsPaginated as getAllClaims } from "../../services/claimService";
import { getAllPoliciesPaginated as getAllPolicies } from "../../services/policyService";
import { getAllCustomers } from "../../services/customerService";
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

const StaffDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    customersCount: 0,
    policiesCount: 0,
    pendingClaimsCount: 0,
    reviewedClaimsCount: 0,
    paymentsCount: 0,
    issuedPoliciesCount: 0,
  });

  const [recentClaims, setRecentClaims] = useState([]);
  const [recentCustomers, setRecentCustomers] = useState([]);
  const [recentPolicies, setRecentPolicies] = useState([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const customers = await getAllCustomers();
        const policyResponse = await getAllPolicies();
        const claimResponse = await getAllClaims();
        const paymentResponse = await getAllPayments();

        const claims = claimResponse?.content || [];
        const policies = policyResponse?.content || [];

        const pending = claims.filter(c => c.claimStatus === "PENDING" || c.claimStatus === "UNDER_REVIEW").length;
        const reviewed = claims.filter(c => c.claimStatus === "APPROVED" || c.claimStatus === "REJECTED" || c.claimStatus === "REVIEWED").length;

        setStats({
          customersCount: customers?.length || 0,
          policiesCount: policyResponse?.totalRecords || policies.length,
          pendingClaimsCount: pending,
          reviewedClaimsCount: reviewed,
          paymentsCount: paymentResponse?.totalRecords || 0,
          issuedPoliciesCount: policyResponse?.totalRecords || policies.length,
        });

        setRecentClaims(claims.slice(0, 5));
        setRecentCustomers((customers || []).slice(0, 5));
        setRecentPolicies(policies.slice(0, 5));
      } catch (err) {
        console.error("Dashboard Loading Error:", err);
        setError("Could not load dashboard stats. Check your API connection.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const STAT_CARDS = [
    { icon: 'bi-people-fill',        label: 'My Clients',       value: stats.customersCount,      color: '#0d9488', to: '/Staff/customers' },
    { icon: 'bi-shield-fill-check',  label: 'Active Policies',   value: stats.policiesCount,       color: '#059669', to: '/Staff/policies' },
    { icon: 'bi-shield-exclamation', label: 'Pending Claims',    value: stats.pendingClaimsCount,  color: '#d97706', to: '/Staff/claims' },
    { icon: 'bi-shield-fill-x',      label: 'Reviewed Claims',   value: stats.reviewedClaimsCount, color: '#6b7280', to: '/Staff/claims-history' },
    { icon: 'bi-credit-card-fill',   label: 'Premium Payments',  value: stats.paymentsCount,       color: '#2563eb', to: '/Staff/payments/page' },
    { icon: 'bi-file-earmark-plus',  label: 'Issued Policies',   value: stats.issuedPoliciesCount, color: '#7c3aed', to: '/Staff/policies' },
  ];

  const QUICK_ACTIONS = [
    { icon: 'bi-file-earmark-plus', label: 'Issue Policy',   to: '/Staff/issue-policy',  color: '#0d9488' },
    // { icon: 'bi-clock-history',     label: 'Claim History',  to: '/Staff/claims-history', color: '#6b7280' },
    { icon: 'bi-people',            label: 'View Clients',   to: '/Staff/customers',     color: '#0ea5e9' },
    { icon: 'bi-shield-check',      label: 'View Policies',  to: '/Staff/policies',      color: '#059669' },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle={`Welcome back, ${user?.name ?? 'Staff'} 👋`}
        action={
          <span style={{ fontSize: '0.8rem', color: 'var(--ss-text-muted)' }}>
            <i className="bi bi-calendar3 me-1" />
            {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        }
      />

      <ErrorAlert message={error} />

      {/* Stat cards always render immediately (with skeletons if loading) */}
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-6 g-3 mb-4">
        {STAT_CARDS.map(card => (
          <div key={card.label} className="col">
            <DashboardCard {...card} />
          </div>
        ))}
      </div>

      <div className="row g-3">
        {/* Quick Actions */}
        <div className="col-12 col-lg-4">
          <SectionCard title="Staff Actions" icon="bi-lightning-charge-fill" iconColor="#f59e0b">
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
          <SectionCard title="Recent Claims" icon="bi-shield-exclamation" iconColor="#d97706" linkTo="/Staff/claims" linkLabel="View all">
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
            ) : recentClaims.length ? (
              <div className="d-flex flex-column gap-1">
                {recentClaims.map((claim, i) => (
                  <div
                    key={claim.claimId ?? i}
                    className="d-flex align-items-center gap-3 py-2 animate-fade-in"
                    style={{ borderBottom: i < recentClaims.length - 1 ? '1px solid var(--ss-border-light)' : 'none', cursor: 'pointer' }}
                    onClick={() => navigate(`/Staff/claims/${claim.claimId}`)}
                  >
                    <div style={{
                      width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                      background: '#d9770618', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <i className="bi bi-shield-exclamation" style={{ color: '#d97706', fontSize: '1rem' }} />
                    </div>
                    <div className="grow">
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--ss-text-primary)' }}>
                        {claim.customerName ?? 'Customer'} — #{claim.claimNumber ?? claim.claimId}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--ss-text-muted)' }}>
                        ₹{Number(claim.claimAmount).toLocaleString('en-IN')} · {claim.createdDate ? new Date(claim.createdDate).toLocaleDateString() : '-'}
                      </div>
                    </div>
                    <StatusBadge status={claim.claimStatus} />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState icon="bi-shield-slash" message="No claims currently pending or registered" />
            )}
          </SectionCard>
        </div>

        {/* Recent Clients */}
        <div className="col-12 col-lg-4">
          <SectionCard title="Recent Clients" icon="bi-people-fill" iconColor="#0d9488" linkTo="/Staff/customers" linkLabel="View all">
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
            ) : recentCustomers.length ? (
              <div className="d-flex flex-column gap-1">
                {recentCustomers.map((c, i) => (
                  <div
                    key={c.customerId ?? i}
                    className="d-flex align-items-center gap-3 py-2 animate-fade-in"
                    style={{ borderBottom: i < recentCustomers.length - 1 ? '1px solid var(--ss-border-light)' : 'none', cursor: 'pointer' }}
                    onClick={() => navigate(`/Staff/customers`)}
                  >
                    <div style={{
                      width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                      background: '#0d948818', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <i className="bi bi-person-fill" style={{ color: '#0d9488', fontSize: '1rem' }} />
                    </div>
                    <div className="grow">
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--ss-text-primary)' }}>
                        {c.fullName}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--ss-text-muted)' }}>
                        {c.email}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState icon="bi-people" message="No customers registered under your workspace" />
            )}
          </SectionCard>
        </div>

        {/* Recent Policies */}
        <div className="col-12 col-lg-8">
          <SectionCard title="Recent Policies" icon="bi-file-earmark-text" iconColor="#3b82f6" linkTo="/Staff/policies" linkLabel="View all">
            {loading ? (
              <div className="placeholder-glow">
                {[1, 2, 3, 4].map(i => (
                  <span key={i} className="placeholder col-12 d-block mb-2" style={{ height: 36, borderRadius: 8 }} />
                ))}
              </div>
            ) : recentPolicies.length ? (
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
                    {recentPolicies.map((p, i) => (
                      <tr key={p.policyId || p.id || i} onClick={() => navigate(`/Staff/policies/${p.policyId || p.id}`)} style={{ cursor: 'pointer' }}>
                        <td style={{ fontWeight: 600 }}>#{p.policyId || p.id}</td>
                        <td>{p.customerName || 'Customer'}</td>
                        <td style={{ color: 'var(--ss-text-muted)' }}>{p.productName || 'Standard Plan'}</td>
                        <td style={{ fontWeight: 600 }}>₹{Number(p.premiumAmount || p.premium || 0).toLocaleString('en-IN')}</td>
                        <td><StatusBadge status={p.policyStatus || p.status} /></td>
                        <td style={{ color: 'var(--ss-text-muted)' }}>{p.startDate || '-'}</td>
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

export default StaffDashboard;

