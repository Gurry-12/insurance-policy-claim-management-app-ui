  

  import { useEffect, useState } from "react";
import { getAllPayments } from "../../../services/paymentService";
import { useNavigate } from "react-router-dom";

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
    return <h2>Loading Payments...</h2>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Payment Management</h2>
      </div>

          <div className="d-flex justify-content-end mb-3">
     <button    
        className="btn btn-secondary mb-3"
        onClick={() => navigate("/agent/dashboard")}
      > Back </button>

      </div>
      <div className="content-card">
        <table className="payment-table">
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
                  <td>{payment.paymentId}</td>
                  <td>{payment.policyId}</td>
                  <td>{payment.policyNumber}</td>
                  <td>₹ {payment.amount}</td>
                  <td>{payment.paymentMode}</td>
                  <td>{payment.transactionReference}</td>

                  <td>
                    <span
                      className={
                        payment.paymentStatus === "SUCCESS"
                          ? "approved"
                          : payment.paymentStatus === "FAILED"
                          ? "rejected"
                          : "pending"
                      }
                    >
                      {payment.paymentStatus}
                    </span>
                  </td>

                  <td>
                    {payment.paymentDate
                      ? new Date(payment.paymentDate).toLocaleString()
                      : "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">No Payments Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AgentPaymentListPage;
