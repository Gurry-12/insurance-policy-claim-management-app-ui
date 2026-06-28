import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from 'react-hot-toast';
import { raiseClaim } from "../../../services/claimService";
import { getMyPolicies } from "../../../services/policyService";
import PageHeader from "../../../components/common/PageHeader";
import { FilePlus, ArrowLeft, Save } from "lucide-react";

const RaiseClaimPage = () => {
  const navigate = useNavigate();

  const [claim, setClaim] = useState({
    policyId: "",
    claimAmount: "",
    claimReason: "",
    incidentDate: "",
  });

  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [policies, setPolicies] = useState([]);
  const [isLoadingPolicies, setIsLoadingPolicies] = useState(true);

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const response = await getMyPolicies();
        setPolicies(response.content || response.data || (Array.isArray(response) ? response : []));
      } catch (error) {
        console.error("Failed to fetch policies:", error);
      } finally {
        setIsLoadingPolicies(false);
      }
    };
    fetchPolicies();
  }, []);

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setClaim({
      ...claim,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
    if (errors.files) {
      setErrors(prev => ({ ...prev, files: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};

    if (!claim.policyId) errs.policyId = 'Policy is required';
    if (!claim.claimAmount) errs.claimAmount = 'Claim amount is required';
    if (!claim.incidentDate) errs.incidentDate = 'Incident date is required';
    if (!claim.claimReason) errs.claimReason = 'Claim reason is required';
    if (files.length === 0) errs.files = 'Upload at least one document';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();

      const claimBlob = new Blob([JSON.stringify(claim)], {
        type: "application/json",
      });

      formData.append("claim", claimBlob);

      files.forEach((file) => {
        formData.append("files", file);
      });

      await raiseClaim(formData);
      toast.success("Claim Raised Successfully");
      navigate("/customer/claims");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Unable to raise claim");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Raise Claim"
        subtitle="Submit a new insurance claim"
        icon={FilePlus}
        action={
          <Link to="/customer/claims" className="btn btn-outline-secondary">
            <ArrowLeft size={18} className="me-2" />
            Back to Claims
          </Link>
        }
      />

      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-medium">Select Policy <span className="text-danger">*</span></label>
                  {isLoadingPolicies ? (
                    <div className="form-control text-muted bg-light">Loading policies...</div>
                  ) : (
                    <select
                      className={`form-select ${errors.policyId ? 'is-invalid' : ''}`}
                      name="policyId"
                      value={claim.policyId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Select a Policy --</option>
                      {policies.map((policy) => (
                        <option key={policy.id || policy.policyId} value={policy.id || policy.policyId}>
                          {policy.planName ? `${policy.planName} (ID: ${policy.id || policy.policyId})` : `Policy ID: ${policy.id || policy.policyId}`}
                        </option>
                      ))}
                    </select>
                  )}
                  {errors.policyId && <div className="invalid-feedback d-block">{errors.policyId}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label fw-medium">Claim Amount (₹) <span className="text-danger">*</span></label>
                  <input
                    type="number"
                    className={`form-control ${errors.claimAmount ? 'is-invalid' : ''}`}
                    name="claimAmount"
                    value={claim.claimAmount}
                    onChange={handleChange}
                    placeholder="Enter amount"
                    required
                  />
                  {errors.claimAmount && <div className="invalid-feedback">{errors.claimAmount}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label fw-medium">Incident Date <span className="text-danger">*</span></label>
                  <input
                    type="date"
                    className={`form-control ${errors.incidentDate ? 'is-invalid' : ''}`}
                    name="incidentDate"
                    value={claim.incidentDate}
                    onChange={handleChange}
                    required
                  />
                  {errors.incidentDate && <div className="invalid-feedback">{errors.incidentDate}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label fw-medium">Claim Reason <span className="text-danger">*</span></label>
                  <textarea
                    className={`form-control ${errors.claimReason ? 'is-invalid' : ''}`}
                    rows="4"
                    name="claimReason"
                    value={claim.claimReason}
                    onChange={handleChange}
                    placeholder="Describe the reason for the claim"
                    required
                  />
                  {errors.claimReason && <div className="invalid-feedback">{errors.claimReason}</div>}
                </div>

                <div className="mb-4">
                  <label className="form-label fw-medium">Supporting Documents <span className="text-danger">*</span></label>
                  <input
                    type="file"
                    multiple
                    className={`form-control ${errors.files ? 'is-invalid' : ''}`}
                    onChange={handleFileChange}
                    required
                  />
                  {errors.files ? (
                    <div className="invalid-feedback">{errors.files}</div>
                  ) : (
                    <div className="form-text">Upload at least one document to support your claim.</div>
                  )}
                </div>

                <div className="d-grid">
                  <button 
                    type="submit" 
                    className="btn btn-primary d-flex justify-content-center align-items-center"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Save size={18} className="me-2" />
                        Raise Claim
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RaiseClaimPage;