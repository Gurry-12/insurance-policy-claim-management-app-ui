import  { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../../components/common/PageHeader';
import DataTable from '../../../components/tables/DataTable';
import PaginationBar from '../../../components/tables/PaginationBar';
import StatusBadge from '../../../components/ui/StatusBadge';
import { getAllCustomersPaginated } from '../../../services/customerService';
import usePagination from '../../../hooks/usePagination';

const CustomerListPage = () => {
  const navigate = useNavigate();
  const { currentPage, totalPages, setTotalPages, setCurrentPage, pageParams, pageSize } = usePagination(1, 10);
  const [customers, setCustomers] = useState(null);

  const columns = [
    { 
      header: "#", 
      cell: (row, index) => (currentPage - 1) * pageSize + index + 1, 
      minWidth: "60px" 
    },
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

  const fetchCustomers = () => {
    getAllCustomersPaginated(pageParams)
      .then((res) => {
        setCustomers(res.content);
        setTotalPages(res.totalPages);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    fetchCustomers();
  }, [currentPage]);

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

export default CustomerListPage;
