import { useEffect, useState } from "react";
import { getAllClaims } from "../../../services/claimService";
import { useNavigate, Link } from "react-router-dom";
import PageHeader from "../../../components/common/PageHeader";
import StatusBadge from "../../../components/ui/StatusBadge";
import { Eye } from "lucide-react";
import useClaimPdf from "../../../hooks/PdfDownload/useClaimPdf";

const AgentClaimListPage = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const { downloadClaim } = useClaimPdf();


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

  //filter
   const filteredClaims = claims.filter((claim) =>
  claim.claimNumber?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
  claim.customerName?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
  claim.claimAmount?.toString().includes(searchTerm) ||
  claim.policyNumber?.toString().toLowerCase().includes(searchTerm.toLowerCase())
);
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
        title="claim Management"
        subtitle="Track your client  claims"
        action={
          <button className="btn btn-secondary d-flex align-items-center gap-1" onClick={() => navigate("/agent/dashboard")}>
            <i className="bi bi-arrow-left"></i> Back
          </button>
        }
      />
      
{/* /filter search bar */}
{/* ADD SEARCH BAR HERE */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by Claim ID, Customer Name, Amount or Policy Number"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {claims.length === 0 ? (
        <div className="alert alert-info" style={{ borderRadius: 12 }}>
          No Claims Available.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Claim Number</th>
                <th>Customer Name</th>
                <th>Policy Number</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
                <th>Download</th>
              </tr>
            </thead>


            <tbody>
        {filteredClaims.map((claim, index) => (
          <tr key={claim.claimId}>
              <td>{index + 1}</td>
            <td style={{ fontWeight: 600 }}>
              {claim.claimNumber}
            </td>

            <td style={{ fontWeight: 600 }}>
              {claim.customerName}
            </td>
                       

            <td>{claim.policyNumber}</td>

            <td style={{ fontWeight: 600 }}>
              ₹ {claim.claimAmount?.toLocaleString()}
            </td>

            <td><StatusBadge status={claim.claimStatus} /></td>
            

           <td>
            <Link
              to={`/agent/claims/${claim.claimId}`}
              className="btn btn-light btn-sm text-primary"
               title="View Details"
        >
          <Eye size={16} />
          <span className="ms-1">View Details</span>
        </Link>
      </td>
      <td>
    <button
        className="btn btn-danger btn-sm"
        onClick={() => downloadClaim(claim)}
    >
        <i className="bi bi-download me-1"></i>
        PDF
    </button>
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