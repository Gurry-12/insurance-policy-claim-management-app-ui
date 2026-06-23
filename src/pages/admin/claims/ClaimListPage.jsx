import  { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../../components/common/PageHeader';
import DataTable from '../../../components/tables/DataTable';
import PaginationBar from '../../../components/tables/PaginationBar';
import StatusBadge from '../../../components/ui/StatusBadge';
import { getAllClaimsPaginated } from '../../../services/claimService';
import usePagination from '../../../hooks/usePagination';

const ClaimListPage = () => {
  const navigate = useNavigate();
  const { currentPage, totalPages, setTotalPages, setCurrentPage, pageParams } = usePagination(1, 10);
  const [claims, setClaims] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');

  const columns = [
    { header: "Claim ID", accessor: "claimNumber", minWidth: "100px" },
    { header: "Policy #", accessor: "policyNumber" },
    { header: "Customer", accessor: "customerName" },
    {
      header: "Amount (₹)",
      cell: (row) => `₹${row.claimAmount.toLocaleString("en-IN")}`,
    },
    { header: "Date Filed", accessor: "createdDate" },
    {
      header: "Status",
      cell: (row) => <StatusBadge status={row.claimStatus} />,
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm btn-light text-primary border-0"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin/claims/${row.claimId}`);
            }}
            title="Review Claim"
          >
            <i className="bi bi-eye"></i> Review
          </button>
          <button
            className="btn btn-sm btn-light text-secondary border-0"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin/claims/${row.claimId}/history`);
            }}
            title="Claim History"
          >
            <i className="bi bi-clock-history"></i> History
          </button>
        </div>
      ),
    },
  ];

  const fetchClaims = () => {
    const params = { ...pageParams };
    if (statusFilter !== 'ALL') {
      params.status = statusFilter;
    }
    getAllClaimsPaginated(params)
      .then((res) => {
        setClaims(res.content);
        setTotalPages(res.totalPages);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    fetchClaims();
  }, [currentPage, statusFilter]);

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  return (
    <div>
      <PageHeader
        title="Claims Management"
        subtitle="Review and process all incoming insurance claims"
      />

      <div
        className="card border-0"
        style={{ borderRadius: 16, boxShadow: "var(--ss-shadow)" }}
      >
        <div className="card-body p-0">
          <div className="p-4 border-bottom border-light d-flex flex-wrap gap-3 justify-content-between align-items-center">
            <div className="d-flex gap-2">
              {[
                { label: "All Claims", val: "ALL" },
                { label: "Submited", val: "SUBMITTED" },
                { label: "Under Review", val: "UNDER_REVIEW" },
                { label: "Reviewed", val: "RECOMMENDED_FOR_APPROVAL" },
                { label: "Approved", val: "APPROVED" },
                { label: "Rejected", val: "REJECTED" },
              ].map((pill) => (
                <button
                  key={pill.val}
                  onClick={() => handleStatusFilterChange(pill.val)}
                  className={`btn btn-sm px-3 rounded-pill ${statusFilter === pill.val ? "btn-primary" : "btn-light text-muted"}`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
            <div className="input-group" style={{ width: "250px" }}>
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Search claims..."
              />
            </div>
          </div>
          <div className="p-4">
            <DataTable
              columns={columns}
              data={claims}
              onRowClick={(row) => navigate(`/admin/claims/${row.claimId}`)}
            />
            <PaginationBar
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimListPage;
