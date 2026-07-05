import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import PageHeader from "../../../components/common/PageHeader";
import { Wallet } from "lucide-react";
import { recordPayment } from "../../../services/paymentService";
import { getPolicyById } from "../../../services/policyService";
const StaffRecordPaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { policyId } = useParams();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    policyId: policyId || "",
    amount: location.state?.amount || "",
    paymentMode: "CARD",
    paymentStatus: "SUCCESS",
  });

  const [errors, setErrors] = useState({});
  const [policyDetails, setPolicyDetails] = useState(null);

  useEffect(() => {
    if (policyId) {
      getPolicyById(policyId)
        .then((res) => {
          setPolicyDetails(res);
          if (!formData.amount) {
            setFormData((prev) => ({
              ...prev,
              amount: res.premiumAmount || "",
            }));
          }
        })
        .catch((err) => console.error(err));
    }
  }, [policyId, formData.amount]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const errs = {};
    if (!formData.policyId) {
      errs.policyId = "Policy is required.";
    }
    if (!formData.amount || Number(formData.amount) <= 0) {
      errs.amount = "Amount must be greater than zero.";
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setLoading(false);
      return;
    }

    try {
      await recordPayment(formData);
      toast.success("Payment recorded successfully!");
      setTimeout(() => navigate("/staff/payments"), 2000);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Failed to record payment",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Record Premium Payment"
        subtitle="Record payment for the selected policy"
        onBack={() => navigate("/staff/policies")}
      />

      <div className="row justify-content-center mt-4">
        <div className="col-md-8 col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4 p-md-5">
              <div className="d-flex align-items-center mb-4">
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                  <Wallet size={24} className="text-primary" />
                </div>
                <div>
                  <h5 className="card-title mb-1">Payment Details</h5>
                  <p className="card-text text-muted small mb-0">
                    Record premium payment information
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label fw-medium">
                    Policy <span className="text-danger">*</span>
                  </label>
                  <select
                    name="policyId"
                    className={`form-select form-select-lg ${errors.policyId ? "is-invalid" : ""}`}
                    value={formData.policyId}
                    onChange={handleChange}
                    required
                    disabled
                  >
                    {policyDetails ? (
                      <option
                        value={policyDetails.policyId || policyDetails.id}
                      >
                        {policyDetails.planName
                          ? `${policyDetails.planName} (No: ${policyDetails.policyNumber})`
                          : `Policy No: ${policyDetails.policyNumber}`}
                      </option>
                    ) : (
                      <option value={formData.policyId}>
                        Loading policy details...
                      </option>
                    )}
                  </select>
                  {errors.policyId && (
                    <div className="invalid-feedback">{errors.policyId}</div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="form-label fw-medium">
                    Premium Amount (₹) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    name="amount"
                    className={`form-control form-control-lg ${errors.amount ? "is-invalid" : ""}`}
                    value={formData.amount}
                    placeholder="Amount auto-filled"
                    required
                    readOnly
                  />
                  {errors.amount && (
                    <div className="invalid-feedback">{errors.amount}</div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="form-label fw-medium">Payment Mode</label>
                  <select
                    name="paymentMode"
                    className="form-select form-select-lg"
                    value={formData.paymentMode}
                    onChange={handleChange}
                  >
                    <option value="CARD">Credit/Debit Card</option>
                    <option value="NET_BANKING">Net Banking</option>
                    <option value="UPI">UPI</option>
                    <option value="CASH">Cash</option>
                  </select>
                </div>

                <button
                  className="btn btn-primary btn-lg w-100 mt-2"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="d-flex align-items-center justify-content-center">
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Recording...
                    </span>
                  ) : (
                    "Record Payment"
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

export default StaffRecordPaymentPage;
