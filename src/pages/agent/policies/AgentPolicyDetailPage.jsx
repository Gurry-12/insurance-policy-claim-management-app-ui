

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPolicyById } from "../../../services/policyService";
import PageHeader from "../../../components/common/PageHeader";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import StatusBadge from "../../../components/ui/StatusBadge";
import { Shield, ArrowLeft, CreditCard } from "lucide-react";

const AgentPolicyDetailPage = () => {
  const { policyId } = useParams();

  const [policy, setPolicy] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        setIsLoading(true);
        const data = await getPolicyById(policyId);
        setPolicy(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPolicy();
  }, [policyId]);

  
  if (isLoading) {
    return <LoadingSpinner text="Loading policy details..." />;
  }

  if (!policy) {
    return <div className="alert alert-warning">Policy not found</div>;
  }

  
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
        subtitle="Detailed view of client's insurance policy"
        icon={Shield}
        action={
          <Link
            to="/agent/policies"
            className="btn btn-outline-secondary d-flex align-items-center"
          >
            <ArrowLeft size={18} className="me-2" />
            Back
          </Link>
        }
      />

      <div className="row g-4 mt-2">
        {/* Left Side */}
        <div className="col-lg-4">
          <div
            className="card border-0 shadow-sm mb-4"
            style={{ borderRadius: 16 }}
          >
            <div className="card-body p-4 text-center">
              <div className="mb-3 d-flex justify-content-center">
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 14,
                    backgroundColor: "rgba(59,130,246,0.1)",
                    color: "#3b82f6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Shield size={32} />
                </div>
              </div>

              <h5 className="fw-bold mb-1">{policy.policyNumber}</h5>
              <p className="text-muted mb-3">{policy.planName}</p>

              <div className="d-flex justify-content-center mb-3">
                <StatusBadge status={policy.policyStatus} />
              </div>

              <hr className="my-4" />

              <div className="text-start">
                <div className="mb-3">
                  <small className="text-muted d-block fw-bold">
                    Premium Amount
                  </small>
                  <span className="fs-5 fw-bold">
                    ₹{policy.premiumAmount?.toLocaleString()}
                  </span>
                </div>

              

                <div className="mb-3">
                  <small className="text-muted d-block fw-bold">
                    Coverage Amount
                  </small>
                  <span className="fs-5 fw-bold">
                    ₹{policy.coverageAmount?.toLocaleString()}
                  </span>
                </div>

                <div className="mb-3">
                  <small className="text-muted d-block fw-bold">
                    Start Date
                  </small>
                  <span>
                    {policy.startDate
                      ? new Date(policy.startDate).toLocaleDateString()
                      : "-"}
                  </span>
                </div>

                <div className="mb-3">
                  <small className="text-muted d-block fw-bold">
                    End Date
                  </small>
                  <span>
                    {policy.endDate
                      ? new Date(policy.endDate).toLocaleDateString()
                      : "-"}
                  </span>
                </div>

                  {showPayButton && (
              <Link
                to={`/agent/payments/pay/${policy.policyId}`}
                className="btn btn-success w-100 py-2 d-flex align-items-center justify-content-center gap-2 mt-3"
                style={{ borderRadius: "8px" }}
              >
                <CreditCard size={18} />
                Pay Premium
              </Link>
            )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="col-lg-8">
          <div
            className="card border-0 shadow-sm mb-4"
            style={{ borderRadius: 16 }}
          >
            <div className="card-header bg-white border-bottom-0 pt-4 pb-0">
              <h5 className="fw-bold mb-0 text-primary">
                Policy Information
              </h5>
            </div>

            <div className="card-body p-4">
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="text-muted small mb-1">
                    Customer Name
                  </div>
                  <div className="fw-semibold">
                    {policy.customerName || "-"}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="text-muted small mb-1">
                    Product Type
                  </div>
                  <div className="fw-semibold">
                    {policy.productType}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="text-muted small mb-1">
                    Plan Name
                  </div>
                  <div className="fw-semibold">
                    {policy.planName}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="text-muted small mb-1">
                    Premium Type
                  </div>
                  <div className="fw-semibold">
                    {policy.premiumType?.replace("_", " ")}
                  </div>
                </div>

                {/* <div className="col-md-6">
                  <div className="text-muted small mb-1">
                    Premium Amount
                  </div>
                  <div className="fw-semibold">
                    ₹{policy.premiumAmount?.toLocaleString()}
                  </div>
                </div> */}

                {/* <div className="col-md-6">
                  <div className="text-muted small mb-1">
                    Coverage Amount
                  </div>
                  <div className="fw-semibold">
                    ₹{policy.coverageAmount?.toLocaleString()}
                  </div>
                </div> */}

                <div className="col-md-6">
                  <div className="text-muted small mb-1">
                    Total Premium Paid
                  </div>
                  <div className="fw-semibold">
                    ₹{policy.totalPremiumPaid?.toLocaleString()}
                  </div>
                </div>

                {/* <div className="col-md-6">
                  <div className="text-muted small mb-1">
                    Policy Status
                  </div>
                  <StatusBadge status={policy.policyStatus} />
                </div> */}

                {/* <div className="col-md-6">
                  <div className="text-muted small mb-1">
                    Start Date
                  </div>
                  <div className="fw-semibold">
                    {policy.startDate
                      ? new Date(policy.startDate).toLocaleDateString()
                      : "-"}
                  </div>
                </div> */}

                {/* <div className="col-md-6">
                  <div className="text-muted small mb-1">
                    End Date
                  </div>
                  <div className="fw-semibold">
                    {policy.endDate
                      ? new Date(policy.endDate).toLocaleDateString()
                      : "-"}
                  </div>
                </div> */}

                <div className="col-md-6">
                  <div className="text-muted small mb-1">
                    Created Date
                  </div>
                  <div className="fw-semibold">
                    {policy.createdDate
                      ? new Date(policy.createdDate).toLocaleString()
                      : "-"}
                  </div>
                </div>

                {/* <div className="col-md-6">
                  <div className="text-muted small mb-1">
                    Policy Number
                  </div>
                  <div className="fw-semibold">
                    {policy.policyNumber}
                  </div>
                </div>*/}
              </div> 
            </div>
          </div>

         </div>
      </div>
    </div>
  );
};

export default AgentPolicyDetailPage;