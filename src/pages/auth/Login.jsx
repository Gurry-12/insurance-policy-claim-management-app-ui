import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { login as loginService } from "../../services/authService";
import { ROLE_HOME } from "../../utils/roles";
import logoSrc from "../../assets/logo/insurance-heart-vector.png";
import ResendOtp from "../../components/auth/ResendOtp";
import "../css/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showUnverifiedModal, setShowUnverifiedModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    setApiError("");
  };

  const validate = () => {
    const errs = {};
    if (!formData.email.trim()) {
      errs.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = "Enter a valid email.";
    }
    if (!formData.password.trim()) errs.password = "Password is required.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    try {
      setLoading(true);
      const { token, user } = await loginService(formData);
      login(token, user);
      const from = location.state?.from?.pathname;
      navigate(from || ROLE_HOME[user.role] || "/", { replace: true });
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Invalid email or password. Please try again.";
      
      // Show modal to trigger OTP resend if the account is unverified
      if (msg.toLowerCase().includes("verif")) {
        setShowUnverifiedModal(true);
      } else {
        setApiError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-viewport d-flex align-items-center justify-content-center p-3 p-md-4">
      {/* Main Container Layer */}
      <div className="master-glass-card p-3 p-md-5">
        <div className="row g-0 align-items-center">
          {/* Left Form View Container */}
          <div className="col-lg-6 d-flex justify-content-center justify-content-lg-start pe-lg-4">
            <div className="inner-form-card">
              {/* Header Context Elements */}
              <div className="mb-2 text-start">
                <h1 className="form-display-title">Login</h1>
              </div>

              {/* API Communication Alert State */}
              {apiError && (
                <div
                  className="custom-alert-box d-flex align-items-center gap-2 mb-3"
                  role="alert"
                >
                  <i className="bi bi-exclamation-circle-fill text-danger" />
                  <span>{apiError}</span>
                </div>
              )}

              {/* Main Credentials Interface Form */}
              <form onSubmit={handleSubmit} noValidate>
                {/* Email Context Frame */}
                <div className="mb-3 text-start">
                  <label htmlFor="login-email" className="custom-field-label">
                    Email
                  </label>
                  <input
                    id="login-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="form-control pristine-input"
                    placeholder="username@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  {errors.email && (
                    <div className="input-error-tip">
                      <i className="bi bi-x-circle-fill" /> {errors.email}
                    </div>
                  )}
                </div>

                {/* Password Context Frame */}
                <div className="mb-3 text-start">
                  <label
                    htmlFor="login-password"
                    className="custom-field-label"
                  >
                    Password
                  </label>
                  <div className="input-embedded-wrapper">
                    <input
                      id="login-password"
                      name="password"
                      type={showPw ? "text" : "password"}
                      autoComplete="current-password"
                      className="form-control pristine-input"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="input-embedded-trigger"
                      onClick={() => setShowPw((v) => !v)}
                      aria-label={showPw ? "Hide password" : "Show password"}
                    >
                      <i
                        className={`bi ${showPw ? "bi-eye-slash" : "bi-eye"}`}
                      />
                    </button>
                  </div>

                  {errors.password && (
                    <div className="input-error-tip">
                      <i className="bi bi-x-circle-fill" /> {errors.password}
                    </div>
                  )}


                </div>
                
                <div className="text-end mt-1 mb-3">
                  <Link to="/forgot-password" className="login-footer-link" style={{ fontSize: "0.85rem", textDecoration: "none" }}>Forgot Password?</Link>
                </div>

                {/* Action Handling Execution trigger */}
                <button
                  id="login-submit-btn"
                  type="submit"
                  className="btn login-submit-btn w-100 mt-2 mb-3"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>

              {/* Traversal Redirection Option */}
              <p className="text-center mb-0 login-footer-text">
                Don't have an account yet?{" "}
                <Link to="/register" className="login-footer-link">
                  Register for free
                </Link>
              </p>
            </div>
          </div>

          {/* Right Brand Graphic Presentation Frame */}
          <div className="col-lg-6 character-canvas-panel">
            <img
              src={logoSrc}
              className="floating-brand-character"
              alt="InsuranceFlow dynamic brand character"
            />
          </div>
        </div>
      </div>

      {/* Unverified Account OTP Modal */}
      <ResendOtp
        email={formData.email}
        triggerButton={false}
        isOpenProp={showUnverifiedModal}
        onClose={() => setShowUnverifiedModal(false)}
        onSuccess={() => {
          setShowUnverifiedModal(false);
          navigate("/verify-otp", { state: { email: formData.email } });
        }}
      />
    </div>
  );
};

export default Login;
