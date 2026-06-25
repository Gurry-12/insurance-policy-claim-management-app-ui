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
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  
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
  
  }, [] );

  const filteredPolicies = policies.filter((policy) => {
  const matchesSearch =
    policy.policyNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    policy.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    policy.planName?.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesStatus =
    statusFilter === "ALL" ||
    policy.policyStatus?.toUpperCase() === statusFilter;

  return matchesSearch && matchesStatus;
});

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
        subtitle="Track your client  policies"
       action={
  <div className="d-flex align-items-center gap-2">
    
    <select
      className="form-select"
      style={{ width: "220px" }}
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
    >
      <option value="ALL">All Policies</option>
      <option value="ACTIVE">Active Policies</option>
      <option value="CANCELLED">Cancelled Policies</option>
      <option value="PAYMENT_PENDING">Payment Pending</option>
    </select>

    <button
      className="btn btn-secondary d-flex align-items-center gap-1"
      onClick={() => navigate("/agent/dashboard")}
    >
      <i className="bi bi-arrow-left"></i>
      Back
    </button>

  </div>
}
/>
        <input
        type="text"
        className="form-control"
        placeholder="Search by Policy Number, Customer Name or Plan Name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Policy Number</th>
              <th>Customer Name</th>
              <th>Plan Name</th>
              <th>Premium Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
  {filteredPolicies.length > 0 ? (
    filteredPolicies.map((policy, index) => (
      <tr key={policy.policyId}>
        <td>{index + 1}</td>
        <td style={{ fontWeight: 600 }}>
          {policy.policyNumber}
        </td>

        <td>
          {policy.customerName}
        </td>

        <td>
          {policy.planName}
        </td>

        <td style={{ fontWeight: 600 }}>
          ₹ {policy.premiumAmount?.toLocaleString()}
        </td>

        <td>
          <StatusBadge status={policy.policyStatus} />
        </td>

        <td>
          <Link
            to={`/agent/policies/${policy.policyId}`}
            className="btn btn-light btn-sm text-primary"
            title="View Details"
          >
            <Eye size={16} />
            <span className="ms-1">View Details</span>
          </Link>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="6" className="text-center py-4">
        No Policies Found
      </td>
    </tr>
  )}
</tbody>
        </table>

        
      </div>
    </div>
  );
};

export default AgentPolicyListPage;
