import  { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../../components/common/PageHeader';
import DataTable from '../../../components/tables/DataTable';
import PaginationBar from '../../../components/tables/PaginationBar';
import StatusBadge from '../../../components/ui/StatusBadge';
import { getAllCustomers } from '../../../services/customerService';

const CustomerListPage = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
const [customers, setCustomers] = useState(null);

  const columns = [
    { header: "Customer ID", accessor: "customerId", minWidth: "100px" },
    { header: "Name", accessor: "fullName" },
    { header: "Email", accessor: "email" },
    { header: "Phone", accessor: "mobileNumber" },
    { header: "Joined", accessor: "createdDate" },
    {
      header: "Status",
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: "Actions",
      cell: (row) => (
        <button
          className="btn btn-sm btn-light text-primary border-0"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/admin/customers/${row.customerId}`);
          }}
        >
          <i className="bi bi-eye"></i> View
        </button>
      ),
    },
  ];

  useEffect( () => {
    getAllCustomers().then(setCustomers).catch( (error) => console.log(error))
  }, []);

  return (
    <div>
      <PageHeader 
        title="Customers Management" 
        subtitle="View and manage all registered customers"
      />
      
      <div className="card border-0" style={{ borderRadius: 16, boxShadow: 'var(--ss-shadow)' }}>
        <div className="card-body p-0">
          <div className="p-4 border-bottom border-light d-flex justify-content-between align-items-center">
            <h6 className="m-0 fw-bold">All Customers</h6>
            <div className="input-group" style={{ width: '250px' }}>
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input type="text" className="form-control border-start-0 ps-0" placeholder="Search customers..." />
            </div>
          </div>
          <div className="p-4">
            <DataTable 
              columns={columns} 
              data={customers} 
              onRowClick={(row) => navigate(`/admin/customers/${row.id}`)}
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

export default CustomerListPage;
