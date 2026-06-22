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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerClaimListPage;