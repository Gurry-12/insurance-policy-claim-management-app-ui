import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../../components/common/PageHeader';
import StatusBadge from '../../../components/ui/StatusBadge';
import ConfirmModal from '../../../components/modals/ConfirmModal';
import FormTextarea from '../../../components/forms/FormTextarea';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ErrorAlert from '../../../components/ui/ErrorAlert';
import { getClaimById, approveClaim, rejectClaim } from '../../../services/claimService';

const ClaimDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [remark, setRemark] = useState('');
  const [actionModal, setActionModal] = useState({ isOpen: false, type: null });
  const [actionLoading, setActionLoading] = useState(false);

  const fetchClaimData = (id) => {
    setLoading(true);
    Promise.all([
      getClaimById(id),
    ])
      .then(([claimData]) => {
        setClaim(claimData);
      })
      .catch((err) => {
        console.error("Claim fetch error:", err);
        setError(err.response?.data?.message || err.message || 'Could not load claim details.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchClaimData(id);
  }, [id]);

  const handleAction = () => {
    if (!remark.trim()) {
      alert('Remarks are required to process the claim.');
      return;
    }

    setActionLoading(true);
    const apiCall = actionModal.type === 'approve'
      ? approveClaim(id, { remarks: remark })
      : rejectClaim(id, remark);

    apiCall
      .then(() => {
        alert(`Claim ${actionModal.type === 'approve' ? 'approved' : 'rejected'} successfully!`);
        setActionModal({ isOpen: false, type: null });
        setRemark('');
        fetchClaimData();
      })
      .catch(() => {
        alert('Failed to process claim action.');
        setLoading(false);
      })
      .finally(() => {
        setActionLoading(false);
      });
  };

  if (loading) {
    return <LoadingSpinner text="Loading claim details..." />;
  }

  if (error || !claim) {
    return (
      <div>
        <PageHeader 
          title="Claim Details" 
          subtitle="Reviewing claim"
          onBack={() => navigate('/admin/claims')}
        />
        <ErrorAlert message={error || 'Claim not found.'} />
      </div>
    );
  }

  const customerName = claim.customerName || 'Customer';
  const customerPhone = claim.customerPhone || 'N/A';
  const amount = claim.claimAmount || claim.amount || 0;
  const status = claim.claimStatus || claim.status || 'Pending';
  const documents = claim.documents || [];
  const reason = claim.claimReason || claim.reason || 'No description provided.';
  const dateFiled = claim.createdDate?.split('T')[0] || claim.dateFiled || 'N/A';

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <PageHeader 
        title="Claim Details" 
        subtitle={`Reviewing Claim #${claim.claimNumber || claim.id}`}
        onBack={() => navigate('/admin/claims')}
        action={
          status?.toUpperCase() !== 'APPROVED' && status?.toUpperCase() !== 'REJECTED' && (
            <div className="d-flex gap-2">
              <button 
                className="btn btn-outline-danger" 
                style={{ borderRadius: '8px' }}
                onClick={() => setActionModal({ isOpen: true, type: 'reject' })}
              >
                Reject
              </button>
              <button 
                className="btn btn-success" 
                style={{ borderRadius: '8px' }}
                onClick={() => setActionModal({ isOpen: true, type: 'approve' })}
              >
                Approve
              </button>
            </div>
          )
        }
      />

      <div className="row g-4">
        {/* Main Details */}
        <div className="col-lg-8">
          <div className="card border-0 mb-4" style={{ borderRadius: 16, boxShadow: 'var(--ss-shadow)' }}>
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h6 className="fw-bold m-0">Claim Information</h6>
                <StatusBadge status={status} />
              </div>

              <div className="row mb-4">
                <div className="col-md-6 mb-3">
                  <small className="text-muted d-block fw-bold mb-1">Claim Amount</small>
                  <h4 className="fw-bold m-0 text-primary">₹{amount.toLocaleString('en-IN')}</h4>
                </div>
                <div className="col-md-6 mb-3">
                  <small className="text-muted d-block fw-bold mb-1">Date Filed</small>
                  <span>{dateFiled}</span>
                </div>
                <div className="col-12 mt-2">
                  <small className="text-muted d-block fw-bold mb-1">Reason / Description</small>
                  <p className="mb-0" style={{ color: 'var(--ss-text-secondary)' }}>{reason}</p>
                </div>
                {claim.incidentDate && (
                  <div className="col-md-6 mt-3">
                    <small className="text-muted d-block fw-bold mb-1">Incident Date</small>
                    <span>{claim.incidentDate}</span>
                  </div>
                )}
                {claim.adminRemarks && (
                  <div className="col-12 mt-3 p-3 bg-light rounded-3">
                    <small className="text-muted d-block fw-bold mb-1">Admin Remarks</small>
                    <p className="mb-0 text-dark">{claim.adminRemarks}</p>
                  </div>
                )}
              </div>

              <hr className="my-4" style={{ borderColor: 'var(--ss-border-light)' }} />

              <h6 className="fw-bold mb-3">Attached Documents</h6>
              {documents.length > 0 ? (
                <div className="d-flex flex-column gap-2 mb-4">
                  {documents.map((doc, idx) => {
                    const isPdf = doc.documentType?.includes('pdf') || doc.documentName?.endsWith('.pdf');
                    return (
                      <div key={idx} className="d-flex justify-content-between align-items-center p-3 border rounded-3" style={{ borderColor: 'var(--ss-border-light)' }}>
                        <div className="d-flex align-items-center gap-3">
                          <i className={`bi ${isPdf ? 'bi-file-earmark-pdf text-danger' : 'bi-file-earmark-image text-primary'} fs-4`}></i>
                          <div>
                            <div className="fw-bold" style={{ fontSize: '0.9rem' }}>{doc.documentName || `Document-${idx+1}`}</div>
                            <div className="text-muted" style={{ fontSize: '0.78rem' }}>{doc.documentType || 'File'}</div>
                          </div>
                        </div>
                        {doc.documentReference && (
                          <a 
                            href={doc.documentReference} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="btn btn-sm btn-light text-primary d-flex align-items-center gap-1"
                            style={{ borderRadius: 6 }}
                          >
                            <i className="bi bi-box-arrow-up-right"></i> View
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted my-2 mb-4">No documents attached to this claim.</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="col-lg-4">
          <div className="card border-0 mb-4" style={{ borderRadius: 16, boxShadow: 'var(--ss-shadow)' }}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-4">Customer Details</h6>
              <div className="mb-3">
                <small className="text-muted d-block fw-bold mb-1">Name</small>
                <span>{customerName}</span>
              </div>
              <div className="mb-3">
                <small className="text-muted d-block fw-bold mb-1">Phone</small>
                <span>{customerPhone}</span>
              </div>
              <div className="mb-3">
                <small className="text-muted d-block fw-bold mb-1">Policy ID</small>
                <span className="text-primary fw-bold" style={{ cursor: 'pointer' }}>{claim.policyId || claim.policyNumber || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal 
        isOpen={actionModal.isOpen}
        title={actionModal.type === 'approve' ? "Approve Claim" : "Reject Claim"}
        message={
          <div>
            <p>Are you sure you want to {actionModal.type} this claim of <strong>₹{amount.toLocaleString('en-IN')}</strong>?</p>
            <FormTextarea 
              label="Admin Remarks (Required)" 
              name="remark" 
              value={remark} 
              onChange={(e) => setRemark(e.target.value)} 
              placeholder="Add your comments here..."
              rows={3}
              required
            />
          </div>
        }
        isDanger={actionModal.type === 'reject'}
        confirmText={actionLoading ? "Processing..." : (actionModal.type === 'approve' ? "Confirm Approval" : "Confirm Rejection")}
        onCancel={() => {
          setActionModal({ isOpen: false, type: null });
          setRemark('');
        }}
        onConfirm={handleAction}
      />
    </div>
  );
};

export default ClaimDetailPage;
