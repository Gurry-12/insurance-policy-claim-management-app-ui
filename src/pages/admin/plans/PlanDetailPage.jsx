import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import PageHeader from '../../../components/common/PageHeader';
import StatusBadge from '../../../components/ui/StatusBadge';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ErrorAlert from '../../../components/ui/ErrorAlert';
import ConfirmModal from '../../../components/modals/ConfirmModal';
import { getPlanById, activatePlan, deactivatePlan } from '../../../services/planService';

const PlanDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchPlanData = (id) => {
    setLoading(true);
    setError('');
    getPlanById(id)
      .then((data) => {
        if (!data) {
          setError('Could not load plan details.');
        } else {
          setPlan(data);
        }
      })
      .catch((err) => {
        console.error("Plan fetch error:", err);
        setError(err.response?.data?.message || err.message || 'Could not load plan details.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPlanData(id);
  }, [id]);

  const handleStatusToggle = () => {
    const isActive = (plan?.activeStatus ?? plan?.active);
    const action = isActive ? deactivatePlan(id) : activatePlan(id);
    
    setActionLoading(true);
    setStatusModalOpen(false);
    
    action
      .then(() => {
        alert(`Plan ${isActive ? 'deactivated' : 'activated'} successfully!`);
        fetchPlanData();
      })
      .catch((err) => {
        alert(err.response?.data?.message || `Failed to ${isActive ? 'deactivate' : 'activate'} plan.`);
      })
      .finally(() => {
        setActionLoading(false);
      });
  };

  if (loading) {
    return <LoadingSpinner text="Loading plan details..." />;
  }

  if (error || !plan) {
    return (
      <div>
        <PageHeader 
          title="Plan Details" 
          subtitle="Viewing plan"
          onBack={() => navigate('/admin/plans')}
        />
        <ErrorAlert message={error || 'Plan not found.'} />
      </div>
    );
  }

  const name = plan.planName || 'N/A';
  const productName = plan.productName || 'N/A';
  const premium = plan.premiumAmount || 0;
  const coverage = plan.coverageAmount || 0;
  const duration = plan.duration || 'N/A';
  const premiumType = plan.premiumType || 'N/A';
  const terms = plan.termsAndConditions || 'No special terms and conditions specified.';
  const status = (plan.activeStatus ?? plan.active) ? 'Active' : 'InActive';

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <PageHeader 
        title="Plan Details" 
        subtitle={`Viewing details for ${name}`}
        onBack={() => navigate('/admin/plans')}
        action={
          <div className="d-flex gap-2">
            {status === 'Active' ? (
              <button 
                className="btn btn-outline-warning d-flex align-items-center gap-2" 
                style={{ borderRadius: '8px' }}
                onClick={() => setStatusModalOpen(true)}
                disabled={actionLoading}
              >
                <i className="bi bi-dash-circle"></i>
                Deactivate
              </button>
            ) : (
              <button 
                className="btn btn-outline-success d-flex align-items-center gap-2" 
                style={{ borderRadius: '8px' }}
                onClick={() => setStatusModalOpen(true)}
                disabled={actionLoading}
              >
                <i className="bi bi-check-circle"></i>
                Activate
              </button>
            )}
            <button 
              className="btn btn-primary d-flex align-items-center gap-2" 
              style={{ borderRadius: '8px' }}
              onClick={() => navigate(`/admin/plans/edit/${id}`)}
              disabled={actionLoading}
            >
              <i className="bi bi-pencil-square"></i>
              Edit Plan
            </button>
          </div>
        }
      />

      <div className="row g-4">
        {/* Left Card: Fast Stats */}
        <div className="col-lg-4">
          <div className="card border-0 mb-4" style={{ borderRadius: 16, boxShadow: 'var(--ss-shadow)' }}>
            <div className="card-body p-4 text-center">
              <div className="mb-3 d-flex justify-content-center">
                <div style={{
                  width: 64, height: 64, borderRadius: 14, backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem'
                }}>
                  <i className="bi bi-shield-check"></i>
                </div>
              </div>
              <h5 className="fw-bold mb-1">{name}</h5>
              <p className="text-muted mb-3">
                Product: <Link to={`/admin/products/${plan.productId}`} className="text-decoration-none fw-bold text-primary">{productName}</Link>
              </p>
              <div className="d-flex justify-content-center gap-2 mb-2">
                <StatusBadge status={status} />
              </div>
            </div>
          </div>

          <div className="card border-0" style={{ borderRadius: 16, boxShadow: 'var(--ss-shadow)' }}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3">Coverage & Details</h6>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Premium Term:</span>
                <span className="fw-medium text-capitalize">{premiumType.toLowerCase()}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Duration:</span>
                <span className="fw-medium">{duration} Months</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Financials & Terms */}
        <div className="col-lg-8">
          <div className="card border-0 mb-4" style={{ borderRadius: 16, boxShadow: 'var(--ss-shadow)' }}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3">Financial Structure</h6>
              <div className="row">
                <div className="col-md-6 mb-3 mb-md-0">
                  <div className="p-3 bg-light rounded-3">
                    <small className="text-muted d-block fw-bold mb-1">Base Premium</small>
                    <h3 className="fw-bold m-0 text-primary">₹{premium.toLocaleString('en-IN')}</h3>
                    <small className="text-muted">{premiumType} payment</small>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-3 bg-light rounded-3">
                    <small className="text-muted d-block fw-bold mb-1">Sum Assured / Coverage</small>
                    <h3 className="fw-bold m-0 text-success">₹{coverage.toLocaleString('en-IN')}</h3>
                    <small className="text-muted">Maximum claimable limit</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card border-0" style={{ borderRadius: 16, boxShadow: 'var(--ss-shadow)' }}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3">Terms & Conditions</h6>
              <div className="p-3 rounded-3" style={{ backgroundColor: 'rgba(249, 250, 251, 1)', borderLeft: '4px solid var(--ss-primary)' }}>
                <p className="mb-0 text-secondary" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                  {terms}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal 
        isOpen={statusModalOpen}
        title={status === 'Active' ? "Deactivate Plan" : "Activate Plan"}
        message={status === 'Active' 
          ? "Are you sure you want to deactivate this plan? This will make the plan options unavailable for customers." 
          : "Are you sure you want to activate this plan?"}
        isDanger={status === 'Active'}
        confirmText={status === 'Active' ? "Deactivate" : "Activate"}
        onCancel={() => setStatusModalOpen(false)}
        onConfirm={handleStatusToggle}
      />
    </div>
  );
};

export default PlanDetailPage;
