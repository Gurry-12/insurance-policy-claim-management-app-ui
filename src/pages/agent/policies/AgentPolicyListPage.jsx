
import { useEffect, useState } from "react";
import { getAllPolicies } from "../../../services/policyService";
import { useNavigate } from "react-router-dom";

const AgentPolicyListPage = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  
  useEffect(() => {

  const loadPolicies = async () => {
    try {
     const data = await getAllPolicies();
      setPolicies(data.content || []);

    } catch (error) {
      console.error("Error loading policies:", error);
    } finally {
      setLoading(false);
    }
  };

  loadPolicies();
  }, []);
  
  if (loading) {
    return <h2>Loading Policies...</h2>;
  }
  
  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Policy Management</h2>
      </div>
      <div className="d-flex justify-content-end mb-3">
       <button    
        className="btn btn-secondary mb-3"
        onClick={() => navigate("/agent/dashboard")}
      > Back </button>
      </div>
      <div className="content-card">
        <table className="policy-table">
          <thead>
            <tr>
              <th>Policy ID</th>
              <th>Policy Number</th>
              <th>Customer Name</th>
              <th>Plan Name</th>
              <th>Product Type</th>
              <th>Coverage Amount</th>
              <th>Premium Amount</th>
              <th>Premium Type</th>
              <th>Status</th>
              <th>Start Date</th>
              <th>End Date</th>
            </tr>
          </thead>

          <tbody>
            {policies.length > 0 ? (
              policies.map((policy) => (
                <tr key={policy.policyId}>
                  <td>{policy.policyId}</td>
                  <td>{policy.policyNumber}</td>
                  <td>{policy.customerName}</td>
                  <td>{policy.planName}</td>
                  <td>{policy.productType}</td>
                  <td>₹ {policy.coverageAmount}</td>
                  <td>₹ {policy.premiumAmount}</td>
                  <td>{policy.premiumType}</td>

                  <td>
                    <span
                      className={
                        policy.policyStatus === "ACTIVE"
                          ? "approved"
                          : policy.policyStatus === "EXPIRED"
                          ? "rejected"
                          : "pending"
                      }
                    >
                      {policy.policyStatus}
                    </span>
                  </td>

                  <td>{policy.startDate}</td>
                  <td>{policy.endDate}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11">No Policies Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AgentPolicyListPage;



