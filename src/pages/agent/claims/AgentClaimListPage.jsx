import { useEffect, useState } from "react";
import { getAllClaims } from "../../../services/claimService";
import { useNavigate, Link } from "react-router-dom";
import PageHeader from "../../../components/common/PageHeader";
import StatusBadge from "../../../components/ui/StatusBadge";
import { Eye } from "lucide-react";

const AgentClaimListPage = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadClaims = async () => {
      try {
        const data = await getAllClaims();
        setClaims(data.content || []);
      } catch (error) {
        console.error("Error loading claims:", error);
      } finally {
        setLoading(false);
      }
    };

    loadClaims();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Claims Management"
        subtitle="Review and process client claim requests"
      />

      {claims.length === 0 ? (
        <div className="alert alert-info" style={{ borderRadius: 12 }}>
          No Claims Available.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>Claim Number</th>
                <th>Customer Name</th>
                <th>Policy Number</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {claims.map((claim) => (
                <tr key={claim.claimId}>
                  <td style={{ fontWeight: 600 }}>{claim.claimNumber}</td>
                  <td style={{ fontWeight: 600 }}>{claim.customerName}</td>
                  <td>{claim.policyNumber}</td>
                  <td style={{ fontWeight: 600 }}>₹ {claim.claimAmount?.toLocaleString()}</td>
                  <td>
                    <StatusBadge status={claim.claimStatus} />
                  </td>
                  <td>
                    <Link
                      to={`/agent/claims/${claim.claimId}`}
                      className="btn btn-light btn-sm text-primary"
                      title="View Details"
                    >
                      <Eye size={16} /> <span className="ms-1">View Details</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AgentClaimListPage;