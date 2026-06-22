import { useEffect, useState } from "react";
import { getMyPayments } from "../../../services/paymentService";

const CustomerPaymentHistoryPage = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await getMyPayments();
      setPayments(response.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mt-4">
      <h3>My Payment History</h3>

      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Policy Number</th>
            <th>Amount</th>
            <th>Mode</th>
            <th>Status</th>
            <th>Transaction Ref</th>
            <th>Payment Date</th>
          </tr>
        </thead>

        <tbody>
          {payments.length > 0 ? (
            payments.map((payment) => (
              <tr key={payment.paymentId}>
                <td>{payment.paymentId}</td>
                <td>{payment.policyNumber}</td>
                <td>₹ {payment.amount}</td>
                <td>{payment.paymentMode}</td>
                <td>{payment.paymentStatus}</td>
                <td>{payment.transactionReference}</td>
                <td>
                  {new Date(payment.paymentDate).toLocaleString()}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                No Payments Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerPaymentHistoryPage;