import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageHeader from '../../../components/common/PageHeader';
import DataTable from '../../../components/tables/DataTable';
import PaginationBar from '../../../components/tables/PaginationBar';
import StatusBadge from '../../../components/ui/StatusBadge';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ErrorAlert from '../../../components/ui/ErrorAlert';
import getAllUsers from '../../../services/userService';
import usePagination from '../../../hooks/usePagination';

const UserListPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState('');
  const { currentPage, totalPages, setTotalPages, setCurrentPage, pageParams, pageSize } = usePagination(1, 10);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const fetchUsers = () => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    const params = { ...pageParams };
    if (statusFilter === 'ACTIVE') {
      params.isActive = 1;
    } else if (statusFilter === 'INACTIVE') {
      params.isActive = 0;
    }
    if (roleFilter !== 'ALL') {
      params.role = roleFilter;
    }

    getAllUsers(params)
      .then((res) => {
        setUsers(res.content);
        setTotalPages(res.totalPages);
      })
      .catch(() => setError('Could not load agents list. Check your API connection.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, statusFilter, roleFilter]);

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleRoleFilterChange = (role) => {
    setRoleFilter(role);
    setCurrentPage(1);
  };

  const columns = [
    {
      header: "#",
      cell: (row, index) => (currentPage - 1) * pageSize + index + 1,
      minWidth: "60px",
    },
    {
      header: "Name",
      cell: (row) =>
        row.fullName ||
        `${row.firstName || ""} ${row.lastName || ""}`.trim() ||
        "N/A",
    },
    {
      header: "Email",
      cell: (row) => row.email || "N/A",
    },
    {
      header: "Phone",
      cell: (row) => row.mobileNumber || row.phoneNumber || "N/A",
    },
    {
      header: "Role",
      cell: (row) => row.role || "N/A",
    },
    {
      header: "Status",
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
        subtitle="Manage and view administrators, agents, and customer accounts"
        action={
          <Link to="/admin/users/create" className="btn btn-primary d-flex align-items-center gap-2" style={{ borderRadius: '8px' }}>
            <i className="bi bi-plus-lg"></i>
            Add New Agent
          </Link>
        }
      />
      
      <ErrorAlert message={error} />
      
      <div className="card border-0" style={{ borderRadius: 16, boxShadow: 'var(--ss-shadow)' }}>
        <div className="card-body p-0">
          <div className="p-4 border-bottom border-light d-flex flex-wrap gap-3 justify-content-between align-items-center">
            <h6 className="m-0 fw-bold">All Users</h6>
            <div className="d-flex gap-2 flex-wrap">
              <select 
                className="form-select form-select-sm" 
                style={{ width: '130px', borderRadius: '8px', border: '1px solid var(--ss-border)' }}
                value={statusFilter}
                onChange={(e) => handleStatusFilterChange(e.target.value)}
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
              <select 
                className="form-select form-select-sm" 
                style={{ width: '140px', borderRadius: '8px', border: '1px solid var(--ss-border)' }}
                value={roleFilter}
                onChange={(e) => handleRoleFilterChange(e.target.value)}
              >
                <option value="ALL">All Roles</option>
                <option value="ROLE_ADMIN">Admin</option>
                <option value="ROLE_AGENT">Agent</option>
                <option value="ROLE_CUSTOMER">Customer</option>
              </select>
              <div className="input-group input-group-sm" style={{ width: '200px' }}>
                <span className="input-group-text bg-white border-end-0" style={{ border: '1px solid var(--ss-border)' }}>
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input type="text" className="form-control border-start-0 ps-0" placeholder="Search users..." style={{ border: '1px solid var(--ss-border)', borderRadius: '0 8px 8px 0' }} />
              </div>
            </div>
          </div>
          <div className="p-4">
            {loading ? (
              <LoadingSpinner text="Fetching agents..." />
            ) : (
              <>
                <DataTable 
                  columns={columns} 
                  data={users} 
                  onRowClick={(row) => navigate(`/admin/users/${row.id}`)}
                />
                <PaginationBar 
                  currentPage={currentPage} 
                  totalPages={totalPages} 
                  onPageChange={setCurrentPage} 
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
