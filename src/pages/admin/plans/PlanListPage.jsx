import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageHeader from '../../../components/common/PageHeader';
import DataTable from '../../../components/tables/DataTable';
import PaginationBar from '../../../components/tables/PaginationBar';
import StatusBadge from '../../../components/ui/StatusBadge';
import ErrorAlert from '../../../components/ui/ErrorAlert';
import { getAllPlansPaginated } from '../../../services/planService';
import useTableState from '../../../hooks/useTableState';
import SortableHeader from '../../../components/tables/SortableHeader';
import useSearch from '../../../hooks/useSearch';
import ExportButton from '../../../components/common/ExportButton';

const PlanListPage = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const tableState = useTableState({
    initialSortBy: 'createdDate',
    initialSortDirection: 'desc',
    initialFilters: { statusFilter: 'ALL' }
  });

  const fetchPlans = () => {
    setLoading(true);
    const params = tableState.getQueryParams();
    
    if (tableState.filters.statusFilter !== 'ALL') {
      params.isActive = tableState.filters.statusFilter === 'ACTIVE';
    }
    delete params.statusFilter;

    getAllPlansPaginated(params)
      .then((res) => {
        setPlans(res.content);
        tableState.setTotalPages(res.totalPages);
        tableState.setTotalElements(res.totalElements || res.totalRecords || 0);
      })
      .catch(() => setError('Could not load plans. Please check your API connection.'))
      .finally(() => setLoading(false));
  };

  const { searchTerm, setSearchTerm, filteredData: filteredPlans } = useSearch(plans || [], [
    "planName",
    "productName"
  ]);

  useEffect(() => {
    fetchPlans();
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
      header: "Sr. No.",
      cell: (row, index) => tableState.getSrNo(index), 
      minWidth: "85px" 
    },
    { header: renderHeader("Plan Name", "planName"), accessor: "planName" },
    { header: "Product Name", accessor: "productName" },
    {
      header: renderHeader("Coverage (₹)", "coverageAmount"),
      cell: (row) => `₹${row.coverageAmount?.toLocaleString("en-IN") || 0}`,
    },
    {
      header: renderHeader("Premium (₹)", "premiumAmount"),
      cell: (row) => `₹${row.premiumAmount?.toLocaleString("en-IN") || 0}`,
    },
    { header: "Duration", cell: (row) => `${row.duration} yrs` },
    { header: renderHeader("Created", "createdDate"), cell: (row) => new Date(row.createdDate).toLocaleDateString() },
    {
      header: "Status",
      cell: (row) => (row.active ? <StatusBadge status={"Active"} /> : <StatusBadge status={"InActive"} />),
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm btn-light text-primary border-0"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin/plans/${row.planId}`);
            }}
            title="View Details"
          >
            <i className="bi bi-eye"></i>
          </button>
          <button
            className="btn btn-sm btn-light text-primary border-0"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin/plans/edit/${row.planId}`);
            }}
            title="Edit Plan"
          >
            <i className="bi bi-pencil-square"></i>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Insurance Plans"
        subtitle="Manage specific plans and coverages under products"
        action={
          <div className="d-flex gap-2">
            <ExportButton
              data={plans || []}
              columns={[
                { header: "Plan Name", accessor: "planName" },
                { header: "Product Name", accessor: "productName" },
                { header: "Coverage Amount (₹)", accessor: "coverageAmount" },
                { header: "Premium Amount (₹)", accessor: "premiumAmount" },
                { header: "Premium Type", accessor: "premiumType" },
                { header: "Duration (Years)", accessor: "duration" },
                { header: "Active Status", exportValue: (r) => r.isActive ? "Active" : "Inactive" }
              ]}
              filename="plans_list.csv"
            />
            <Link
              to="/admin/plans/create"
              className="btn btn-primary d-flex align-items-center gap-2"
              style={{ borderRadius: "8px" }}
            >
              <i className="bi bi-plus-lg"></i>
              Create Plan
            </Link>
          </div>
        }
      />

      <ErrorAlert message={error} />

      <div
        className="card border-0"
        style={{ borderRadius: 16, boxShadow: "var(--ip-shadow-md)" }}
      >
        <div className="card-body p-0">
          <div className="p-4 border-bottom border-light d-flex justify-content-between align-items-center flex-wrap gap-3">
            <h6 className="m-0 fw-bold">All Plans</h6>
            <div className="d-flex gap-2 flex-wrap">
              <select
                className="form-select form-select-sm"
                style={{
                  width: "160px",
                  borderRadius: "8px",
                  border: "1px solid var(--ip-border)",
                }}
                value={tableState.filters.statusFilter}
                onChange={(e) =>
                  tableState.handleFilterChange({
                    statusFilter: e.target.value,
                  })
                }
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
              <div
                className="input-group input-group-sm"
                style={{ width: "220px" }}
              >
                <span
                  className="input-group-text bg-white border-end-0"
                  style={{ border: "1px solid var(--ip-border)" }}
                >
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0"
                  placeholder="Search plans on this page..."
                  style={{
                    border: "1px solid var(--ip-border)",
                    borderRadius: "0 8px 8px 0",
                  }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="p-4">
            <DataTable
              columns={columns}
              data={filteredPlans}
              loading={loading}
              onRowClick={(row) => navigate(`/admin/plans/${row.planId}`)}
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

export default PlanListPage;
