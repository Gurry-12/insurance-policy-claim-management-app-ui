import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from 'react-hot-toast';
import { purchasePolicy } from "../../../services/policyService";
import { getPlanById } from "../../../services/planService";
import PageHeader from "../../../components/common/PageHeader";
import { Calendar, Shield, IndianRupee, Clock } from "lucide-react";
import LoadingSpinner from "../../../components/common/LoadingSpinner";

const PurchasePolicyPage = () => {
  const { planId } = useParams();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [planDetails, setPlanDetails] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(true);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const data = await getPlanById(planId);
        setPlanDetails(data);
      } catch (error) {
        toast.error("Failed to load plan details");
      } finally {
        setLoadingPlan(false);
      }
    };
    fetchPlan();
  }, [planId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!acceptedTerms) {
      toast.error("You must accept the terms and declarations.");
      return;
    }
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
        subtitle="Review your plan details and confirm your purchase"
      />

      <div className="row justify-content-center mt-4">
        <div className="col-md-8 col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4 p-md-5">
              <div className="d-flex align-items-center mb-4">
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                  <Shield size={24} className="text-primary" />
                </div>
                <div>
                  <h5 className="card-title mb-1">Review Plan</h5>
                  <p className="card-text text-muted small mb-0">Please verify the details below</p>
                </div>
              </div>

              {loadingPlan ? (
                <LoadingSpinner />
              ) : planDetails ? (
                <div className="bg-light p-3 rounded mb-4">
                  <h6 className="fw-bold mb-3">{planDetails.planName || "Plan Details"}</h6>
                  
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="text-muted"><IndianRupee size={16} className="me-1"/> Coverage Amount</span>
                    <span className="fw-semibold">₹{(planDetails.coverageAmount || 0).toLocaleString('en-IN')}</span>
                  </div>
                  
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="text-muted"><IndianRupee size={16} className="me-1"/> Premium Amount</span>
                    <span className="fw-semibold">₹{(planDetails.premiumAmount || 0).toLocaleString('en-IN')} / {planDetails.premiumType || 'Year'}</span>
                  </div>

                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="text-muted"><Clock size={16} className="me-1"/> Term</span>
                    <span className="fw-semibold">{planDetails.duration || 0} Years</span>
                  </div>

                  <div className="d-flex align-items-center justify-content-between">
                    <span className="text-muted"><Calendar size={16} className="me-1"/> Start Date</span>
                    <span className="fw-semibold">{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              ) : (
                <div className="alert alert-warning">Plan details could not be loaded. You may proceed at your own risk.</div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4 form-check">
                  <input 
                    type="checkbox" 
                    className="form-check-input" 
                    id="termsCheck" 
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    required
                  />
                  <label className="form-check-label text-muted small" htmlFor="termsCheck">
                    I declare that the information provided is correct. I agree to the terms and conditions and acknowledge that my policy coverage will begin starting today. Note: Cancellation policies apply as per standard terms.
                  </label>
                </div>

                <button
                  className="btn btn-primary btn-lg w-100 mt-2"
                  type="submit"
                  disabled={isSubmitting || !acceptedTerms}
                >
                  {isSubmitting ? (
                    <span className="d-flex align-items-center justify-content-center">
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Processing...
                    </span>
                  ) : (
                    "Confirm & Purchase Policy"
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