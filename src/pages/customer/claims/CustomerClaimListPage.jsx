import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyClaims } from "../../../services/claimService";
import PageHeader from "../../../components/common/PageHeader";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import StatusBadge from "../../../components/ui/StatusBadge";
import { FileText, Eye, History, Upload } from "lucide-react";

const CustomerClaimListPage = () => {
  const [claims, setClaims] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadClaims = async () => {
    try {
      setIsLoading(true);
      const response = await getMyClaims();
      setClaims(response.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadClaims();
  }, []);

  

  if (isLoading) {
    return <LoadingSpinner text="Loading claims..." />;
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="My Claims"
        subtitle="Manage and track your insurance claims"
        icon={FileText}
        action={
          <Link to="/customer/claims/raise" className="btn btn-primary">
            Raise Claim
          </Link>
        }
      />

      <div className="card border-0 shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Claim No</th>
                <th>Policy No</th>
                <th>Amount</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {claims.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">
                    No claims found
                  </td>
                </tr>
              ) : (
                claims.map((claim) => (
                  <tr key={claim.claimId}>
                    <td><span className="fw-medium">{claim.claimNumber}</span></td>
                    <td>{claim.policyNumber}</td>
                    <td>₹{claim.claimAmount?.toLocaleString()}</td>
                    <td><StatusBadge status={claim.claimStatus} /></td>
                    <td>
                      <div className="d-flex gap-2 justify-content-end">
                        <Link
                          to={`/customer/claims/${claim.claimId}`}
                          className="btn btn-sm btn-light"
                          title="View Details"
                        >
                          <Eye size={16} /> <span className="ms-1">View Details</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomerClaimListPage;