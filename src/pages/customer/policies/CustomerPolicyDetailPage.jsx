import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPolicyById } from "../../../services/policyService";
import { getPaymentsByMyPolicy } from "../../../services/paymentService";
import PageHeader from "../../../components/common/PageHeader";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import StatusBadge from "../../../components/ui/StatusBadge";
import { Shield, ArrowLeft, CreditCard, History } from "lucide-react";

const CustomerPolicyDetailPage = () => {
  const { policyId } = useParams();
  const [policy, setPolicy] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchPolicyData = async () => {
      try {
        setIsLoading(true);
        const data = await getPolicyById(policyId);
        setPolicy(data);
        
        try {
          const paymentData = await getPaymentsByMyPolicy(policyId);
          // If the backend wraps the list in a data object, extract it safely
          const paymentsList = Array.isArray(paymentData) ? paymentData : (paymentData?.data || []);
          setPayments(paymentsList);
        } catch (err) {
          console.error("Failed to fetch payments:", err);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPolicyData();
  }, [policyId]);

  if (isLoading) return <LoadingSpinner text="Loading policy details..." />;
  if (!policy) return <div className="alert alert-warning">Policy not found</div>;

  // const premiumType = policy.premiumType || 'ONE_TIME';
  
  // let hasPendingPayments;
  // const paymentsCount = Array.isArray(payments) ? payments.length : 0;
  // let hasPendingPayments = false;
  // const paymentsCount = Array.isArray(payments) ? payments.length : 0;

  // if (premiumType === 'ONE_TIME') {
  //   hasPendingPayments = paymentsCount < 1;
  // } else {
  //   // For ANNUAL plans, display the button until the end date
  //   const endDate = policy.endDate ? new Date(policy.endDate) : null;
  //   if (endDate && !isNaN(endDate.getTime())) {
  //     hasPendingPayments = new Date() <= endDate;
  //   } else {
  //     const durationInYears = policy.duration || 1;
  //     hasPendingPayments = paymentsCount < Math.max(1, durationInYears);
  //   }
  // }

  // const showPayButton = policy.policyStatus === 'PENDING_PAYMENT' || 
  //                       (hasPendingPayments && policy.policyStatus !== 'CANCELLED' && policy.policyStatus !== 'EXPIRED');

  const premiumType = policy.premiumType || "ONE_TIME";

let hasPendingPayments = false;

if (premiumType === "ONE_TIME") {
  hasPendingPayments = policy.policyStatus === "PENDING_PAYMENT";
} else {
  const endDate = policy.endDate ? new Date(policy.endDate) : null;

  if (endDate && !isNaN(endDate.getTime())) {
    hasPendingPayments = new Date() <= endDate;
  }
}

const showPayButton =
  hasPendingPayments &&
  policy.policyStatus !== "CANCELLED" &&
  policy.policyStatus !== "EXPIRED";
  return (
    <div className="animate-fade-in">
      <PageHeader
        title={`Policy ${policy.policyNumber}`}
        subtitle="Detailed view of your insurance policy"
        icon={Shield}
        action={
          <div className="d-flex gap-2">
            <Link
              to={`/customer/payments`}
              className="btn btn-outline-primary d-flex align-items-center"
            >
              <History size={18} className="me-2" />
              Payment History
            </Link>
            <Link to="/customer/policies" className="btn btn-outline-secondary d-flex align-items-center">
              <ArrowLeft size={18} className="me-2" />
              Back
            </Link>
          </div>
        }
      />

      <div className="row g-4 mt-2">
        {/* Left Side: Summary and Actions */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: 16 }}>
            <div className="card-body p-4 text-center">
              <div className="mb-3 d-flex justify-content-center">
                <div style={{
                  width: 64, height: 64, borderRadius: 14, backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem'
                }}>
                  <Shield size={32} />
                </div>
              </div>
              <h5 className="fw-bold mb-1">{policy.policyNumber}</h5>
              <p className="text-muted mb-3">{policy.planName}</p>
              <div className="d-flex justify-content-center gap-2 mb-2">
                <StatusBadge status={policy.policyStatus} />
              </div>

              <hr className="my-4" style={{ borderColor: '#e5e7eb' }} />

              <div className="text-start mb-4">
                <div className="mb-3">
                  <small className="text-muted d-block fw-bold">Premium Amount</small>
                  <span className="fs-5 fw-bold text-dark">₹{policy.premiumAmount?.toLocaleString()}</span>
                </div>
                <div className="mb-3">
                  <small className="text-muted d-block fw-bold">Start Date</small>
                  <span>{policy.startDate ? new Date(policy.startDate).toLocaleDateString() : "-"}</span>
                </div>
                <div className="mb-3">
                  <small className="text-muted d-block fw-bold">Expiry Date</small>
                  <span>{policy.endDate ? new Date(policy.endDate).toLocaleDateString() : "-"}</span>
                </div>
              </div>

              {showPayButton && (
                <Link
                  to={`/customer/payments/pay/${policy.policyId}`}
                  className="btn btn-success w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                  style={{ borderRadius: '8px' }}
                >
                  <CreditCard size={18} />
                  Pay Premium
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Plan Coverage & Details */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: 16 }}>
            <div className="card-header bg-white border-bottom-0 pt-4 pb-0">
              <h5 className="fw-bold mb-0 text-primary">Policy Information</h5>
            </div>
            <div className="card-body p-4">
              <div className="row g-4">
                <div className="col-sm-6">
                  <div className="text-muted small mb-1">Customer Name</div>
                  <div className="fw-semibold">{policy.customerName}</div>
                </div>
                <div className="col-sm-6">
                  <div className="text-muted small mb-1">Product Type</div>
                  <div className="fw-semibold">{policy.productType}</div>
                </div>
                <div className="col-sm-6">
                  <div className="text-muted small mb-1">Premium Type</div>
                  <div className="fw-semibold">{policy.premiumType?.replace('_', ' ')}</div>
                </div>
                <div className="col-sm-6">
                  <div className="text-muted small mb-1">Coverage Amount</div>
                  <div className="fw-semibold">₹{policy.coverageAmount?.toLocaleString()}</div>
                </div>
                <div className="col-sm-6">
                  <div className="text-muted small mb-1">Remaining Claim Amount</div>
                  <div className="fw-semibold text-success">₹{policy.remainingClaimAmount?.toLocaleString() ?? policy.coverageAmount?.toLocaleString()}</div>
                </div>
                <div className="col-sm-6">
                  <div className="text-muted small mb-1">Total Premium Paid</div>
                  <div className="fw-semibold">₹{policy.totalPremiumPaid?.toLocaleString()}</div>
                </div>
                <div className="col-sm-6">
                  <div className="text-muted small mb-1">Created Date</div>
                  <div className="fw-semibold">
                    {policy.createdDate ? new Date(policy.createdDate).toLocaleString() : "-"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: 16 }}>
            <div className="card-header bg-white border-bottom-0 pt-4 pb-0">
              <h5 className="fw-bold mb-0 text-primary">Payment History</h5>
            </div>
            <div className="card-body p-4">
              {Array.isArray(payments) && payments.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Transaction Ref</th>
                        <th>Amount</th>
                        <th>Mode</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((payment) => (
                        <tr key={payment.paymentId}>
                          <td>{payment.transactionReference}</td>
                          <td className="fw-semibold">₹{payment.amount?.toLocaleString()}</td>
                          <td>{payment.paymentMode?.replace('_', ' ')}</td>
                          <td>
                            <span className={`badge ${payment.paymentStatus === 'SUCCESS' ? 'bg-success' : 'bg-warning text-dark'}`}>
                              {payment.paymentStatus}
                            </span>
                          </td>
                          <td>{new Date(payment.paymentDate).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-muted py-3">No payments found for this policy.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerPolicyDetailPage;
