import { useEffect, useState } from "react";
import { getAllPoliciesPaginated } from "../../../services/policyService";
import { useNavigate, Link } from "react-router-dom";
import PageHeader from "../../../components/common/PageHeader";
import StatusBadge from "../../../components/ui/StatusBadge";
import { Eye } from "lucide-react";
import usePolicyPdf from "../../../hooks/PdfDownload/usePolicyPdf";
import ExportButton from "../../../components/common/ExportButton";
import useTableState from "../../../hooks/useTableState";
import PaginationBar from "../../../components/tables/PaginationBar";

const StaffPolicyListPage = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const { downloadPolicy } = usePolicyPdf();

  const tableState = useTableState({
    initialSortBy: 'id'
  });
  
  useEffect(() => {
    const loadPolicies = async () => {
      try {
        setLoading(true);
        const params = tableState.getQueryParams();
        if (statusFilter !== "ALL") {
          params.status = statusFilter;
        }
        const res = await getAllPoliciesPaginated(params);
        setPolicies(res.content || []);
        tableState.setTotalPages(res.totalPages || 1);
        tableState.setTotalElements(res.totalElements || res.totalRecords || 0);
      } catch (error) {
        console.error("Error loading policies:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPolicies();
  
  }, [tableState.currentPage, tableState.sortBy, tableState.sortDirection, statusFilter]);

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
    <ExportButton
      data={policies || []}
      columns={[
        { header: "Policy ID", accessor: "policyId" },
        { header: "Policy Number", accessor: "policyNumber" },
        { header: "Customer Name", accessor: "customerName" },
        { header: "Plan Name", accessor: "planName" },
        { header: "Premium Amount (₹)", accessor: "premiumAmount" },
        { header: "Status", accessor: "policyStatus" }
      ]}
      filename="Staff_policies_list.csv"
    />


    <button
      className="btn btn-secondary d-flex align-items-center gap-1"
      onClick={() => navigate("/Staff/dashboard")}
    >
      <i className="bi bi-arrow-left"></i>
      Back
    </button>

  </div>
}
/>
      <div className="d-flex gap-2 mb-3">
        <select
          className="form-select"
          style={{ width: "220px" }}
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            tableState.setCurrentPage(1);
          }}
        >
          <option value="ALL">All Policies</option>
          <option value="ACTIVE">Active Policies</option>
          <option value="CANCELLED">Cancelled Policies</option>
          <option value="PAYMENT_PENDING">Payment Pending</option>
        </select>
        <input
          type="text"
          className="form-control"
          placeholder="Search by Policy Number, Customer Name or Plan Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>Policy Number</th>
              <th>Customer Name</th>
              <th>Plan Name</th>
              <th>Premium Amount</th>
              <th>Status</th>
              <th>Actions</th>
              <th>Download</th>
            </tr>
          </thead>

          <tbody>
  {filteredPolicies.length > 0 ? (
    filteredPolicies.map((policy, index) => (
      <tr key={policy.policyId}>
        <td>{tableState.getSrNo(index)}</td>
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
  <div className="d-flex flex-column gap-2">

    <Link
      to={`/Staff/policies/${policy.policyId}`}
      className="btn btn-light btn-sm text-primary"
      title="View Details"
    >
      <Eye size={16} />
      <span className="ms-1">View</span>
    </Link>

    {policy.policyStatus?.toUpperCase() === "PAYMENT_PENDING" && (
      <Link
        to={`/Staff/payments/create/${policy.policyId}`}
        className="btn btn-success btn-sm"
      >
        Make Payment
      </Link>
    )}

  </div>
</td>
<td>
    <button
        className="btn btn-danger btn-sm"
        onClick={() => downloadPolicy(policy)}
    >
        <i className="bi bi-download me-1"></i>
        PDF
    </button>
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
      {policies.length > 0 && (
        <div className="mt-3">
          <PaginationBar
            currentPage={tableState.currentPage}
            totalPages={tableState.totalPages}
            totalElements={tableState.totalElements}
            pageSize={tableState.pageSize}
            onPageChange={tableState.setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default StaffPolicyListPage;

