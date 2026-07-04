import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FormTextarea from '../../../components/forms/FormTextarea';
import StatusBadge from '../../../components/ui/StatusBadge';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ErrorAlert from '../../../components/ui/ErrorAlert';
import { getClaimById, approveClaim, rejectClaim } from '../../../services/claimService';
import { getPolicyById } from '../../../services/policyService';
import toast from 'react-hot-toast';
import useClaimPdf from '../../../hooks/PdfDownload/useClaimPdf';
import DocumentPreviewModal from '../../../components/modals/DocumentPreviewModal';
import Drawer from '../../../components/ui/Drawer';

const ClaimDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { downloadClaim } = useClaimPdf();
  const [claim, setClaim] = useState(null);
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [remark, setRemark] = useState('');
  const [actionModal, setActionModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);

  const fetchClaimData = (id) => {
    setLoading(true);
    getClaimById(id)
      .then(async (claimData) => {
        setClaim(claimData);
        if (claimData?.policyId) {
          try {
            const policyData = await getPolicyById(claimData.policyId);
            setPolicy(policyData);
          } catch (e) {
            console.error("Policy fetch error:", e);
          }
        }
      })
      .catch((err) => {
        console.error("Claim fetch error:", err);
        setError(err.response?.data?.message || err.message || 'Could not load claim details.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchClaimData(id);
  }, [id]);

  const handleAction = (type) => {
    if (!remark.trim()) {
      toast.error('Remarks are required to process the claim.');
      return;
    }

    setActionLoading(true);
    const apiCall = type === 'approve'
      ? approveClaim(id, { remarks: remark })
      : rejectClaim(id, remark);

    apiCall
      .then(() => {
        toast.success(`Claim ${type === 'approve' ? 'approved' : 'rejected'} successfully!`);
        setActionModal(false);
        setRemark('');
        fetchClaimData(id);
      })
      .catch(() => {
        toast.error('Failed to process claim action.');
      })
      .finally(() => {
        setActionLoading(false);
      });
  };

  const {
    claimAmount = 0,
    claimStatus = '',
    createdDate,
    claimReason = 'No reason provided',
    incidentDate,
    documents = [],
    customerName = 'Unknown'
  } = claim || {};

  const dateFiled = createdDate?.split('T')[0] || 'N/A';
  const reason = claimReason;
  const amount = claimAmount;
  const status = claimStatus;

  return (
    <Drawer 
      isOpen={true} 
      onClose={() => navigate('/admin/claims')} 
      title={claim ? `Reviewing Claim #${claim.claimNumber || claim.id}` : 'Claim Details'}
      width="900px"
    >
      <div className="p-4">
        {loading && <LoadingSpinner text="Loading claim details..." />}
        {error && !claim && <ErrorAlert message={error || 'Claim not found.'} />}
        
        {!loading && claim && (
          <>
            <div className="d-flex justify-content-end gap-2 mb-4">
              <button
                className="btn btn-outline-danger d-flex align-items-center gap-1"
                style={{ borderRadius: '8px' }}
                onClick={() => downloadClaim(claim)}
              >
                <i className="bi bi-file-earmark-pdf"></i> PDF
              </button>
              <button
                className="btn btn-outline-secondary d-flex align-items-center gap-1"
                style={{ borderRadius: '8px' }}
                onClick={() => navigate(`/admin/claims/${id}/history`)}
              >
                <i className="bi bi-clock-history"></i> History
              </button>
              {(status?.toUpperCase() === 'RECOMMENDED_FOR_APPROVAL' || status?.toUpperCase() === 'RECOMMENDED_FOR_REJECTION') && (
                <button 
                  className="btn btn-primary fw-bold" 
                  style={{ borderRadius: '8px' }}
                  onClick={() => setActionModal(true)}
                >
                  Final Decision
                </button>
              )}
            </div>

            <div className="row g-4">
              {/* Main Details */}
              <div className="col-12">
                <div className="card border-0 mb-4 bg-white" style={{ borderRadius: 16, boxShadow: 'var(--ip-shadow-sm)' }}>
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h6 className="fw-bold m-0">Claim Information</h6>
                      <StatusBadge status={status} />
                    </div>

                    <div className="row mb-4">
                      <div className="col-md-4 mb-3">
                        <small className="text-muted d-block fw-bold mb-1">Claim Amount</small>
                        <h4 className="fw-bold m-0 text-primary">₹{amount.toLocaleString('en-IN')}</h4>
                      </div>
                      <div className="col-md-4 mb-3">
                        <small className="text-muted d-block fw-bold mb-1">Date Filed</small>
                        <span>{dateFiled}</span>
                      </div>
                      {incidentDate && (
                        <div className="col-md-4 mb-3">
                          <small className="text-muted d-block fw-bold mb-1">Incident Date</small>
                          <span>{new Date(incidentDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      
                      <div className="col-12 mt-2 mb-3">
                        <small className="text-muted d-block fw-bold mb-1">Reason / Description</small>
                        <p className="mb-0" style={{ color: 'var(--ip-text-secondary)' }}>{reason}</p>
                      </div>

                      {policy && (
                        <>
                          <div className="col-md-4 mt-3">
                            <small className="text-muted d-block fw-bold mb-1">Total Coverage</small>
                            <span className="fw-bold">₹{Number(policy.coverageAmount || 0).toLocaleString('en-IN')}</span>
                          </div>
                          <div className="col-md-4 mt-3">
                            <small className="text-muted d-block fw-bold mb-1">Remaining Coverage</small>
                            <span className="fw-bold text-success">₹{Number(policy.remainingClaimAmount ?? policy.coverageAmount ?? 0).toLocaleString('en-IN')}</span>
                          </div>
                        </>
                      )}

                      <div className="col-md-4 mt-3">
                        <small className="text-muted d-block fw-bold mb-1">Assigned Staff</small>
                        <span>{claim.assignedStaffName || <span className="text-muted">Unassigned</span>}</span>
                      </div>

                      {claim.staffRemarks && (
                        <div className="col-12 mt-4 p-3 bg-light rounded-3 border-start border-4 border-primary">
                          <small className="text-muted d-block fw-bold mb-1">Staff's Recommendation Remarks</small>
                          <p className="mb-0 text-dark">{claim.staffRemarks}</p>
                        </div>
                      )}
                      {claim.adminRemarks && (
                        <div className="col-12 mt-3 p-3 bg-light rounded-3 border-start border-4 border-warning">
                          <small className="text-muted d-block fw-bold mb-1">Admin Remarks</small>
                          <p className="mb-0 text-dark">{claim.adminRemarks}</p>
                        </div>
                      )}
                    </div>

                    <hr className="my-4" style={{ borderColor: 'var(--ip-border-light)' }} />

                    <h6 className="fw-bold mb-3">Attached Documents</h6>
                    {documents.length > 0 ? (
                      <div className="d-flex flex-column gap-2 mb-4">
                        {documents.map((doc, idx) => {
                          const isPdf = doc.documentType?.includes('pdf') || doc.documentName?.endsWith('.pdf');
                          return (
                            <div key={idx} className="d-flex justify-content-between align-items-center p-3 border rounded-3" style={{ borderColor: 'var(--ip-border-light)' }}>
                              <div className="d-flex align-items-center gap-3">
                                <i className={`bi ${isPdf ? 'bi-file-earmark-pdf text-danger' : 'bi-file-earmark-image text-primary'} fs-4`}></i>
                                <div>
                                  <div className="fw-bold" style={{ fontSize: '0.9rem' }}>{doc.documentName || `Document-${idx+1}`}</div>
                                  <div className="text-muted" style={{ fontSize: '0.78rem' }}>{doc.documentType || 'File'}</div>
                                </div>
                              </div>
                              {doc.documentReference && (
                                <button 
                                  onClick={() => setPreviewDoc(doc)}
                                  className="btn btn-sm btn-light text-primary d-flex align-items-center gap-1"
                                  style={{ borderRadius: 6 }}
                                >
                                  <i className="bi bi-eye"></i> Preview
                                </button>
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

              {/* Customer Details */}
              <div className="col-12">
                <div className="card border-0 mb-4 bg-white" style={{ borderRadius: 16, boxShadow: 'var(--ip-shadow-sm)' }}>
                  <div className="card-body p-4">
                    <h6 className="fw-bold mb-4">Customer Details</h6>
                    <div className="d-flex gap-5">
                      <div>
                        <small className="text-muted d-block fw-bold mb-1">Name</small>
                        <span>{customerName}</span>
                      </div>
                      <div>
                        <small className="text-muted d-block fw-bold mb-1">Policy Number</small>
                        <span className="text-primary fw-bold" style={{ cursor: 'pointer' }} onClick={() => navigate(`/admin/policies/${claim.policyId}`)}>{claim.policyNumber || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {actionModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow" style={{ borderRadius: '12px' }}>
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">Final Decision</h5>
                <button type="button" className="btn-close" onClick={() => setActionModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Please review the Staff's remarks and provide your final decision.</p>
                
                <div className="bg-light p-3 rounded mb-3 border-start border-4 border-primary">
                  <small className="fw-bold text-muted d-block mb-1">Staff's Remarks</small>
                  <p className="mb-0">{claim.staffRemarks || 'No remarks provided.'}</p>
                </div>

                <FormTextarea 
                  label="Admin Remarks (Required)" 
                  name="remark" 
                  value={remark} 
                  onChange={(e) => setRemark(e.target.value)} 
                  placeholder="Add your justification for this decision here..."
                  rows={3}
                  required
                />
              </div>
              <div className="modal-footer border-0 pt-0 justify-content-between">
                <button className="btn btn-outline-secondary" onClick={() => setActionModal(false)} disabled={actionLoading}>
                  Cancel
                </button>
                <div className="d-flex gap-2">
                  <button className="btn btn-danger" onClick={() => handleAction('reject')} disabled={actionLoading}>
                    {actionLoading ? 'Processing...' : 'Reject Claim'}
                  </button>
                  <button className="btn btn-success" onClick={() => handleAction('approve')} disabled={actionLoading}>
                    {actionLoading ? 'Processing...' : 'Approve Claim'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <DocumentPreviewModal
        isOpen={!!previewDoc}
        onClose={() => setPreviewDoc(null)}
        documentUrl={previewDoc?.documentReference}
        documentName={previewDoc?.documentName}
      />
    </Drawer>
  );
};

export default ClaimDetailPage;
