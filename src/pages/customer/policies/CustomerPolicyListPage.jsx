import { useEffect, useState } from "react";
import { getMyPolicies } from "../../../services/policyService";

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
          </tr>
        </thead>

        <tbody>

          {policies.map((policy) => (
            <tr key={policy.policyId}>
              <td>{policy.policyNumber}</td>
              <td>{policy.planName}</td>
              <td>{policy.policyStatus}</td>
              <td>₹{policy.premiumAmount}</td>
              <td>₹{policy.coverageAmount}</td>
            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
};

export default CustomerPolicyListPage;