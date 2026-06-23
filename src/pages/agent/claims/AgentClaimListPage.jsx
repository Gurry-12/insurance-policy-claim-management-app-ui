import { useEffect, useState } from "react";
import {
  getAllClaims,
  markUnderReview,
  reviewClaim,
} from "../../../services/claimService";
import { useNavigate } from "react-router-dom";

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

  const handleReview = async (claimId) => {
    try {
      await reviewClaim(claimId);

      setClaims((prevClaims) =>
        prevClaims.map((claim) =>
          claim.claimId === claimId
            ? { ...claim, claimStatus: "REVIEWED" }
            : claim
        )
      );

      alert("Claim reviewed successfully");
    } catch (error) {
      console.error("Review Error:", error);
      alert("Failed to review claim");
    }
  };

  const handleUnderReview = async (claimId) => {
    try {
      await markUnderReview(claimId);

      setClaims((prevClaims) =>
        prevClaims.map((claim) =>
          claim.claimId === claimId
            ? { ...claim, claimStatus: "UNDER_REVIEW" }
            : claim
        )
      );

      alert("Claim moved to Under Review");
    } catch (error) {
      console.error("Under Review Error:", error);
      alert("Failed to update claim");
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-success";

      case "REJECTED":
        return "bg-danger";

      case "UNDER_REVIEW":
        return "bg-warning text-dark";

      case "REVIEWED":
        return "bg-info";

      default:
        return "bg-secondary";
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <h4>Loading Claims...</h4>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">Claims Management</h3>
        </div>

            <div className="d-flex justify-content-end mb-3">
          <button    
        className="btn btn-secondary mb-3"
        onClick={() => navigate("/agent/dashboard")}
      > Back </button>

      </div>
        <div className="card-body">
          {claims.length === 0 ? (
            <div className="alert alert-info">
              No Claims Available.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>Claim ID</th>
                    <th>Claim Number</th>
                    <th>Customer Name</th>
                    <th>Policy Number</th>
                    <th>Amount</th>
                    <th>Reason</th>
                    <th>Incident Date</th>
                    <th>Status</th>
                    <th>Created Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {claims.map((claim) => (
                    <tr key={claim.claimId}>
                      <td>{claim.claimId}</td>
                      <td>{claim.claimNumber}</td>
                      <td>{claim.customerName}</td>
                      <td>{claim.policyNumber}</td>
                      <td>₹ {claim.claimAmount}</td>
                      <td>{claim.claimReason}</td>

                      <td>
                        {claim.incidentDate
                          ? new Date(
                              claim.incidentDate
                            ).toLocaleDateString()
                          : "-"}
                      </td>

                      <td>
                        <span
                          className={`badge ${getStatusClass(
                            claim.claimStatus
                          )}`}
                        >
                          {claim.claimStatus}
                        </span>
                      </td>

                      <td>
                        {claim.createdDate
                          ? new Date(
                              claim.createdDate
                            ).toLocaleDateString()
                          : "-"}
                      </td>

                      <td>
                        <div className="d-flex gap-2 flex-wrap">
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() =>
                              handleReview(claim.claimId)
                            }
                            disabled={
                              claim.claimStatus === "REVIEWED" ||
                              claim.claimStatus === "UNDER_REVIEW" ||
                              claim.claimStatus === "APPROVED" ||
                              claim.claimStatus === "REJECTED"
                            }
                          >
                            Review
                          </button>

                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() =>
                              handleUnderReview(claim.claimId)
                            }
                            disabled={
                              claim.claimStatus === "UNDER_REVIEW" ||
                              claim.claimStatus === "APPROVED" ||
                              claim.claimStatus === "REJECTED"
                            }
                          >
                            Under Review
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentClaimListPage;