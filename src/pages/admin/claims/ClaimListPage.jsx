import  { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../../components/common/PageHeader';
import DataTable from '../../../components/tables/DataTable';
import PaginationBar from '../../../components/tables/PaginationBar';
import StatusBadge from '../../../components/ui/StatusBadge';
import { getAllClaims } from '../../../services/claimService';

const ClaimListPage = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [claims, setClaims] = useState(null);

  const columns = [
    { header: "Claim ID", accessor: "claimNumber", minWidth: "100px" },
    { header: "Policy #", accessor: "policyId" },
    { header: "Customer", accessor: "customerName" },
    {
      header: "Amount (₹)",
      cell: (row) => `₹${row.claimAmount.toLocaleString("en-IN")}`,
    },
    { header: "Date Filed", accessor: "date" },
    {
      header: "Status",
      cell: (row) => <StatusBadge status={row.claimStatus} />,
    },
    {
      header: "Actions",
      cell: (row) => (
        <button
          className="btn btn-sm btn-light text-primary border-0"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/admin/claims/${row.claimId}`);
          }}
        >
          <i className="bi bi-eye"></i> Review
        </button>
      ),
    },
  ];

  useEffect( () => {
    getAllClaims().then(setClaims);
  }, []);

  return (
    <div>
      <PageHeader 
        title="Claims Management" 
        subtitle="Review and process all incoming insurance claims"
      />
      
      <div className="card border-0" style={{ borderRadius: 16, boxShadow: 'var(--ss-shadow)' }}>
        <div className="card-body p-0">
          <div className="p-4 border-bottom border-light d-flex flex-wrap gap-3 justify-content-between align-items-center">
            <div className="d-flex gap-2">
              <button className="btn btn-sm btn-primary px-3 rounded-pill">All Claims</button>
              <button className="btn btn-sm btn-light px-3 rounded-pill text-muted">Pending</button>
              <button className="btn btn-sm btn-light px-3 rounded-pill text-muted">Approved</button>
            </div>
            <div className="input-group" style={{ width: '250px' }}>
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input type="text" className="form-control border-start-0 ps-0" placeholder="Search claims..." />
            </div>
          </div>
          <div className="p-4">
            <DataTable 
              columns={columns} 
              data={claims} 
              onRowClick={(row) => navigate(`/admin/claims/${row.id}`)}
            />
            <PaginationBar 
              currentPage={currentPage} 
              totalPages={1} 
              onPageChange={setCurrentPage} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimListPage;
