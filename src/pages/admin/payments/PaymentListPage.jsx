import  { useEffect, useState } from 'react';
import PageHeader from '../../../components/common/PageHeader';
import DataTable from '../../../components/tables/DataTable';
import PaginationBar from '../../../components/tables/PaginationBar';
import StatusBadge from '../../../components/ui/StatusBadge';
import { getAllPayments } from '../../../services/paymentService';
import ErrorAlert from '../../../components/ui/ErrorAlert';

const PaymentListPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const columns = [
    {
      header: "Transaction ID",
      accessor: "transactionReference",
      minWidth: "110px",
    },
    { header: "Policy #", accessor: "policyNumber" },
    {
      header: "Amount (₹)",
      cell: (row) => `₹${row.amount.toLocaleString("en-IN")}`,
    },
    { header: "Payment Method", accessor: "paymentMode" },
    { header: "Date", accessor: "paymentDate" },
    {
      header: "Status",
      cell: (row) => <StatusBadge status={row.paymentStatus} />,
    },
  ];

  useEffect( () => {
      getAllPayments()
        .then(setPayments)
        .catch(() => setError('Could not load payment transactions. Please check your API connection.'))
        .finally(() => setLoading(false));
  }, [] );

  return (
    <div>
      <PageHeader 
        title="Payments & Transactions" 
        subtitle="View all incoming payments and transaction history"
      />
      
      <ErrorAlert message={error} />
      
      <div className="card border-0" style={{ borderRadius: 16, boxShadow: 'var(--ss-shadow)' }}>
        <div className="card-body p-0">
          <div className="p-4 border-bottom border-light d-flex justify-content-between align-items-center">
            <h6 className="m-0 fw-bold">Recent Transactions</h6>
            <div className="input-group" style={{ width: '250px' }}>
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input type="text" className="form-control border-start-0 ps-0" placeholder="Search transactions..." />
            </div>
          </div>
          <div className="p-4">
            <DataTable 
              columns={columns} 
              data={payments} 
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
    </div>
  );
};

export default PaymentListPage;
