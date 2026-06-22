import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageHeader from '../../../components/common/PageHeader';
import DataTable from '../../../components/tables/DataTable';
import PaginationBar from '../../../components/tables/PaginationBar';
import StatusBadge from '../../../components/ui/StatusBadge';
import ConfirmModal from '../../../components/modals/ConfirmModal';
import ErrorAlert from '../../../components/ui/ErrorAlert';
import { activatePlan, deactivatePlan, getAllPlansPainated } from '../../../services/planService';

const PlanListPage = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusModal, setStatusModal] = useState({ isOpen: false, planId: null, currentStatus: false });

  const columns = [
    { header: "Plan ID", accessor: "planId", minWidth: "100px" },
    { header: "Plan Name", accessor: "planName" },
    { header: "Product ID", accessor: "productId" },
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
              navigate(`/admin/plans/edit/${row.planId}`);
            }}
            title="Edit Plan"
          >
            <i className="bi bi-pencil-square"></i>
          </button>
          {row.active ? (
            <button
              className="btn btn-sm btn-light text-warning border-0"
              onClick={(e) => {
                e.stopPropagation();
                setStatusModal({
                  isOpen: true,
                  planId: row.planId,
                  currentStatus: true,
                });
              }}
              title="Deactivate Plan"
            >
              <i className="bi bi-dash-circle"></i>
            </button>
          ) : (
            <button
              className="btn btn-sm btn-light text-success border-0"
              onClick={(e) => {
                e.stopPropagation();
                setStatusModal({
                  isOpen: true,
                  planId: row.planId,
                  currentStatus: false,
                });
              }}
              title="Activate Plan"
            >
              <i className="bi bi-check-circle"></i>
            </button>
          )}
        </div>
      ),
    },
  ];

  const fetchPlans = () => {
    setLoading(true);
    getAllPlansPainated()
      .then(setPlans)
      .catch(() => setError('Could not load plans. Please check your API connection.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPlans();
  }, []);

  const handleStatusToggle = () => {
    const { planId, currentStatus } = statusModal;
    const action = currentStatus ? deactivatePlan(planId) : activatePlan(planId);
    
    setLoading(true);
    setStatusModal({ isOpen: false, planId: null, currentStatus: false });
    
    action
      .then(() => {
        alert(`Plan ${currentStatus ? 'deactivated' : 'activated'} successfully!`);
        fetchPlans();
      })
      .catch(() => {
        alert(`Failed to ${currentStatus ? 'deactivate' : 'activate'} plan.`);
        setLoading(false);
      });
  };

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
            />
            <PaginationBar 
              currentPage={currentPage} 
              totalPages={1} 
              onPageChange={setCurrentPage} 
            />
          </div>
        </div>
      </div>

      <ConfirmModal 
        isOpen={statusModal.isOpen}
        title={statusModal.currentStatus ? "Deactivate Plan" : "Activate Plan"}
        message={statusModal.currentStatus 
          ? "Are you sure you want to deactivate this plan? This will make the plan options unavailable for customers." 
          : "Are you sure you want to activate this plan?"}
        isDanger={statusModal.currentStatus}
        confirmText={statusModal.currentStatus ? "Deactivate" : "Activate"}
        onCancel={() => setStatusModal({ isOpen: false, planId: null, currentStatus: false })}
        onConfirm={handleStatusToggle}
      />
    </div>
  );
};

export default PlanListPage;
