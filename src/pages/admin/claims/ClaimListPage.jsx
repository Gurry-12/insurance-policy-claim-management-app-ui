import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../../components/common/PageHeader';
import DataTable from '../../../components/tables/DataTable';
import PaginationBar from '../../../components/tables/PaginationBar';
import StatusBadge from '../../../components/ui/StatusBadge';
import { getAllClaimsPaginated } from '../../../services/claimService';
import useTableState from '../../../hooks/useTableState';
import SortableHeader from '../../../components/tables/SortableHeader';
import useSearch from '../../../hooks/useSearch';

const ClaimListPage = () => {
  const navigate = useNavigate();
  const [claims, setClaims] = useState(null);
  
  const tableState = useTableState({
    initialSortBy: 'createdDate',
    initialFilters: { statusFilter: 'ALL' }
  });

  const fetchClaims = () => {
    const params = tableState.getQueryParams();
    
    if (tableState.filters.statusFilter !== 'ALL') {
      params.status = tableState.filters.statusFilter;
    }
    delete params.statusFilter;

    getAllClaimsPaginated(params)
      .then((res) => {
        setClaims(res.content);
        tableState.setTotalPages(res.totalPages);
        tableState.setTotalElements(res.totalElements || res.totalRecords || 0);
      })
      .catch((error) => console.log(error));
  };

  const { searchTerm, setSearchTerm, filteredData: filteredClaims } = useSearch(claims || [], [
    "claimNumber",
    "policyNumber",
    "customerName"
  ]);

  useEffect(() => {
    fetchClaims();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    tableState.currentPage, 
    tableState.filters.statusFilter, 
    tableState.sortBy, 
    tableState.sortDirection
  ]);

  const renderHeader = (label, field) => (
    <SortableHeader 
      label={label} 
      field={field} 
      currentSortBy={tableState.sortBy} 
      currentDirection={tableState.sortDirection} 
      onSort={tableState.handleSort} 
    />
  );

  const columns = [
    { 
      header: renderHeader("Sr. No.", "id"), 
      cell: (row, index) => tableState.getSrNo(index), 
      minWidth: "85px" 
    },
    { header: renderHeader("Claim ID", "claimNumber"), accessor: "claimNumber", minWidth: "100px" },
    { header: "Policy #", accessor: "policyNumber" },
    { header: "Customer", accessor: "customerName" },
    {
      header: renderHeader("Amount (₹)", "claimAmount"),
      cell: (row) => `₹${row.claimAmount.toLocaleString("en-IN")}`,
    },
    { header: renderHeader("Date Filed", "createdDate"), accessor: "createdDate", cell: (row) => new Date(row.createdDate).toLocaleDateString() },
    {
      header: renderHeader("Status", "claimStatus"),
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
            <div className="d-flex gap-2 flex-wrap">
              {[
                { label: "All Claims", val: "ALL" },
                { label: "Submitted", val: "SUBMITTED" },
                { label: "Under Review", val: "UNDER_REVIEW" },
                { label: "Reviewed", val: "RECOMMENDED_FOR_APPROVAL" },
                { label: "Approved", val: "APPROVED" },
                { label: "Rejected", val: "REJECTED" },
              ].map((pill) => (
                <button
                  key={pill.val}
                  onClick={() => tableState.handleFilterChange({ statusFilter: pill.val })}
                  className={`btn btn-sm px-3 rounded-pill ${tableState.filters.statusFilter === pill.val ? "btn-primary" : "btn-light text-muted"}`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
            <div className="input-group input-group-sm" style={{ width: "250px" }}>
              <span className="input-group-text bg-white border-end-0" style={{ border: '1px solid var(--ss-border)' }}>
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Search claims on this page..."
                style={{ border: '1px solid var(--ss-border)', borderRadius: '0 8px 8px 0' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="p-4">
            <DataTable
              columns={columns}
              data={filteredClaims}
              onRowClick={(row) => navigate(`/admin/claims/${row.claimId}`)}
            />
            <PaginationBar
              currentPage={tableState.currentPage}
              totalPages={tableState.totalPages}
              onPageChange={tableState.setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimListPage;
