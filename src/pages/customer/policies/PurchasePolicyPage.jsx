import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { notify } from "../../../utils/notificationService";
import { purchasePolicy } from "../../../services/policyService";
import { getPlanById } from "../../../services/planService";
import { generateQuote } from "../../../services/quoteService";
import PageHeader from "../../../components/common/PageHeader";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import Stepper from "../../../components/common/Stepper";
import PremiumBreakdownCard from "../../../components/customer/PremiumBreakdownCard";
import QuoteCountdownTimer from "../../../components/customer/QuoteCountdownTimer";
import { Shield, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";

const STEPS = ["Coverage", "Duration", "Quote", "Payment", "Policy"];

const PurchasePolicyPage = () => {
  const { planId } = useParams();
  const navigate = useNavigate();

  const [loadingPlan, setLoadingPlan] = useState(true);
  const [planDetails, setPlanDetails] = useState(null);

  // Step management
  const [currentStep, setCurrentStep] = useState(0);

  // Selection state
  const [selectedCoverage, setSelectedCoverage] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [selectedPremiumType, setSelectedPremiumType] = useState("");

  // Quote state
  const [isGeneratingQuote, setIsGeneratingQuote] = useState(false);
  const [quoteData, setQuoteData] = useState(null);
  const [quoteExpired, setQuoteExpired] = useState(false);

  // Purchase state
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const data = await getPlanById(planId);
        setPlanDetails(data.data || data);
      } catch (error) {
        notify.error("Failed to load plan details");
      } finally {
        setLoadingPlan(false);
      }
    };
    fetchPlan();
  }, [planId]);

  // Invalidate quote when selections change
  useEffect(() => {
    if (quoteData) {
      setQuoteData(null);
      setQuoteExpired(false);
      setAcceptedTerms(false);
    }
  }, [selectedCoverage, selectedDuration, selectedPremiumType]);

  const handleGenerateQuote = async () => {
    setIsGeneratingQuote(true);
    try {
      const payload = {
        planId: Number(planId),
        coverageAmount: Number(selectedCoverage),
        duration: Number(selectedDuration),
        premiumType: selectedPremiumType,
      };
      const res = await generateQuote(payload);
      setQuoteData(res.data || res);
      setQuoteExpired(false);
      notify.success("Quote generated successfully!");
      setCurrentStep(2); // Move to Quote step
    } catch (error) {
      console.error(error);
      notify.error(error.message || "Failed to generate quote.");
    } finally {
      setIsGeneratingQuote(false);
    }
  };

  const handlePurchase = async (e) => {
    e.preventDefault();
    if (!acceptedTerms) {
      setErrors({ acceptedTerms: "You must accept the terms and declarations." });
      return;
    }
    if (quoteExpired) {
      notify.error("Quote has expired. Please generate a new quote.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        quoteId: quoteData.quoteId || quoteData.id,
        paymentReferenceId: `PAY_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      };

      const res = await purchasePolicy(payload);
      notify.success("Policy Purchased Successfully!");
      setCurrentStep(4); // Move to Policy (success) step
    } catch (error) {
      console.error(error);
      notify.error(error.message || "Failed to purchase policy.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 0:
        return !!selectedCoverage;
      case 1:
        return !!selectedDuration && !!selectedPremiumType;
      case 2:
        return !!quoteData && !quoteExpired;
      case 3:
        return acceptedTerms && !quoteExpired;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep === 1 && canProceedToNext()) {
      handleGenerateQuote();
    } else if (currentStep === 2 && canProceedToNext()) {
      setCurrentStep(3);
    } else if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleStepClick = (step) => {
    if (step < currentStep) {
      setCurrentStep(step);
    }
  };

  if (loadingPlan) {
    return (
      <div className="animate-fade-in text-center mt-5">
        <LoadingSpinner />
        <p className="mt-2 text-muted">Loading plan details...</p>
      </div>
    );
  }

  if (!planDetails) {
    return (
      <div className="alert alert-danger m-4">
        Plan details could not be loaded. Please go back and try again.
      </div>
    );
  }

  return (
    <div className="animate-fade-in mb-5">
      <PageHeader
        title={planDetails.planName || "Purchase Policy"}
        subtitle="Configure your coverage and complete your purchase"
        onBack={() => navigate(-1)}
      />

      <div className="row justify-content-center mt-4">
        <div className="col-md-10 col-lg-8">
          {/* Stepper */}
          <Stepper steps={STEPS} currentStep={currentStep} onStepClick={handleStepClick} />

          <div className="card border-0 shadow-sm">
            <div className="card-body p-4 p-md-5">
              {/* Step 0: Coverage Selection */}
              {currentStep === 0 && (
                <div className="animate-fade-in">
                  <h5 className="fw-bold mb-1">
                    <Shield size={20} className="text-primary me-2" />
                    Select Coverage Amount
                  </h5>
                  <p className="text-muted small mb-4">Choose the coverage amount that best suits your needs.</p>

                  <div className="row g-3">
                    {planDetails.coverageOptions?.map((opt, idx) => {
                      const amount = opt.coverageAmount || opt;
                      const isSelected = selectedCoverage === String(amount);
                      return (
                        <div key={idx} className="col-md-6">
                          <div
                            className={`p-3 rounded-3 border text-center cursor-pointer transition-all ${
                              isSelected
                                ? "border-primary bg-primary bg-opacity-10"
                                : "border-light bg-light"
                            }`}
                            style={{ cursor: "pointer" }}
                            onClick={() => setSelectedCoverage(String(amount))}
                          >
                            <div className={`fw-bold fs-5 ${isSelected ? "text-primary" : "text-dark"}`}>
                              ₹{(amount / 100000).toLocaleString("en-IN")}L
                            </div>
                            <small className="text-muted">Coverage</small>
                            {isSelected && (
                              <div className="mt-2">
                                <CheckCircle size={18} className="text-primary" />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 1: Duration & Premium Type */}
              {currentStep === 1 && (
                <div className="animate-fade-in">
                  <h5 className="fw-bold mb-1">Select Duration & Payment Type</h5>
                  <p className="text-muted small mb-4">Choose your policy term and premium payment frequency.</p>

                  <div className="mb-4">
                    <label className="form-label fw-bold">Policy Duration</label>
                    <div className="d-flex flex-wrap gap-2">
                      {planDetails.allowedDurations?.map((dur, idx) => (
                        <button
                          key={idx}
                          className={`btn ${selectedDuration === String(dur) ? "btn-primary" : "btn-outline-primary"}`}
                          onClick={() => setSelectedDuration(String(dur))}
                        >
                          {dur} Year{dur > 1 ? "s" : ""}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-bold">Premium Payment Frequency</label>
                    <div className="d-flex flex-wrap gap-2">
                      {(planDetails.supportedPremiumType
                        ? [planDetails.supportedPremiumType]
                        : planDetails.supportedPremiumTypes || []
                      ).map((type, idx) => (
                        <button
                          key={idx}
                          className={`btn ${selectedPremiumType === type ? "btn-primary" : "btn-outline-primary"}`}
                          onClick={() => setSelectedPremiumType(type)}
                        >
                          {type.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Selection Summary */}
                  <div className="p-3 rounded-3" style={{ backgroundColor: 'var(--ip-surface-raised, #f8fafc)' }}>
                    <small className="text-muted d-block mb-2 fw-bold">Your Selection</small>
                    <div className="d-flex gap-4">
                      <div>
                        <span className="text-muted small">Coverage: </span>
                        <span className="fw-bold">
                          ₹{Number(selectedCoverage).toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted small">Duration: </span>
                        <span className="fw-bold">{selectedDuration} Year(s)</span>
                      </div>
                      <div>
                        <span className="text-muted small">Payment: </span>
                        <span className="fw-bold">{selectedPremiumType}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Quote Review */}
              {currentStep === 2 && (
                <div className="animate-fade-in">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="fw-bold mb-0">
                      <CheckCircle size={20} className="text-success me-2" />
                      Your Quote
                    </h5>
                    {quoteData?.expiresAt && (
                      <QuoteCountdownTimer expiresAt={quoteData.expiresAt} onExpire={() => setQuoteExpired(true)} />
                    )}
                  </div>

                  {quoteExpired ? (
                    <div className="alert alert-warning">
                      <i className="bi bi-exclamation-triangle me-2" />
                      Quote has expired. Please go back and generate a new quote.
                    </div>
                  ) : (
                    <>
                      <PremiumBreakdownCard quoteDetails={quoteData} />

                      <div className="p-3 rounded-3 mt-3" style={{ backgroundColor: "var(--ip-success-bg, #f0fdf4)", border: "1px solid var(--ip-success-subtle, #bbf7d0)" }}>
                        <small className="text-success fw-bold d-block mb-2">Quote Summary</small>
                        <div className="row g-2 small">
                          <div className="col-6">
                            <span className="text-muted">Coverage: </span>
                            <span className="fw-bold">₹{Number(selectedCoverage).toLocaleString("en-IN")}</span>
                          </div>
                          <div className="col-6">
                            <span className="text-muted">Duration: </span>
                            <span className="fw-bold">{selectedDuration} Year(s)</span>
                          </div>
                          <div className="col-6">
                            <span className="text-muted">Payment Type: </span>
                            <span className="fw-bold">{selectedPremiumType}</span>
                          </div>
                          {quoteData.quoteId && (
                            <div className="col-6">
                              <span className="text-muted">Quote ID: </span>
                              <span className="fw-bold">#{quoteData.quoteId}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Step 3: Payment & Confirmation */}
              {currentStep === 3 && (
                <div className="animate-fade-in">
                  <h5 className="fw-bold mb-1">
                    <i className="bi bi-credit-card text-primary me-2" />
                    Confirm & Purchase
                  </h5>
                  <p className="text-muted small mb-4">Review your details and confirm your purchase.</p>

                  {/* Final Summary */}
                  <div className="p-4 rounded-3 mb-4" style={{ backgroundColor: 'var(--ip-surface-raised, #f8fafc)' }}>
                    <div className="row g-3">
                      <div className="col-6">
                        <small className="text-muted d-block">Plan</small>
                        <span className="fw-bold">{planDetails.planName}</span>
                      </div>
                      <div className="col-6">
                        <small className="text-muted d-block">Coverage</small>
                        <span className="fw-bold">₹{Number(selectedCoverage).toLocaleString("en-IN")}</span>
                      </div>
                      <div className="col-6">
                        <small className="text-muted d-block">Duration</small>
                        <span className="fw-bold">{selectedDuration} Year(s)</span>
                      </div>
                      <div className="col-6">
                        <small className="text-muted d-block">Payment Type</small>
                        <span className="fw-bold">{selectedPremiumType}</span>
                      </div>
                    </div>
                  </div>

                  <PremiumBreakdownCard quoteDetails={quoteData} />

                  <form onSubmit={handlePurchase} noValidate className="mt-4">
                    <div className="mb-4 form-check">
                      <input
                        type="checkbox"
                        className={`form-check-input ${errors.acceptedTerms ? "is-invalid" : ""}`}
                        id="termsCheck"
                        checked={acceptedTerms}
                        disabled={quoteExpired}
                        onChange={(e) => {
                          setAcceptedTerms(e.target.checked);
                          if (errors.acceptedTerms) setErrors({});
                        }}
                      />
                      <label className="form-check-label text-muted small" htmlFor="termsCheck">
                        I declare that the information provided is correct. I agree to the terms and conditions and
                        acknowledge that my policy coverage will begin starting today. Note: Cancellation policies apply as
                        per standard terms.
                      </label>
                      {errors.acceptedTerms && (
                        <div className="input-error-tip text-danger mt-1">
                          <i className="bi bi-x-circle-fill" /> {errors.acceptedTerms}
                        </div>
                      )}
                    </div>
                  </form>
                </div>
              )}

              {/* Step 4: Success */}
              {currentStep === 4 && (
                <div className="animate-fade-in text-center py-4">
                  <div
                    className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4"
                    style={{ width: 80, height: 80, backgroundColor: "var(--ip-success-subtle, #d1fae5)", color: "var(--ip-success, #10b981)" }}
                  >
                    <CheckCircle size={40} />
                  </div>
                  <h4 className="fw-bold text-success mb-2">Policy Purchased Successfully!</h4>
                  <p className="text-muted mb-4">
                    Your policy has been created. You can view your policy details in the My Policies section.
                  </p>
                  <button className="btn btn-primary px-4" onClick={() => navigate("/customer/policies")}>
                    View My Policies
                  </button>
                </div>
              )}

              {/* Navigation Buttons */}
              {currentStep < 4 && (
                <div className="d-flex justify-content-between mt-4 pt-3 border-top">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={handleBack}
                    disabled={currentStep === 0}
                  >
                    <ArrowLeft size={16} className="me-1" />
                    Back
                  </button>

                  {currentStep === 3 ? (
                    <button
                      className="btn btn-primary btn-lg px-5"
                      onClick={handlePurchase}
                      disabled={isSubmitting || !canProceedToNext()}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Confirm & Purchase
                          <CheckCircle size={16} className="ms-2" />
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary"
                      onClick={handleNext}
                      disabled={!canProceedToNext() || isGeneratingQuote}
                    >
                      {isGeneratingQuote ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Generating Quote...
                        </>
                      ) : currentStep === 1 ? (
                        <>
                          Generate Quote
                          <ArrowRight size={16} className="ms-1" />
                        </>
                      ) : (
                        <>
                          Next
                          <ArrowRight size={16} className="ms-1" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchasePolicyPage;
