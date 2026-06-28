import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from 'react-hot-toast';
import { purchasePolicy } from "../../../services/policyService";
import PageHeader from "../../../components/common/PageHeader";
import { ShoppingCart, Calendar, AlertCircle } from "lucide-react";

const PurchasePolicyPage = () => {
  const { planId } = useParams();
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};

    if (!startDate) {
      errs.startDate = "Coverage start date is required";
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setIsSubmitting(true);

    try {
      await purchasePolicy({
        planId: Number(planId),
        startDate,
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
        subtitle="Select a start date to purchase this insurance plan"
        icon={ShoppingCart}
        backButton={true}
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
                  <p className="card-text text-muted small mb-0">Choose when your coverage begins</p>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label fw-medium">Coverage Start Date <span className="text-danger">*</span></label>
                  <input
                    type="date"
                    className={`form-control form-control-lg ${errors.startDate ? 'is-invalid' : ''}`}
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      if (errors.startDate) setErrors(prev => ({ ...prev, startDate: '' }));
                    }}
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                  {errors.startDate && <div className="invalid-feedback">{errors.startDate}</div>}
                  <div className="form-text mt-2 text-muted">
                    Your policy coverage will begin on this date.
                  </div>
                </div>

                <button
                  className="btn btn-primary btn-lg w-100 mt-2"
                  type="submit"
                  disabled={isSubmitting || !startDate}
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