import { useEffect, useState } from "react";
import { getAllPolicies } from "../../../services/policyService";
import { useNavigate, Link } from "react-router-dom";
import PageHeader from "../../../components/common/PageHeader";
import StatusBadge from "../../../components/ui/StatusBadge";
import { Eye } from "lucide-react";

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
        title="Policy Management"
        subtitle="View and manage client policies"
      />

      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead>
            <tr>
              <th>Policy Number</th>
              <th>Customer Name</th>
              <th>Plan Name</th>
              <th>Premium Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {policies.length > 0 ? (
              policies.map((policy) => (
                <tr key={policy.policyId}>
                  <td style={{ fontWeight: 600 }}>{policy.policyNumber}</td>
                  <td>{policy.customerName}</td>
                  <td>{policy.planName}</td>
                  <td style={{ fontWeight: 600 }}>₹ {policy.premiumAmount?.toLocaleString()}</td>
                  <td>
                    <StatusBadge status={policy.policyStatus} />
                  </td>
                  <td>
                    <Link
                      to={`/agent/policies/${policy.policyId}`}
                      className="btn btn-light btn-sm text-primary"
                      title="View Details"
                    >
                      <Eye size={16} /> <span className="ms-1">View Details</span>
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4">No Policies Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AgentPolicyListPage;
