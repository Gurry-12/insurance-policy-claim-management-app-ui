import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { recordPayment } from "../../../services/paymentService";
import { getMyPolicies } from "../../../services/policyService";
import PageHeader from "../../../components/common/PageHeader";
import { CreditCard, Wallet, AlertCircle } from "lucide-react";

const RecordPaymentPage = () => {
  const navigate = useNavigate();
  const { policyId } = useParams();

  const [formData, setFormData] = useState({
    policyId: policyId || "",
    amount: "",
    paymentMode: "UPI",
    paymentStatus: "SUCCESS",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [policies, setPolicies] = useState([]);
  const [isLoadingPolicies, setIsLoadingPolicies] = useState(true);

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const response = await getMyPolicies();
        const list = response.content || response.data || (Array.isArray(response) ? response : []);
        setPolicies(list);
        
        // If policyId is pre-selected, find and set the default premium amount
        if (policyId && list.length > 0) {
          const selected = list.find(p => String(p.id || p.policyId) === String(policyId));
          if (selected) {
            setFormData(prev => ({
              ...prev,
              amount: selected.premiumAmount || selected.premium || ""
            }));
          }
        }
      } catch (err) {
        console.error("Failed to fetch policies:", err);
      } finally {
        setIsLoadingPolicies(false);
      }
    };
    fetchPolicies();
  }, [policyId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "policyId") {
      const selected = policies.find(p => String(p.id || p.policyId) === String(value));
      setFormData(prev => ({
        ...prev,
        policyId: value,
        amount: selected ? (selected.premiumAmount || selected.premium || "") : ""
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await recordPayment({
        ...formData,
        amount: Number(formData.amount),
      });

      alert("Payment Recorded Successfully");
      navigate("/customer/payments");
    } catch (error) {
      console.error(error);
      setError(error?.response?.data?.message || "Payment Failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Make Payment"
        subtitle="Securely pay your policy premium"
        action={
          <button onClick={() => navigate(-1)} className="btn btn-outline-secondary d-flex align-items-center gap-1" style={{ borderRadius: '8px' }}>
            <i className="bi bi-arrow-left"></i> Back
          </button>
        }
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
                  <p className="card-text text-muted small mb-0">Enter your payment information</p>
                </div>
              </div>

              {error && (
                <div className="alert alert-danger d-flex align-items-center" role="alert">
                  <AlertCircle size={18} className="me-2" />
                  <div>{error}</div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label fw-medium">Select Policy</label>
                  {isLoadingPolicies ? (
                    <div className="form-control form-control-lg bg-light text-muted">Loading policies...</div>
                  ) : (
                    <select
                      name="policyId"
                      className="form-select form-select-lg"
                      value={formData.policyId}
                      onChange={handleChange}
                      required
                      disabled={!!policyId}
                    >
                      <option value="">-- Select a Policy --</option>
                      {policies.map((policy) => (
                        <option key={policy.id || policy.policyId} value={policy.id || policy.policyId}>
                          {policy.planName ? `${policy.planName} (ID: ${policy.id || policy.policyId})` : `Policy ID: ${policy.id || policy.policyId}`}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="mb-4">
                  <label className="form-label fw-medium">Amount (₹)</label>
                  <input
                    type="number"
                    name="amount"
                    className="form-control form-control-lg"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    min="1"
                    placeholder="Enter amount"
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-medium">Payment Mode</label>
                  <select
                    name="paymentMode"
                    className="form-select form-select-lg"
                    value={formData.paymentMode}
                    onChange={handleChange}
                  >
                    <option value="UPI">UPI</option>
                    <option value="CARD">Credit/Debit Card</option>
                    <option value="NET_BANKING">Net Banking</option>
                    <option value="CASH">Cash</option>
                  </select>
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
                    "Pay Premium"
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

export default RecordPaymentPage;