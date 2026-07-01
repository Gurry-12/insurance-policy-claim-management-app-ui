import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from 'react-hot-toast';
import { raiseClaim } from "../../../services/claimService";
import { getMyPolicies } from "../../../services/policyService";
import PageHeader from "../../../components/common/PageHeader";
import { FilePlus, ArrowLeft, Save, ShieldCheck, AlertCircle, FileText, Calendar, IndianRupee, FileUp, Info, X } from "lucide-react";

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
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = [];
      for (let i = 0; i < e.target.files.length; i++) {
        newFiles.push(e.target.files[i]);
      }
      setFiles((prev) => [...prev, ...newFiles]);
      if (errors.files) {
        setErrors((prev) => ({ ...prev, files: '' }));
      }
    }
  };

  const removeFile = (indexToRemove) => {
    setFiles(files.filter((_, index) => index !== indexToRemove));
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
    <div className="animate-fade-in pb-5">
      <PageHeader
        title="Raise a Claim"
        subtitle="Submit a new insurance claim and track its progress."
        icon={FilePlus}
        action={
          <Link to="/customer/claims" className="btn btn-outline-secondary rounded-pill px-4">
            <ArrowLeft size={18} className="me-2" />
            Back to Claims
          </Link>
        }
      />

      <div className="row g-4 mt-2">
        {/* Left Column: Instructions & Tips */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '16px', background: 'linear-gradient(145deg, #f0f7ff 0%, #ffffff 100%)' }}>
            <div className="card-body p-4">
              <div className="d-flex align-items-center mb-3">
                <ShieldCheck size={28} className="text-primary me-2" />
                <h5 className="mb-0 fw-bold text-dark">Claim Process</h5>
              </div>
              <p className="text-muted small mb-4">
                We've made claiming simple. Fill out the details, attach your proof, and we'll handle the rest.
              </p>

              <div className="d-flex mb-3">
                <div className="me-3">
                  <div className="bg-white rounded-circle d-flex justify-content-center align-items-center shadow-sm" style={{ width: 36, height: 36 }}>
                    <span className="fw-bold text-primary">1</span>
                  </div>
                </div>
                <div>
                  <h6 className="fw-bold mb-1">Select Policy</h6>
                  <p className="text-muted small mb-0">Choose the active policy for your claim.</p>
                </div>
              </div>

              <div className="d-flex mb-3">
                <div className="me-3">
                  <div className="bg-white rounded-circle d-flex justify-content-center align-items-center shadow-sm" style={{ width: 36, height: 36 }}>
                    <span className="fw-bold text-primary">2</span>
                  </div>
                </div>
                <div>
                  <h6 className="fw-bold mb-1">Incident Details</h6>
                  <p className="text-muted small mb-0">Provide date, amount, and a clear reason.</p>
                </div>
              </div>

              <div className="d-flex">
                <div className="me-3">
                  <div className="bg-white rounded-circle d-flex justify-content-center align-items-center shadow-sm" style={{ width: 36, height: 36 }}>
                    <span className="fw-bold text-primary">3</span>
                  </div>
                </div>
                <div>
                  <h6 className="fw-bold mb-1">Upload Proof</h6>
                  <p className="text-muted small mb-0">Attach invoices, reports, or photos.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="alert alert-info border-0 shadow-sm d-flex" style={{ borderRadius: '16px' }}>
            <Info size={24} className="text-info me-3 flex-shrink-0 mt-1" />
            <div>
              <h6 className="fw-bold mb-1">Need Help?</h6>
              <p className="small mb-0">If you are unsure about what documents to upload, please contact our support team before submitting.</p>
            </div>
          </div>
        </div>

        {/* Right Column: The Form */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
            <div className="card-body p-4 p-md-5">
              <form onSubmit={handleSubmit}>
                <h5 className="fw-bold mb-4 border-bottom pb-3">Claim Information</h5>
                
                <div className="row g-4 mb-4">
                  <div className="col-md-12">
                    <label className="form-label fw-medium text-secondary">
                      Select Policy <span className="text-danger">*</span>
                    </label>
                    <div className="input-group input-group-lg">
                      <span className="input-group-text bg-light border-end-0">
                        <FileText size={20} className="text-muted" />
                      </span>
                      {isLoadingPolicies ? (
                        <div className="form-control bg-light border-start-0 text-muted">Loading policies...</div>
                      ) : (
                        <select
                          className={`form-select border-start-0 ps-0 bg-light ${errors.policyId ? 'is-invalid' : ''}`}
                          name="policyId"
                          value={claim.policyId}
                          onChange={handleChange}
                        >
                          <option value="">-- Choose an active policy --</option>
                          {policies.map((policy) => (
                            <option key={policy.id || policy.policyId} value={policy.id || policy.policyId}>
                              {policy.planName ? `${policy.planName} (No: ${policy.policyNumber})` : `Policy No: ${policy.policyNumber}`}
                            </option>
                          ))}
                        </select>
                      )}
                      {errors.policyId && <div className="invalid-feedback">{errors.policyId}</div>}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-medium text-secondary">
                      Claim Amount <span className="text-danger">*</span>
                    </label>
                    <div className="input-group input-group-lg">
                      <span className="input-group-text bg-light border-end-0">
                        <IndianRupee size={20} className="text-muted" />
                      </span>
                      <input
                        type="number"
                        className={`form-control border-start-0 ps-0 bg-light ${errors.claimAmount ? 'is-invalid' : ''}`}
                        name="claimAmount"
                        value={claim.claimAmount}
                        onChange={handleChange}
                        placeholder="e.g. 5000"
                      />
                      {errors.claimAmount && <div className="invalid-feedback">{errors.claimAmount}</div>}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-medium text-secondary">
                      Incident Date <span className="text-danger">*</span>
                    </label>
                    <div className="input-group input-group-lg">
                      <span className="input-group-text bg-light border-end-0">
                        <Calendar size={20} className="text-muted" />
                      </span>
                      <input
                        type="date"
                        className={`form-control border-start-0 ps-0 bg-light ${errors.incidentDate ? 'is-invalid' : ''}`}
                        name="incidentDate"
                        value={claim.incidentDate}
                        onChange={handleChange}
                        max={new Date().toISOString().split("T")[0]}
                      />
                      {errors.incidentDate && <div className="invalid-feedback">{errors.incidentDate}</div>}
                    </div>
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-medium text-secondary">
                      Reason for Claim <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0 align-items-start pt-3">
                        <AlertCircle size={20} className="text-muted" />
                      </span>
                      <textarea
                        className={`form-control border-start-0 ps-0 bg-light ${errors.claimReason ? 'is-invalid' : ''}`}
                        rows="4"
                        name="claimReason"
                        value={claim.claimReason}
                        onChange={handleChange}
                        placeholder="Please describe what happened in detail..."
                      />
                      {errors.claimReason && <div className="invalid-feedback">{errors.claimReason}</div>}
                    </div>
                  </div>
                </div>

                <h5 className="fw-bold mb-4 border-bottom pb-3 mt-5">Supporting Documents</h5>

                <div className="mb-4">
                  <div className={`p-5 text-center border rounded-3 bg-light position-relative ${errors.files ? 'border-danger' : 'border-dashed'}`} style={{ borderStyle: 'dashed', borderWidth: '2px', borderColor: 'var(--ip-border)' }}>
                    <FileUp size={48} className="text-primary mb-3 opacity-75" />
                    <h6 className="fw-bold">Upload your files here</h6>
                    <p className="text-muted small mb-3">Supported formats: PDF, JPG, PNG. Max 5MB per file.</p>
                    <input
                      type="file"
                      multiple
                      className="form-control position-absolute top-0 start-0 w-100 h-100 opacity-0"
                      onChange={handleFileChange}
                      style={{ cursor: 'pointer', zIndex: 10 }}
                    />
                    <button type="button" className="btn btn-outline-primary rounded-pill px-4" style={{ pointerEvents: 'none' }}>
                      Browse Files
                    </button>
                  </div>
                  
                  {files.length > 0 && (
                    <div className="mt-4">
                      <h6 className="fw-medium mb-3 text-secondary">Selected Files ({files.length})</h6>
                      <div className="row g-3">
                        {files.map((file, index) => {
                          const isImage = file.type.startsWith('image/');
                          const previewUrl = isImage ? URL.createObjectURL(file) : null;
                          return (
                            <div key={index} className="col-md-6 col-lg-4">
                              <div className="border rounded-3 p-2 d-flex align-items-center bg-white shadow-sm position-relative h-100">
                                <div className="me-3 flex-shrink-0 bg-light rounded d-flex align-items-center justify-content-center overflow-hidden" style={{ width: '48px', height: '48px' }}>
                                  {isImage ? (
                                    <img src={previewUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                  ) : (
                                    <FileText size={24} className="text-primary" />
                                  )}
                                </div>
                                <div className="text-truncate flex-grow-1 pe-4">
                                  <div className="fw-medium small text-truncate" title={file.name}>{file.name}</div>
                                  <div className="text-muted" style={{ fontSize: '11px' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeFile(index)}
                                  className="btn btn-sm btn-light text-danger position-absolute top-50 end-0 translate-middle-y me-2 rounded-circle p-1"
                                  style={{ width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {errors.files && <div className="text-danger small mt-2 d-block">{errors.files}</div>}
                </div>

                <div className="d-flex justify-content-end mt-5 pt-3 border-top">
                  <Link to="/customer/claims" className="btn btn-light rounded-pill px-4 me-3">
                    Cancel
                  </Link>
                  <button 
                    type="submit" 
                    className="btn btn-primary rounded-pill px-5 d-flex align-items-center shadow-sm"
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
                        Submit Claim
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