import { useEffect, useState } from "react";
import { getMyPayments } from "../../../services/paymentService";
import PageHeader from "../../../components/common/PageHeader";
import StatusBadge from "../../../components/ui/StatusBadge";
import { FileText, CheckCircle, Clock, XCircle } from "lucide-react";
import ExportButton from "../../../components/common/ExportButton";

const CustomerPaymentHistoryPage = () => {
  const [payments, setPayments] = useState([]);

  const fetchPayments = async () => {
    try {
      const response = await getMyPayments();
      setPayments(response.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  

  const getStatusIcon = (status) => {
    switch (status) {
      case "SUCCESS": return <CheckCircle size={16} className="me-1" />;
      case "PENDING": return <Clock size={16} className="me-1" />;
      case "FAILED": return <XCircle size={16} className="me-1" />;
      default: return null;
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="My Payment History"
        subtitle="View all your past and recent premium payments"
        icon={FileText}
        action={
          <ExportButton
            data={payments || []}
            columns={[
              { header: "Policy Number", accessor: "policyNumber" },
              { header: "Amount (₹)", accessor: "amount" },
              { header: "Payment Mode", accessor: "paymentMode" },
              { header: "Status", accessor: "paymentStatus" },
              { header: "Reference", accessor: "transactionReference" },
              { header: "Payment Date", accessor: "paymentDate" }
            ]}
            filename="my_payments.csv"
          />
        }
      />

      <div className="card border-0 shadow-sm mt-4">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="px-4 py-3">Sr. No.</th>
                  <th className="px-4 py-3">Policy Number</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Mode</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Transaction Ref</th>
                  <th className="px-4 py-3">Payment Date</th>
                </tr>
              </thead>

              <tbody>
                {payments.length > 0 ? (
                  payments.map((payment, index) => (
                    <tr key={payment.paymentId}>
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3 fw-medium">{payment.policyNumber}</td>
                      <td className="px-4 py-3">₹ {payment.amount?.toLocaleString()}</td>
                      <td className="px-4 py-3">{payment.paymentMode}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={payment.paymentStatus} icon={getStatusIcon(payment.paymentStatus)} />
                      </td>
                      <td className="px-4 py-3 text-muted">{payment.transactionReference}</td>
                      <td className="px-4 py-3">
                        {new Date(payment.paymentDate).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-5 text-muted">
                      <div className="d-flex flex-column align-items-center">
                        <FileText size={48} className="mb-3 text-secondary opacity-50" />
                        <p className="mb-0">No Payments Found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerPaymentHistoryPage;