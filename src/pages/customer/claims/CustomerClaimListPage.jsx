import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyClaims } from "../../../services/claimService";

const CustomerClaimListPage = () => {
  const [claims, setClaims] = useState([]);

  useEffect(() => {
    loadClaims();
  }, []);

  const loadClaims = async () => {
    try {
      const response = await getMyClaims();
      
      console.log(response.data);
      setClaims(response.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between">
        <h2>My Claims</h2>

        <Link
          className="btn btn-success"
          to="/customer/claims/raise"
        >
          Raise Claim
        </Link>


      </div>

      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>Claim No</th>
            <th>Policy No</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Action</th>
            <th>Documents</th>
          </tr>
        </thead>

        <tbody>
          {claims.map((claim) => (
            <tr key={claim.claimId}>
              <td>{claim.claimNumber}</td>
              <td>{claim.policyNumber}</td>
              <td>₹{claim.claimAmount}</td>
              <td>{claim.claimStatus}</td>

              <td>
                <Link
                  to={`/customer/claims/${claim.claimId}`}
                  className="btn btn-success btn-sm"
                >
                  View Details
                </Link>
                <Link
                  className="btn btn-primary btn-sm"
                  to={`/customer/claims/history/${claim.claimId}`}
                >
                  History
                </Link>

                <Link
                  className="btn btn-warning btn-sm ms-2"
                  to={`/customer/claims/upload/${claim.claimId}`}
                >
                  Upload Docs
                </Link>
              </td>
              <td>
                {claim.documents?.length > 0 ? (
                  claim.documents.map((doc, index) => {

                    const isImage =
                      doc.documentType?.includes("image");

                    const isPdf =
                      doc.documentType?.includes("pdf");

                    return (
                      <div
                        key={index}
                        className="mb-3"
                      >
                        <div>
                          <strong>
                            {doc.documentName}
                          </strong>
                        </div>

                        {isImage && (
                          <img
                            src={doc.documentReference}
                            alt={doc.documentName}
                            width="120"
                            className="img-thumbnail mb-2"
                          />
                        )}

                        {isPdf && (
                          <div className="mb-2">
                            <span className="badge bg-danger">
                              PDF
                            </span>
                          </div>
                        )}

                        <a
                          href={doc.documentReference}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-info btn-sm"
                        >
                          View
                        </a>
                      </div>
                    );
                  })
                ) : (
                  <span>No Documents</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerClaimListPage;