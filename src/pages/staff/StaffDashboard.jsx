import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { getAllPaymentsPaginated as getAllPayments } from "../../services/paymentService";
import { getAllClaimsPaginated as getAllClaims } from "../../services/claimService";
import { getAllPoliciesPaginated as getAllPolicies } from "../../services/policyService";
import { getAllCustomers } from "../../services/customerService";
import StatusBadge from "../../components/ui/StatusBadge";
import EmptyState from "../../components/ui/EmptyState";
import ErrorAlert from "../../components/ui/ErrorAlert";
import PageHeader from "../../components/common/PageHeader";
import BentoCard from "../../common/BentoCard";

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

  const STATS = [
    { icon: 'bi-people-fill',        label: 'My Clients',       value: stats.customersCount,      color: '#0d9488' },
    { icon: 'bi-shield-fill-check',  label: 'Active Policies',   value: stats.policiesCount,       color: '#059669' },
    { icon: 'bi-shield-exclamation', label: 'Pending Claims',    value: stats.pendingClaimsCount,  color: '#d97706' },
    { icon: 'bi-shield-fill-x',      label: 'Reviewed Claims',   value: stats.reviewedClaimsCount, color: '#6b7280' },
    { icon: 'bi-credit-card-fill',   label: 'Premium Payments',  value: stats.paymentsCount,       color: '#2563eb' },
    { icon: 'bi-file-earmark-plus',  label: 'Issued Policies',   value: stats.issuedPoliciesCount, color: '#7c3aed' },
  ];

  const QUICK_ACTIONS = [
    { icon: 'bi-file-earmark-plus', label: 'Issue Policy',   to: '/staff/issue-policy',  color: '#0d9488' },
    { icon: 'bi-people',            label: 'View Clients',   to: '/staff/customers',     color: '#0ea5e9' },
    { icon: 'bi-shield-check',      label: 'View Policies',  to: '/staff/policies',      color: '#059669' },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle={`Welcome back, ${user?.name ?? 'Staff'} 👋`}
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
          <BentoCard title="Staff Actions" icon="bi-lightning-charge-fill" iconColor="#f59e0b">
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
          <BentoCard title="Recent Claims" icon="bi-shield-exclamation" iconColor="#d97706" linkTo="/staff/claims" linkLabel="View all">
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
            ) : recentClaims.length ? (
              <div className="d-flex flex-column gap-1">
                {recentClaims.map((claim, i) => (
                  <div
                    key={claim.claimId ?? i}
                    className="d-flex align-items-center gap-3 py-2 animate-fade-in"
                    style={{ borderBottom: i < recentClaims.length - 1 ? '1px solid var(--ip-border)' : 'none', cursor: 'pointer' }}
                    onClick={() => navigate(`/staff/claims/${claim.claimId}`)}
                  >
                    <div className="ip-bento-stat-icon" style={{ background: '#d9770618', width: 36, height: 36, borderRadius: 10 }}>
                      <i className="bi bi-shield-exclamation" style={{ color: '#d97706', fontSize: '0.9rem' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--ip-text-primary)' }}>
                        {claim.customerName ?? 'Customer'} — #{claim.claimNumber ?? claim.claimId}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--ip-text-muted)' }}>
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
          </BentoCard>
        </div>
      </div>

      {/* Bottom bento row */}
      <div className="ip-bento-grid cols-3 mb-4">
        {/* Recent Clients */}
        <div className="ip-bento-span-1">
          <BentoCard title="Recent Clients" icon="bi-people-fill" iconColor="#0d9488" linkTo="/staff/customers" linkLabel="View all">
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
            ) : recentCustomers.length ? (
              <div className="d-flex flex-column gap-1">
                {recentCustomers.map((c, i) => (
                  <div
                    key={c.customerId ?? i}
                    className="d-flex align-items-center gap-3 py-2 animate-fade-in"
                    style={{ borderBottom: i < recentCustomers.length - 1 ? '1px solid var(--ip-border)' : 'none', cursor: 'pointer' }}
                    onClick={() => navigate(`/staff/customers`)}
                  >
                    <div className="ip-bento-stat-icon" style={{ background: '#0d948818', width: 36, height: 36, borderRadius: 10 }}>
                      <i className="bi bi-person-fill" style={{ color: '#0d9488', fontSize: '0.9rem' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--ip-text-primary)' }}>
                        {c.fullName}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--ip-text-muted)' }}>
                        {c.email}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState icon="bi-people" message="No customers registered under your workspace" />
            )}
          </BentoCard>
        </div>

        {/* Recent Policies */}
        <div className="ip-bento-span-2">
          <BentoCard title="Recent Policies" icon="bi-file-earmark-text" iconColor="#3b82f6" linkTo="/staff/policies" linkLabel="View all">
            {loading ? (
              <div className="placeholder-glow">
                {[1, 2, 3, 4].map(i => (
                  <span key={i} className="placeholder col-12 d-block mb-2" style={{ height: 36, borderRadius: 8 }} />
                ))}
              </div>
            ) : recentPolicies.length ? (
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
                    {recentPolicies.map((p, i) => (
                      <tr key={p.policyId || p.id || i} onClick={() => navigate(`/staff/policies/${p.policyId || p.id}`)} style={{ cursor: 'pointer' }}>
                        <td style={{ fontWeight: 600 }}>#{p.policyId || p.id}</td>
                        <td>{p.customerName || 'Customer'}</td>
                        <td style={{ color: 'var(--ip-text-muted)' }}>{p.productName || 'Standard Plan'}</td>
                        <td style={{ fontWeight: 600 }}>₹{Number(p.premiumAmount || p.premium || 0).toLocaleString('en-IN')}</td>
                        <td><StatusBadge status={p.policyStatus || p.status} /></td>
                        <td style={{ color: 'var(--ip-text-muted)' }}>{p.startDate || '-'}</td>
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
      </div>
    </div>
  );
};

export default StaffDashboard;
