import { useEffect, useState } from "react";
import { getAllClaimsPaginated } from "../../../services/claimService";
import { useNavigate, Outlet } from "react-router-dom";
import PageHeader from "../../../components/common/PageHeader";
import StatusBadge from "../../../components/ui/StatusBadge";
import ExportButton from "../../../components/common/ExportButton";
import useClaimPdf from "../../../hooks/PdfDownload/useClaimPdf";
import useTableState from "../../../hooks/useTableState";
import PaginationBar from "../../../components/tables/PaginationBar";

const StaffClaimListPage = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const { downloadClaim } = useClaimPdf();

  const tableState = useTableState({
    initialSortBy: 'createdDate',
    initialSortDirection: 'desc'
  });

  useEffect(() => {
    const loadClaims = async () => {
      try {
        setLoading(true);
        const params = tableState.getQueryParams();
        const data = await getAllClaimsPaginated(params);
        setClaims(data.content || []);
        tableState.setTotalPages(data.totalPages || 1);
        tableState.setTotalElements(data.totalRecords || data.totalElements || 0);
      } catch (error) {
        console.error("Error loading claims:", error);
      } finally {
        setLoading(false);
      }
    };

    loadClaims();
  }, [tableState.currentPage, tableState.sortBy, tableState.sortDirection]);

  //filter
   const filteredClaims = claims.filter((claim) => {
     const matchesSearch = claim.claimNumber?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
       claim.customerName?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
       claim.claimAmount?.toString().includes(searchTerm) ||
       claim.policyNumber?.toString().toLowerCase().includes(searchTerm.toLowerCase());
       
     const matchesStatus = statusFilter === "ALL" || claim.claimStatus?.toUpperCase() === statusFilter;
     
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
        title="claim Management"
        subtitle="Track your client  claims"
        action={
          <div className="d-flex gap-2">
            <ExportButton
              data={claims || []}
              columns={[
                { header: "Claim Number", accessor: "claimNumber" },
                { header: "Customer Name", accessor: "customerName" },
                { header: "Policy Number", accessor: "policyNumber" },
                { header: "Claim Amount (₹)", accessor: "claimAmount" },
                { header: "Status", accessor: "claimStatus" }
              ]}
              filename="Staff_claims_list.csv"
            />
            <button className="btn btn-secondary d-flex align-items-center gap-1" onClick={() => navigate("/staff/dashboard")}>
              <i className="bi bi-arrow-left"></i> Back
            </button>
          </div>
        }
      />
      
{/* /filter search bar */}
{/* ADD SEARCH BAR HERE */}
      <div className="d-flex gap-2 mb-3">
        <select
          className="form-select"
          style={{ width: "200px" }}
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            tableState.setCurrentPage(1);
          }}
        >
          <option value="ALL">All Claims</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
        <input
          type="text"
          className="form-control"
          placeholder="Search by Claim Number, Customer Name, Amount or Policy Number"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {claims.length === 0 ? (
        <div className="alert alert-info" style={{ borderRadius: 12 }}>
          No Claims Available.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>Sr. No.</th>
                <th>Claim Number</th>
                <th>Customer Name</th>
                <th>Policy Number</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>


            <tbody>
        {filteredClaims.map((claim, index) => (
          <tr key={claim.claimId}>
              <td>{tableState.getSrNo(index)}</td>
            <td style={{ fontWeight: 600 }}>
              {claim.claimNumber}
            </td>

            <td style={{ fontWeight: 600 }}>
              {claim.customerName}
            </td>
                       

            <td>{claim.policyNumber}</td>

            <td style={{ fontWeight: 600 }}>
              ₹ {claim.claimAmount?.toLocaleString()}
            </td>

            <td><StatusBadge status={claim.claimStatus} /></td>

           <td>
            <div className="d-flex align-items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <button 
                className="btn btn-sm btn-light text-primary d-flex align-items-center gap-1" 
                onClick={() => navigate(`/staff/claims/${claim.claimId}`)}
                style={{ borderRadius: '6px' }}
              >
                <i className="bi bi-eye"></i> View
              </button>
              <button 
                className="btn btn-sm btn-light text-danger d-flex align-items-center gap-1" 
                onClick={() => downloadClaim(claim)}
                title="Download PDF"
                style={{ borderRadius: '6px' }}
              >
                <i className="bi bi-file-earmark-pdf"></i>
              </button>
            </div>
          </td>
    </tr>
  ))}
</tbody>
          </table>
        </div>
      )}
      {claims.length > 0 && (
        <div className="mt-3">
          <PaginationBar
            currentPage={tableState.currentPage}
            totalPages={tableState.totalPages}
            onPageChange={tableState.setCurrentPage}
          />
        </div>
      )}
      <Outlet />
    </div>
  );
};

export default StaffClaimListPage;
