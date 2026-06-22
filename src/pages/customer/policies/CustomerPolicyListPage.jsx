import { useEffect, useState } from "react";
import { getMyPolicies } from "../../../services/policyService";
import { Link } from "react-router-dom";

const CustomerPolicyListPage = () => {
  const [policies, setPolicies] = useState([]);

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const response = await getMyPolicies();
      setPolicies(response.content || []);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>My Policies</h2>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Policy No</th>
            <th>Plan Name</th>
            <th>Status</th>
            <th>Premium</th>
            <th>Coverage</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {policies.length > 0 ? (
            policies.map((policy) => (
              <tr key={policy.policyId}>
                <td>{policy.policyNumber}</td>
                <td>{policy.planName}</td>
                <td>{policy.policyStatus}</td>
                <td>₹{policy.premiumAmount}</td>
                <td>₹{policy.coverageAmount}</td>

                <td>
                  {policy.policyStatus === "PENDING_PAYMENT" && (
                    <Link
                      to={`/customer/payments/pay/${policy.policyId}`}
                      className="btn btn-success btn-sm"
                    >
                      Pay Premium
                    </Link>
                  )}

                  <Link
                    to={`/customer/payments`}
                    className="btn btn-primary btn-sm ms-2"
                  >
                    Payment History
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No Policies Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerPolicyListPage;