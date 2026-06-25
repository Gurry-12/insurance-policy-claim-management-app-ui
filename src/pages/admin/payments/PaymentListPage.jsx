import { useEffect, useState } from 'react';
import PageHeader from '../../../components/common/PageHeader';
import DataTable from '../../../components/tables/DataTable';
import PaginationBar from '../../../components/tables/PaginationBar';
import StatusBadge from '../../../components/ui/StatusBadge';
import { getAllPaymentsPaginated } from '../../../services/paymentService';
import ErrorAlert from '../../../components/ui/ErrorAlert';
import useTableState from '../../../hooks/useTableState';
import SortableHeader from '../../../components/tables/SortableHeader';

const PaymentListPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const tableState = useTableState({
    initialSortBy: 'id',
    initialSortDirection: 'desc'
  });

  const fetchPayments = () => {
    setLoading(true);
    const params = tableState.getQueryParams();
    
    getAllPaymentsPaginated(params)
      .then((res) => {
        setPayments(res.content);
        tableState.setTotalPages(res.totalPages);
        tableState.setTotalElements(res.totalElements || res.totalRecords || 0);
      })
      .catch(() => setError('Could not load payment transactions. Please check your API connection.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPayments();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    tableState.currentPage, 
    tableState.sortBy, 
    tableState.sortDirection, 
    tableState.debouncedSearch
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
      header: renderHeader("Sr. No.", "id"), 
      cell: (row, index) => tableState.getSrNo(index), 
      minWidth: "85px" 
    },
    {
      header: "Transaction ID",
      accessor: "transactionReference",
    },
    { header: "Policy #", accessor: "policyNumber" },
    {
      header: renderHeader("Amount (₹)", "amount"),
      cell: (row) => `₹${row.amount.toLocaleString("en-IN")}`,
    },
    { header: renderHeader("Payment Method", "paymentMode"), accessor: "paymentMode" },
    { header: renderHeader("Date", "paymentDate"), accessor: "paymentDate", cell: (row) => new Date(row.paymentDate).toLocaleDateString() },
    {
      header: renderHeader("Status", "paymentStatus"),
      cell: (row) => <StatusBadge status={row.paymentStatus} />,
    },
  ];

  return (
    <div>
      <PageHeader 
        title="Payments & Transactions" 
        subtitle="View all incoming payments and transaction history"
      />
      
      <ErrorAlert message={error} />
      
      <div className="card border-0" style={{ borderRadius: 16, boxShadow: 'var(--ss-shadow)' }}>
        <div className="card-body p-0">
          <div className="p-4 border-bottom border-light d-flex justify-content-between align-items-center flex-wrap gap-3">
            <h6 className="m-0 fw-bold">Recent Transactions</h6>
            <div className="input-group input-group-sm" style={{ width: '250px' }}>
              <span className="input-group-text bg-white border-end-0" style={{ border: '1px solid var(--ss-border)' }}>
                <i className="bi bi-search text-muted"></i>
              </span>
              <input 
                type="text" 
                className="form-control border-start-0 ps-0" 
                placeholder="Search transactions..." 
                style={{ border: '1px solid var(--ss-border)', borderRadius: '0 8px 8px 0' }}
                value={tableState.searchQuery}
                onChange={(e) => tableState.handleSearchChange(e.target.value)}
              />
            </div>
          </div>
          <div className="p-4">
            <DataTable 
              columns={columns} 
              data={payments} 
              loading={loading}
            />
            <PaginationBar 
              currentPage={tableState.currentPage} 
              totalPages={tableState.totalPages} 
              onPageChange={tableState.setCurrentPage} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentListPage;
