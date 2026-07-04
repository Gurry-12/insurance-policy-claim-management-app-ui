import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from 'react-hot-toast';
import { purchasePolicy } from "../../../services/policyService";
import PageHeader from "../../../components/common/PageHeader";
import { Calendar } from "lucide-react";

const PurchasePolicyPage = () => {
  const { planId } = useParams();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await purchasePolicy({
        planId: Number(planId),
        startDate: new Date().toISOString().split('T')[0],
      });

      toast.success("Policy Purchased Successfully");
      navigate("/customer/policies");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to purchase policy");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Purchase Policy"
        subtitle="Confirm your purchase for this insurance plan"
      />

      <div className="row justify-content-center mt-4">
        <div className="col-md-8 col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4 p-md-5">
              <div className="d-flex align-items-center mb-4">
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                  <Calendar size={24} className="text-primary" />
                </div>
                <div>
                  <h5 className="card-title mb-1">Policy Details</h5>
                  <p className="card-text text-muted small mb-0">Your coverage will begin today</p>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <p className="fw-medium text-dark">
                    Date of Purchase: {new Date().toLocaleDateString()}
                  </p>
                  <div className="form-text mt-2 text-muted">
                    Your policy coverage will begin starting today.
                  </div>
                </div>

                <button
                  className="btn btn-primary btn-lg w-100 mt-2"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="d-flex align-items-center justify-content-center">
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Processing...
                    </span>
                  ) : (
                    "Purchase Policy"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchasePolicyPage;