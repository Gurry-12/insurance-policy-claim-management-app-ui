  import { useEffect, useState } from "react";
import { getAllPayments } from "../../../services/paymentService";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/common/PageHeader";
import StatusBadge from "../../../components/ui/StatusBadge";

const AgentPaymentListPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
  
  const loadPayments = async () => {
    try {
      const data = await getAllPayments();
      setPayments(data.content || []);
    } catch (error) {
      console.error("Error loading payments:", error);
    } finally {
      setLoading(false);
    }
  };
  loadPayments();
  }, []);

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
          <button className="btn btn-secondary d-flex align-items-center gap-1" onClick={() => navigate("/agent/dashboard")}>
            <i className="bi bi-arrow-left"></i> Back
          </button>
        }
      />

      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>Policy ID</th>
              <th>Policy Number</th>
              <th>Amount</th>
              <th>Payment Mode</th>
              <th>Transaction Ref</th>
              <th>Status</th>
              <th>Payment Date</th>
            </tr>
          </thead>

          <tbody>
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
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AgentPaymentListPage;
