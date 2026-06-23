import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageHeader from '../../../components/common/PageHeader';
import DataTable from '../../../components/tables/DataTable';
import PaginationBar from '../../../components/tables/PaginationBar';
import StatusBadge from '../../../components/ui/StatusBadge';
import ErrorAlert from '../../../components/ui/ErrorAlert';
import { getAllPlansPainated } from '../../../services/planService';
import usePagination from '../../../hooks/usePagination';

const PlanListPage = () => {
  const navigate = useNavigate();
  const { currentPage, totalPages, setTotalPages, setCurrentPage, pageParams, pageSize } = usePagination(1, 10);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const columns = [
    { 
      header: "#", 
      cell: (row, index) => (currentPage - 1) * pageSize + index + 1, 
      minWidth: "60px" 
    },
    { header: "Plan Name", accessor: "planName" },
    { header: "Product Name", accessor: "productName" },
    {
      header: "Premium (₹)",
      cell: (row) => `₹${row.premiumAmount.toLocaleString("en-IN")}`,
    },
    { header: "Duration", accessor: "duration" },
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

  const fetchPlans = () => {
    setLoading(true);
    getAllPlansPainated(pageParams)
      .then((res) => {
        setPlans(res.content);
        setTotalPages(res.totalPages);
      })
      .catch(() => setError('Could not load plans. Please check your API connection.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPlans();
  }, [currentPage]);

  return (
    <div>
      <PageHeader 
        title="Insurance Plans" 
        subtitle="Manage specific plans and coverages under products"
        action={
          <Link to="/admin/plans/create" className="btn btn-primary d-flex align-items-center gap-2" style={{ borderRadius: '8px' }}>
            <i className="bi bi-plus-lg"></i>
            Create Plan
          </Link>
        }
      />
      
      <ErrorAlert message={error} />
      
      <div className="card border-0" style={{ borderRadius: 16, boxShadow: 'var(--ss-shadow)' }}>
        <div className="card-body p-0">
          <div className="p-4 border-bottom border-light d-flex justify-content-between align-items-center">
            <h6 className="m-0 fw-bold">All Plans</h6>
          </div>
          <div className="p-4">
            <DataTable 
              columns={columns} 
              data={plans} 
              loading={loading}
              onRowClick={(row) => navigate(`/admin/plans/${row.planId}`)}
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

export default PlanListPage;
