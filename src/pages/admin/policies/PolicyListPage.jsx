import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageHeader from '../../../components/common/PageHeader';
import DataTable from '../../../components/tables/DataTable';
import PaginationBar from '../../../components/tables/PaginationBar';
import StatusBadge from '../../../components/ui/StatusBadge';
import { getAllPoliciesPaginated } from '../../../services/policyService';
import ErrorAlert from '../../../components/ui/ErrorAlert';
import usePagination from '../../../hooks/usePagination';

const PolicyListPage = () => {
   const navigate = useNavigate();
  const { currentPage, totalPages, setTotalPages, setCurrentPage, pageParams } = usePagination(1, 10);
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const columns = [
    { header: "Policy #", accessor: "policyNumber", minWidth: "100px" },
    { header: "Customer", accessor: "customerName" },
    { header: "Plan", accessor: "planName" },
    {
      header: "Premium (₹)",
      cell: (row) => `₹${row.premiumAmount.toLocaleString("en-IN")}`,
    },
    { header: "Start Date", accessor: "startDate" },
    { header: "Expiry Date", accessor: "endDate" },
    {
      header: "Status",
      cell: (row) => <StatusBadge status={row.policyStatus} />,
    },
    {
      header: "Actions",
      cell: (row) => (
        <button 
          className="btn btn-sm btn-light text-primary border-0"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/admin/policies/${row.policyId}`);
          }}
        >
          <i className="bi bi-file-earmark-text"></i> View
        </button>
      ),
    },
  ];

  const fetchPolicies = () => {
    setLoading(true);
    const params = { ...pageParams };
    if (statusFilter !== 'ALL') {
      params.status = statusFilter;
    }
    getAllPoliciesPaginated(params)
      .then((res) => {
        setPolicies(res.content);
        setTotalPages(res.totalPages);
      })
      .catch(() => setError('Could not load policies. Please check your API connection.'))
      .finally(() => setLoading(false));
  };

  useEffect( () => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPolicies();
  }, [currentPage, statusFilter] );

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  return (
    <div>
      <PageHeader 
        title="Policies Management" 
        subtitle="View all issued insurance policies across the system"
        action={
          <Link to="/admin/policies/issue" className="btn btn-primary d-flex align-items-center gap-2" style={{ borderRadius: '8px' }}>
            <i className="bi bi-file-earmark-plus"></i>
            Issue New Policy
          </Link>
        }
      />
      
      <ErrorAlert message={error} />

      <div className="card border-0" style={{ borderRadius: 16, boxShadow: 'var(--ss-shadow)' }}>
        <div className="card-body p-0">
          <div className="p-4 border-bottom border-light d-flex flex-wrap gap-3 justify-content-between align-items-center">
            <h6 className="m-0 fw-bold">All Policies</h6>
            <div className="d-flex gap-2">
              <select 
                className="form-select form-select-sm" 
                style={{ width: '160px', borderRadius: '8px', border: '1px solid var(--ss-border)' }}
                value={statusFilter}
                onChange={(e) => handleStatusFilterChange(e.target.value)}
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="PENDING_PAYMENT">Pending Payment</option>
                <option value="EXPIRED">Expired</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
              <div className="input-group input-group-sm" style={{ width: '220px' }}>
                <span className="input-group-text bg-white border-end-0" style={{ border: '1px solid var(--ss-border)' }}>
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input type="text" className="form-control border-start-0 ps-0" placeholder="Search policies..." style={{ border: '1px solid var(--ss-border)', borderRadius: '0 8px 8px 0' }} />
              </div>
            </div>
          </div>
          <div className="p-4">
            <DataTable 
              columns={columns} 
              data={policies} 
              loading={loading}
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

export default PolicyListPage;
