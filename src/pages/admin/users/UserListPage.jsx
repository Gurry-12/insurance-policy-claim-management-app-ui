import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageHeader from '../../../components/common/PageHeader';
import DataTable from '../../../components/tables/DataTable';
import PaginationBar from '../../../components/tables/PaginationBar';
import StatusBadge from '../../../components/ui/StatusBadge';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ErrorAlert from '../../../components/ui/ErrorAlert';
import getAllUsers from '../../../services/userService';
import useTableState from '../../../hooks/useTableState';
import SortableHeader from '../../../components/tables/SortableHeader';
import useSearch from '../../../hooks/useSearch';
import ExportButton from '../../../components/common/ExportButton';

const UserListPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState('');

  const tableState = useTableState({
    initialSortBy: 'id',
    initialFilters: { statusFilter: 'ALL', roleFilter: 'ALL' }
  });

  const fetchUsers = () => { 
    setLoading(true);
    const params = tableState.getQueryParams();
    
    // Custom mapping for this page's specific filters
    if (tableState.filters.statusFilter === 'ACTIVE') {
      params.isActive = 1;
    } else if (tableState.filters.statusFilter === 'INACTIVE') {
      params.isActive = 0;
    }
    delete params.statusFilter; // Cleanup generic filter key
    
    if (tableState.filters.roleFilter !== 'ALL') {
      params.role = tableState.filters.roleFilter;
    }
    delete params.roleFilter;

    getAllUsers(params)
      .then((res) => {
        setUsers(res.content);
        tableState.setTotalPages(res.totalPages);
        tableState.setTotalElements(res.totalElements || res.totalRecords || 0);
      })
      .catch(() => setError('Could not load Staffs list. Check your API connection.'))
      .finally(() => setLoading(false));
  };

  const { searchTerm, setSearchTerm, filteredData: filteredUsers } = useSearch(users, [
    "fullName",
    "firstName",
    "lastName",
    "email",
    "mobileNumber",
    "role"
  ]);

  useEffect(() => {
    fetchUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    tableState.currentPage, 
    tableState.filters.statusFilter, 
    tableState.filters.roleFilter, 
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
      minWidth: "85px",
    },
    {
      header: renderHeader("Name", "fullName"),
      cell: (row) =>
        row.fullName ||
        `${row.firstName || ""} ${row.lastName || ""}`.trim() ||
        "N/A",
    },
    {
      header: renderHeader("Email", "email"),
      cell: (row) => row.email || "N/A",
    },
    {
      header: renderHeader("Phone", "mobileNumber"),
      cell: (row) => row.mobileNumber || row.phoneNumber || "N/A",
    },
    {
      header: renderHeader("Role", "role"),
      cell: (row) => row.role || "N/A",
    },
    {
      header: renderHeader("Status", "isActive"),
      cell: (row) => <StatusBadge status={row.isActive ? "Active" : "Inactive"} />,
    },
    {
      header: "Actions",
      cell: (row) => (
        <button
          className="btn btn-sm btn-light text-primary border-0"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/admin/users/${row.id}`);
          }}
        >
          <i className="bi bi-eye"></i> View
        </button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader 
        title="Users Management" 
        subtitle="Manage and view administrators, Staffs, and customer accounts"
        action={
          <div className="d-flex gap-2">
            <ExportButton
              data={users || []}
              filename="Users_Export"
              columns={[
                { header: "Full Name", accessor: "fullName" },
                { header: "Email Address", accessor: "email" },
                { header: "Mobile Number", accessor: "mobileNumber" },
                { header: "Role", accessor: "role" },
                { header: "Active Status", exportValue: (r) => r.isActive ? "Active" : "Inactive" }
              ]}
              filename="users_list.csv"
            />
            <Link to="/admin/users/create" className="btn btn-primary d-flex align-items-center gap-2" style={{ borderRadius: '8px' }}>
              <i className="bi bi-plus-lg"></i>
              Add New Staff
            </Link>
          </div>
        }
      />
      
      <ErrorAlert message={error} />
      
      <div className="card border-0" style={{ borderRadius: 16, boxShadow: 'var(--ip-shadow-md)' }}>
        <div className="card-body p-0">
          <div className="p-4 border-bottom border-light d-flex flex-wrap gap-3 justify-content-between align-items-center">
            <h6 className="m-0 fw-bold">All Users</h6>
            <div className="d-flex gap-2 flex-wrap">
              <select 
                className="form-select form-select-sm" 
                style={{ width: '130px', borderRadius: '8px', border: '1px solid var(--ip-border)' }}
                value={tableState.filters.statusFilter}
                onChange={(e) => tableState.handleFilterChange({ statusFilter: e.target.value })}
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
              <select 
                className="form-select form-select-sm" 
                style={{ width: '140px', borderRadius: '8px', border: '1px solid var(--ip-border)' }}
                value={tableState.filters.roleFilter}
                onChange={(e) => tableState.handleFilterChange({ roleFilter: e.target.value })}
              >
                <option value="ALL">All Roles</option>
                <option value="ROLE_ADMIN">Admin</option>
                <option value="ROLE_INTERNAL_STAFF">Staff</option>
                <option value="ROLE_CUSTOMER">Customer</option>
              </select>
              <div className="input-group input-group-sm" style={{ width: '200px' }}>
                <span className="input-group-text bg-white border-end-0" style={{ border: '1px solid var(--ip-border)' }}>
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input 
                  type="text" 
                  className="form-control border-start-0 ps-0" 
                  placeholder="Search users on this page..." 
                  style={{ border: '1px solid var(--ip-border)', borderRadius: '0 8px 8px 0' }} 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="p-4">
            {loading ? (
              <LoadingSpinner text="Fetching Staffs..." />
            ) : (
              <>
                <DataTable 
                  columns={columns} 
                  data={filteredUsers} 
                  onRowClick={(row) => navigate(`/admin/users/${row.id}`)}
                />
                <PaginationBar 
                  currentPage={tableState.currentPage} 
                  totalPages={tableState.totalPages} 
                  onPageChange={tableState.setCurrentPage} 
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserListPage;

