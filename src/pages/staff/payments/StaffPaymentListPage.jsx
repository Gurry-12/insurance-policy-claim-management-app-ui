import { useEffect, useState } from "react";
import { getAllPaymentsPaginated } from "../../../services/paymentService";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/common/PageHeader";
import StatusBadge from "../../../components/ui/StatusBadge";
import ExportButton from "../../../components/common/ExportButton";
import useTableState from "../../../hooks/useTableState";
import PaginationBar from "../../../components/tables/PaginationBar";

const StaffPaymentListPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const tableState = useTableState({
    initialSortBy: 'id',
    initialSortDirection: 'desc'
  });

  useEffect(() => {
    const loadPayments = async () => {
      try {
        setLoading(true);
        const params = tableState.getQueryParams();
        const data = await getAllPaymentsPaginated(params);
        setPayments(data.content || []);
        tableState.setTotalPages(data.totalPages || 1);
        tableState.setTotalElements(data.totalRecords || data.totalElements || 0);
      } catch (error) {
        console.error("Error loading payments:", error);
      } finally {
        setLoading(false);
      }
    };
    loadPayments();
  }, [tableState.currentPage, tableState.sortBy, tableState.sortDirection]);

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch = payment.policyNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transactionReference?.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === "ALL" || payment.paymentStatus?.toUpperCase() === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Payment Management"
        subtitle="Track your client premium transactions"
        action={
          <div className="d-flex gap-2">
            <ExportButton
              data={payments || []}
              columns={[
                { header: "Payment ID", accessor: "paymentId" },
                { header: "Policy ID", accessor: "policyId" },
                { header: "Policy Number", accessor: "policyNumber" },
                { header: "Amount (₹)", accessor: "amount" },
                { header: "Payment Mode", accessor: "paymentMode" },
                { header: "Status", accessor: "paymentStatus" },
                { header: "Date", accessor: "paymentDate" },
                { header: "Reference", accessor: "transactionReference" }
              ]}
              filename="Staff_payments_list.csv"
            />
            <button className="btn btn-secondary d-flex align-items-center gap-1" onClick={() => navigate("/Staff/dashboard")}>
              <i className="bi bi-arrow-left"></i> Back
            </button>
          </div>
        }
      />
      <div className="d-flex gap-2 mb-3">
        <select
          className="form-select"
          style={{ width: "200px" }}
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            tableState.setCurrentPage(1);
          }}
        >
          <option value="ALL">All Payments</option>
          <option value="SUCCESS">Success</option>
          <option value="FAILED">Failed</option>
          <option value="PENDING">Pending</option>
        </select>
        <input
          type="text"
          className="form-control"
          placeholder="Search by Policy Number or Payment Reference Number"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>Policy Number</th>
              <th>Amount</th>
              <th>Payment Mode</th>
              <th>Transaction Ref</th>
              <th>Status</th>
              <th>Payment Date</th>
            </tr>
          </thead>

          {/* <tbody>
            {payments.length > 0 ? (
              payments.map((payment) => (
                <tr key={payment.paymentId}>
                  <td style={{ fontWeight: 600 }}>#{payment.paymentId}</td>
                  <td style={{ fontWeight: 600 }}>#{payment.policyId}</td>
                  <td>{payment.policyNumber}</td>
                  <td style={{ fontWeight: 600 }}>₹ {payment.amount}</td>
                  <td>{payment.paymentMode}</td>
                  <td>{payment.transactionReference}</td>
                  <td>
                    <StatusBadge status={payment.paymentStatus} />
                  </td>
                  <td style={{ color: 'var(--ss-text-muted)' }}>
                    {payment.paymentDate
                      ? new Date(payment.paymentDate).toLocaleString()
                      : "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4">No Payments Found</td>
              </tr>
            )}
          </tbody> */}

                        <tbody>
                {filteredPayments.length > 0 ? (
                  filteredPayments.map((payment,index) => (
                    <tr key={payment.paymentId}>
                      <td style={{ fontWeight: 600 }}>
                        {tableState.getSrNo(index)}
                      </td>

                      <td>{payment.policyNumber}</td>
                      <td style={{ fontWeight: 600 }}>₹ {payment.amount}</td>
                        <td>{payment.paymentMode}</td>
                      <td>{payment.transactionReference}</td>
                      <td><StatusBadge status={payment.paymentStatus} /> </td>

                      <td style={{ color: 'var(--ss-text-muted)' }}>
                        {payment.paymentDate
                          ? new Date(payment.paymentDate).toLocaleString()
                          : "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      No Payments Found
                    </td>
                  </tr>
                )}
              </tbody>
        </table>
      </div>
      {payments.length > 0 && (
        <div className="mt-3">
          <PaginationBar
            currentPage={tableState.currentPage}
            totalPages={tableState.totalPages}
            totalElements={tableState.totalElements}
            pageSize={tableState.pageSize}
            onPageChange={tableState.setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default StaffPaymentListPage;

