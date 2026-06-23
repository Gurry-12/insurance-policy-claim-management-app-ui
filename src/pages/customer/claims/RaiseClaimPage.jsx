import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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

  const handleChange = (e) => {
    setClaim({
      ...claim,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!claim.policyId || !claim.claimAmount || !claim.claimReason || !claim.incidentDate) {
      alert("All fields are required");
      return;
    }

    if (files.length === 0) {
      alert("Upload at least one document");
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
      alert("Claim Raised Successfully");
      navigate("/customer/claims");
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || "Unable to raise claim");
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
                  <label className="form-label fw-medium">Select Policy</label>
                  {isLoadingPolicies ? (
                    <div className="form-control text-muted bg-light">Loading policies...</div>
                  ) : (
                    <select
                      className="form-select"
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
                </div>

                <div className="mb-3">
                  <label className="form-label fw-medium">Claim Amount (₹)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="claimAmount"
                    value={claim.claimAmount}
                    onChange={handleChange}
                    placeholder="Enter amount"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-medium">Incident Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="incidentDate"
                    value={claim.incidentDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-medium">Claim Reason</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    name="claimReason"
                    value={claim.claimReason}
                    onChange={handleChange}
                    placeholder="Describe the reason for the claim"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-medium">Supporting Documents</label>
                  <input
                    type="file"
                    multiple
                    className="form-control"
                    onChange={(e) => setFiles([...e.target.files])}
                    required
                  />
                  <div className="form-text">Upload at least one document to support your claim.</div>
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