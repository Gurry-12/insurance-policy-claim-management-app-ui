import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { forgotPasswordApi, resetPasswordApi } from "../../services/authService";
import logoSrc from "../../assets/logo/insurance-heart-vector.png";
import "../css/Login.css";

const ForgotPassword = () => {
  const navigate = useNavigate();

  // State Step 1
  const [email, setEmail] = useState("");
  // State Step 2
  const [resetData, setResetData] = useState({
    emailOtp: "",
    phoneOtp: "",
    newPassword: ""
  });
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    
    if (!email.trim()) {
      setApiError("Email is required.");
      return;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setApiError("Enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      await forgotPasswordApi({ email });
      toast.success("OTP sent to your registered email and phone number.");
      setStep(2);
    } catch (err) {
      setApiError(err.response?.data?.message || "Failed to request password reset.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetChange = (e) => {
    const { name, value } = e.target;
    setResetData(prev => ({ ...prev, [name]: value }));
    setApiError("");
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    if (!resetData.emailOtp.trim() || !resetData.phoneOtp.trim()) {
      setApiError("Both Email OTP and Phone OTP are required.");
      return;
    }

    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{6,15}$/;
    if (!passRegex.test(resetData.newPassword)) {
      setApiError("Password must be 6-15 characters and contain at least one uppercase letter, one lowercase letter, one digit, and one special character (@#$%^&+=!).");
      return;
    }

    try {
      setLoading(true);
      await resetPasswordApi({
        email,
        emailOtp: resetData.emailOtp,
        phoneOtp: resetData.phoneOtp,
        newPassword: resetData.newPassword
      });
      toast.success("Password has been reset successfully.");
      navigate("/login");
    } catch (err) {
      setApiError(err.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-viewport d-flex align-items-center justify-content-center p-3 p-md-4">
      <div className="master-glass-card p-3 p-md-5">
        <div className="row g-0 align-items-center">
          <div className="col-lg-6 d-flex justify-content-center justify-content-lg-start pe-lg-4">
            <div className="inner-form-card">
              <div className="mb-2 text-start">
                <h1 className="form-display-title">
                  {step === 1 ? "Forgot Password" : "Reset Password"}
                </h1>
                <p className="text-muted" style={{ fontSize: "0.9rem" }}>
                  {step === 1 
                    ? "Enter your email to receive an OTP." 
                    : "Enter the OTPs sent to your email and phone, along with your new password."}
                </p>
              </div>

              {apiError && (
                <div className="custom-alert-box d-flex align-items-center gap-2 mb-3" role="alert">
                  <i className="bi bi-exclamation-circle-fill text-danger" />
                  <span>{apiError}</span>
                </div>
              )}

              {step === 1 ? (
                <form onSubmit={handleForgotPasswordSubmit} noValidate>
                  <div className="mb-3 text-start">
                    <label htmlFor="fp-email" className="custom-field-label">Email</label>
                    <input
                      id="fp-email"
                      type="email"
                      className="form-control pristine-input"
                      placeholder="username@gmail.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setApiError("");
                      }}
                      disabled={loading}
                    />
                  </div>
                  <button type="submit" className="btn login-submit-btn w-100 mt-2 mb-3" disabled={loading}>
                    {loading ? (
                      <><span className="spinner-border spinner-border-sm me-2" />Sending...</>
                    ) : "Send Reset OTP"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleResetPasswordSubmit} noValidate>
                  <div className="mb-3 text-start">
                    <label htmlFor="emailOtp" className="custom-field-label">Email OTP</label>
                    <input
                      id="emailOtp"
                      name="emailOtp"
                      type="text"
                      className="form-control pristine-input text-center fs-5 tracking-wider"
                      placeholder="------"
                      maxLength="6"
                      value={resetData.emailOtp}
                      onChange={handleResetChange}
                      disabled={loading}
                    />
                  </div>

                  <div className="mb-3 text-start">
                    <label htmlFor="phoneOtp" className="custom-field-label">Phone OTP</label>
                    <input
                      id="phoneOtp"
                      name="phoneOtp"
                      type="text"
                      className="form-control pristine-input text-center fs-5 tracking-wider"
                      placeholder="------"
                      maxLength="6"
                      value={resetData.phoneOtp}
                      onChange={handleResetChange}
                      disabled={loading}
                    />
                  </div>

                  <div className="mb-3 text-start">
                    <label htmlFor="newPassword" className="custom-field-label">New Password</label>
                    <div className="input-embedded-wrapper">
                      <input
                        id="newPassword"
                        name="newPassword"
                        type={showPw ? "text" : "password"}
                        className="form-control pristine-input"
                        placeholder="New Password"
                        value={resetData.newPassword}
                        onChange={handleResetChange}
                        disabled={loading}
                      />
                      <button
                        type="button"
                        className="input-embedded-trigger"
                        onClick={() => setShowPw(v => !v)}
                        tabIndex="-1"
                      >
                        <i className={`bi ${showPw ? "bi-eye-slash" : "bi-eye"}`} />
                      </button>
                    </div>
                  </div>

                  <button type="submit" className="btn login-submit-btn w-100 mt-2 mb-3" disabled={loading}>
                    {loading ? (
                      <><span className="spinner-border spinner-border-sm me-2" />Resetting...</>
                    ) : "Reset Password"}
                  </button>
                </form>
              )}

              <p className="text-center mb-0 login-footer-text">
                Remember your password?{" "}
                <Link to="/login" className="login-footer-link">
                  Back to Login
                </Link>
              </p>
            </div>
          </div>

          <div className="col-lg-6 character-canvas-panel">
            <img src={logoSrc} className="floating-brand-character" alt="InsuranceFlow dynamic brand character" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
