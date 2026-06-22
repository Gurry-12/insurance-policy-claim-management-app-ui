import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getClaimById } from "../../../services/claimService";

const ClaimDetailsPage = () => {
  const { claimId } = useParams();

  const [claim, setClaim] = useState(null);

  useEffect(() => {
    loadClaim();
  }, []);

  const loadClaim = async () => {
    try {
      const response = await getClaimById(claimId);

      setClaim(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!claim) {
    return <h4>Loading...</h4>;
  }

  return (
    <div className="container mt-4">

      <h2>Claim Details</h2>

      <div className="card p-3">

        <p>
          <strong>Claim Number:</strong>{" "}
          {claim.claimNumber}
        </p>

        <p>
          <strong>Status:</strong>{" "}
          {claim.claimStatus}
        </p>

        <p>
          <strong>Amount:</strong> ₹
          {claim.claimAmount}
        </p>

        <p>
          <strong>Reason:</strong>{" "}
          {claim.claimReason}
        </p>

        <p>
          <strong>Agent Remarks:</strong>{" "}
          {claim.agentRemarks || "N/A"}
        </p>

        <p>
          <strong>Admin Remarks:</strong>{" "}
          {claim.adminRemarks || "N/A"}
        </p>

        <hr />

        <h4>Uploaded Documents</h4>

        {claim.documents?.length > 0 ? (
          claim.documents.map((doc, index) => (
            <div key={index} className="mb-2">

              <strong>
                {doc.documentName}
              </strong>

              <br />

              <a
                href={doc.documentReference}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary btn-sm"
              >
                Open
              </a>

            </div>
          ))
        ) : (
          <p>No Documents Uploaded</p>
        )}

      </div>
    </div>
  );
};

export default ClaimDetailsPage;