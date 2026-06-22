import  { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../../components/common/PageHeader';
import DataTable from '../../../components/tables/DataTable';
import PaginationBar from '../../../components/tables/PaginationBar';
import StatusBadge from '../../../components/ui/StatusBadge';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ErrorAlert from '../../../components/ui/ErrorAlert';
import getAllUsers from '../../../services/userService';

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 1;

  useEffect(() => {
    getAllUsers()
      .then(setUsers)
      .catch(() => setError('Could not load agents list. Check your API connection.'))
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    {
      header: "ID",
      cell: (row) => row.id || "N/A",
      minWidth: "80px",
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
      header: "Joined",
      cell: (row) => row.createdDate?.split("T")[0] || "N/A",
    },
    {
      header: "Status",
      cell: (row) => <StatusBadge status={row.status || "Active"} />,
    },
  ];

  return (
    <div>
      <PageHeader 
        title="Users Management" 
        subtitle="Manage all agents and system users"
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
          <div className="p-4 border-bottom border-light d-flex justify-content-between align-items-center">
            <h6 className="m-0 fw-bold">All Agents</h6>
            <div className="input-group" style={{ width: '250px' }}>
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input type="text" className="form-control border-start-0 ps-0" placeholder="Search agents..." />
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
