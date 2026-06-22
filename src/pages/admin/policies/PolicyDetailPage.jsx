import  { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../../components/common/PageHeader';
import StatusBadge from '../../../components/ui/StatusBadge';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ErrorAlert from '../../../components/ui/ErrorAlert';
import { getPolicyById, cancelPolicy } from '../../../services/policyService';

const PolicyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    getPolicyById(id)
      .then(setPolicy)
      .catch((err) => {
        console.error("Policy fetch error:", err);
        setError(err.response?.data?.message || err.message || 'Could not load policy details.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleCancel = () => {
    if (!window.confirm('Are you sure you want to cancel this policy?')) return;
    
    setCancelling(true);
    cancelPolicy(id)
      .then(() => {
        alert('Policy cancelled successfully!');
        // Refresh details
        return getPolicyById(id).then(setPolicy);
      })
      .catch(() => alert('Failed to cancel the policy.'))
      .finally(() => setCancelling(false));
  };

  if (loading) {
    return <LoadingSpinner text="Loading policy details..." />;
  }

  if (error || !policy) {
    return (
      <div>
        <PageHeader 
          title="Policy Details" 
          subtitle="Viewing policy details"
          onBack={() => navigate('/admin/policies')}
        />
        <ErrorAlert message={error || 'Policy not found.'} />
      </div>
    );
  }

  const customerName = policy.customerName || 'Customer';
  const planName = policy.planName || 'Insurance Plan';
  const premium = policy.premiumAmount || policy.totalPremiumPaid || 0;
  const status = policy.policyStatus || 'Active';
  const startDate = policy.startDate || 'N/A';
  const endDate = policy.endDate || 'N/A';
  const coverageAmount = policy.coverageAmount || 0;
  const premiumType = policy.premiumType || 'N/A';
  const productType = policy.productType || 'N/A';

  // Fallback default coverage benefits if details are not present
  const coverageDetails = policy.coverageDetails || [
    { benefit: 'Coverage Amount', detail: `₹${coverageAmount.toLocaleString('en-IN')}` },
    { benefit: 'Premium Term', detail: premiumType },
    { benefit: 'Product Category', detail: productType },
    { benefit: 'Cashless Hospitalization', detail: 'Supported at network hospitals' },
    { benefit: 'Pre & Post Care', detail: 'Covered according to standard plan terms' }
  ];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <PageHeader 
        title="Policy Details" 
        subtitle={`Viewing details for Policy #${policy.policyNumber || policy.policyId}`}
        onBack={() => navigate('/admin/policies')}
      />

      <div className="row g-4">
        {/* Left Side: Summary and Actions */}
        <div className="col-lg-4">
          <div className="card border-0 mb-4" style={{ borderRadius: 16, boxShadow: 'var(--ss-shadow)' }}>
            <div className="card-body p-4 text-center">
              <div className="mb-3 d-flex justify-content-center">
                <div style={{
                  width: 64, height: 64, borderRadius: 14, backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem'
                }}>
                  <i className="bi bi-file-earmark-text"></i>
                </div>
              </div>
              <h5 className="fw-bold mb-1">#{policy.policyNumber || policy.policyId}</h5>
              <p className="text-muted mb-3">{planName}</p>
              <div className="d-flex justify-content-center gap-2 mb-2">
                <StatusBadge status={status} />
                <span className="badge rounded-pill bg-success-subtle text-success border border-success-subtle px-3 py-2" style={{ fontSize: '0.72rem' }}>
                  Paid
                </span>
              </div>

              <hr className="my-4" style={{ borderColor: 'var(--ss-border-light)' }} />

              <div className="text-start mb-4">
                <div className="mb-3">
                  <small className="text-muted d-block fw-bold">Premium Amount</small>
                  <span className="fs-5 fw-bold text-dark">₹{premium.toLocaleString('en-IN')}</span>
                </div>
                <div className="mb-3">
                  <small className="text-muted d-block fw-bold">Start Date</small>
                  <span>{startDate}</span>
                </div>
                <div className="mb-3">
                  <small className="text-muted d-block fw-bold">Expiry Date</small>
                  <span>{endDate}</span>
                </div>
              </div>

              {status !== 'CANCELLED' && status !== 'Expired' && (
                <button 
                  className="btn btn-outline-danger w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                  style={{ borderRadius: '8px' }}
                  onClick={handleCancel}
                  disabled={cancelling}
                >
                  <i className="bi bi-x-circle"></i>
                  {cancelling ? 'Cancelling...' : 'Cancel Policy'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Plan Coverage & Customer Details */}
        <div className="col-lg-8">
          {/* Customer Card */}
          <div className="card border-0 mb-4" style={{ borderRadius: 16, boxShadow: 'var(--ss-shadow)' }}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3 text-primary">
                <i className="bi bi-person-fill me-2"></i>Customer Information
              </h6>
              <div className="row g-3">
                <div className="col-sm-6">
                  <small className="text-muted d-block">Full Name</small>
                  <span className="fw-bold">{customerName}</span>
                </div>
                <div className="col-sm-6">
                  <small className="text-muted d-block">Customer ID</small>
                  <span>#{policy.customerId || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Coverage Details Card */}
          <div className="card border-0" style={{ borderRadius: 16, boxShadow: 'var(--ss-shadow)' }}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3 text-primary">
                <i className="bi bi-shield-check me-2"></i>Coverage & Benefits
              </h6>
              
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0" style={{ fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ color: 'var(--ss-text-muted)', fontSize: '0.74rem', textTransform: 'uppercase' }}>
                      <th className="border-0 px-0">Benefit / Clause</th>
                      <th className="border-0 px-0">Detail</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coverageDetails.map((detail, idx) => (
                      <tr key={idx}>
                        <td className="px-0 fw-bold text-dark" style={{ width: '40%' }}>{detail.benefit}</td>
                        <td className="px-0 text-muted">{detail.detail}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyDetailPage;
