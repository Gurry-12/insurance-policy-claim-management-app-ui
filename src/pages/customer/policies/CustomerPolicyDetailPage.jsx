import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPolicyById } from "../../../services/policyService";
import PageHeader from "../../../components/common/PageHeader";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import StatusBadge from "../../../components/ui/StatusBadge";
import { Shield, ArrowLeft, CreditCard, History } from "lucide-react";

const CustomerPolicyDetailPage = () => {
  const { policyId } = useParams();
  const [policy, setPolicy] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    fetchPolicy();
  }, [policyId]);

  if (isLoading) return <LoadingSpinner text="Loading policy details..." />;
  if (!policy) return <div className="alert alert-warning">Policy not found</div>;

  return (
    <div className="animate-fade-in">
      <PageHeader
        title={`Policy ${policy.policyNumber}`}
        subtitle="Detailed view of your insurance policy"
        icon={Shield}
        action={
          <div className="d-flex gap-2">
            {policy.policyStatus === "PENDING_PAYMENT" && (
              <Link
                to={`/customer/payments/pay/${policy.policyId}`}
                className="btn btn-success d-flex align-items-center"
              >
                <CreditCard size={18} className="me-2" />
                Pay Premium
              </Link>
            )}
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

      <div className="row mt-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white border-bottom-0 pt-4 pb-0">
              <h5 className="card-title mb-0">Policy Information</h5>
            </div>
            <div className="card-body">
              <div className="row g-4">
                <div className="col-sm-6">
                  <div className="text-muted small mb-1">Status</div>
                  <StatusBadge status={policy.policyStatus} />
                </div>
                <div className="col-sm-6">
                  <div className="text-muted small mb-1">Plan Name</div>
                  <div className="fw-semibold">{policy.planName}</div>
                </div>
                <div className="col-sm-6">
                  <div className="text-muted small mb-1">Premium Amount</div>
                  <div className="fw-semibold">₹{policy.premiumAmount?.toLocaleString()}</div>
                </div>
                <div className="col-sm-6">
                  <div className="text-muted small mb-1">Coverage Amount</div>
                  <div className="fw-semibold">₹{policy.coverageAmount?.toLocaleString()}</div>
                </div>
                <div className="col-sm-6">
                  <div className="text-muted small mb-1">Issue Date</div>
                  <div className="fw-semibold">
                    {policy.issueDate ? new Date(policy.issueDate).toLocaleDateString() : "-"}
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="text-muted small mb-1">Expiry Date</div>
                  <div className="fw-semibold">
                    {policy.expiryDate ? new Date(policy.expiryDate).toLocaleDateString() : "-"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerPolicyDetailPage;
