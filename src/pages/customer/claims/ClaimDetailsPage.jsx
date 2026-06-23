import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getClaimById } from "../../../services/claimService";
import PageHeader from "../../../components/common/PageHeader";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import StatusBadge from "../../../components/ui/StatusBadge";
import { FileText, ArrowLeft, ExternalLink, History, Upload } from "lucide-react";

const ClaimDetailsPage = () => {
  const { claimId } = useParams();
  const [claim, setClaim] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadClaim = async () => {
    try {
      setIsLoading(true);
      const response = await getClaimById(claimId);
      setClaim(response);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadClaim();
  }, []);

  

  if (isLoading) {
    return <LoadingSpinner text="Loading claim details..." />;
  }

  if (!claim) {
    return <div className="alert alert-warning">Claim not found</div>;
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        title={`Claim ${claim.claimNumber}`}
        subtitle="Detailed view of your claim"
        icon={FileText}
        action={
          <div className="d-flex gap-2">
            <Link
              to={`/customer/claims/history/${claim.claimId}`}
              className="btn btn-outline-primary"
            >
              <History size={18} className="me-2" />
              History
            </Link>
            <Link
              to={`/customer/claims/upload/${claim.claimId}`}
              className="btn btn-outline-warning text-dark"
            >
              <Upload size={18} className="me-2" />
              Upload Docs
            </Link>
            <Link to="/customer/claims" className="btn btn-outline-secondary">
              <ArrowLeft size={18} className="me-2" />
              Back
            </Link>
          </div>
        }
      />

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-bottom-0 pt-4 pb-0">
              <h5 className="card-title mb-0">Claim Information</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-sm-6">
                  <div className="p-3 bg-light rounded">
                    <small className="text-muted d-block mb-1">Status</small>
                    <StatusBadge status={claim.claimStatus} />
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="p-3 bg-light rounded">
                    <small className="text-muted d-block mb-1">Claim Amount</small>
                    <div className="fw-semibold">₹{claim.claimAmount?.toLocaleString()}</div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="p-3 bg-light rounded">
                    <small className="text-muted d-block mb-1">Reason</small>
                    <div>{claim.claimReason}</div>
                  </div>
                </div>
                {claim.agentRemarks && (
                  <div className="col-12">
                    <div className="p-3 bg-light rounded">
                      <small className="text-muted d-block mb-1">Agent Remarks</small>
                      <div>{claim.agentRemarks}</div>
                    </div>
                  </div>
                )}
                {claim.adminRemarks && (
                  <div className="col-12">
                    <div className="p-3 bg-light rounded border border-warning">
                      <small className="text-muted d-block mb-1">Admin Remarks</small>
                      <div>{claim.adminRemarks}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-bottom-0 pt-4 pb-0">
              <h5 className="card-title mb-0">Uploaded Documents</h5>
            </div>
            <div className="card-body">
              {claim.documents?.length > 0 ? (
                <div className="d-flex flex-column gap-3">
                  {claim.documents.map((doc, index) => (
                    <div key={index} className="d-flex align-items-center justify-content-between p-3 border rounded bg-light">
                      <div className="text-truncate me-3" style={{ maxWidth: "200px" }} title={doc.documentName}>
                        <span className="fw-medium small">{doc.documentName}</span>
                      </div>
                      <a
                        href={doc.documentReference}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-sm btn-primary"
                      >
                        <ExternalLink size={14} className="me-1" />
                        Open
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted p-4">
                  No documents uploaded yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimDetailsPage;