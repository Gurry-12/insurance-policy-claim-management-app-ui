import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register as registerService } from "../../services/authService";
import logoSrc from "../../assets/logo/insurance-heart-vector.png";
import "../css/Login.css";

const INIT = {
  fullName: "",
  email: "",
  mobileNumber: "",
  password: "",
};

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(INIT);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    setApiError("");
  };

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) {
      errs.fullName = "Full name is required.";
    }
    if (!formData.mobileNumber.trim()) {
      errs.mobileNumber = "Mobile number is required.";
    } else if (!/^\+?[\d\s-]{10,14}$/.test(formData.mobileNumber.trim())) {
      errs.mobileNumber = "Enter a valid mobile number.";
    }
    if (!formData.email.trim()) {
      errs.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = "Enter a valid email.";
    }
    if (!formData.password) {
      errs.password = "Password is required.";
    } else if (formData.password.length < 6) {
      errs.password = "Password must be at least 6 characters.";
    }
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

      // Exact formatted payload blueprint mapping
      const payload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        mobileNumber: formData.mobileNumber.trim(),
      };

      await registerService(payload);
      setSuccess("Account created! Redirecting to verify email and phone...");
      setTimeout(
        () => navigate("/verify-otp", { state: { registered: true, email: payload.email } }),
        2200,
      );
    } catch (err) {
      setApiError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-viewport d-flex align-items-center justify-content-center p-3 p-md-4">
      <img
        src={logoSrc}
        aria-hidden="true"
        className="bg-watermark-blur"
        alt=""
      />

      {/* Main Container Layer */}
      <div className="master-glass-card p-3 p-md-5">
        <div className="row g-0 align-items-center">
          {/* Left Brand Graphic Presentation Frame */}
          <div className="col-lg-6 character-canvas-panel">
            <img
              src={logoSrc}
              className="floating-brand-character"
              alt="InsuranceFlow dynamic brand character"
            />
          </div>

          {/* Right Form View Container */}
          <div className="col-lg-6 d-flex justify-content-center justify-content-lg-start pe-lg-4">
            <div className="inner-form-card">
              {/* Header Context Elements */}
              <div className="mb-2 text-start">
                <h1 className="form-display-title">Register</h1>
              </div>

              {/* Alert Feedback Status Displays */}
              {apiError && (
                <div
                  className="custom-alert-box d-flex align-items-center gap-2 mb-3"
                  role="alert"
                >
                  <i className="bi bi-exclamation-circle-fill text-danger" />
                  <span>{apiError}</span>
                </div>
              )}

              {success && (
                <div
                  className="custom-success-box d-flex align-items-center gap-2 mb-3"
                  role="alert"
                >
                  <i className="bi bi-check-circle-fill text-success" />
                  <span>{success}</span>
                </div>
              )}

              {/* Clean Single-View 4-Field Form */}
              <form onSubmit={handleSubmit} noValidate>
                {/* Full Name field */}
                <div className="mb-3 text-start">
                  <label htmlFor="reg-fullName" className="custom-field-label">
                    Full Name
                  </label>
                  <input
                    id="reg-fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    className="form-control pristine-input"
                    placeholder="Shyam Verma"
                    value={formData.fullName}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  {errors.fullName && (
                    <div className="input-error-tip">
                      <i className="bi bi-x-circle-fill" /> {errors.fullName}
                    </div>
                  )}
                </div>

                {/* Mobile Number field */}
                <div className="mb-3 text-start">
                  <label htmlFor="reg-mobile" className="custom-field-label">
                    Mobile Number
                  </label>
                  <input
                    id="reg-mobile"
                    name="mobileNumber"
                    type="tel"
                    autoComplete="tel"
                    className="form-control pristine-input"
                    placeholder="+917428730894"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  {errors.mobileNumber && (
                    <div className="input-error-tip">
                      <i className="bi bi-x-circle-fill" />{" "}
                      {errors.mobileNumber}
                    </div>
                  )}
                </div>

                {/* Email Address field */}
                <div className="mb-3 text-start">
                  <label htmlFor="reg-email" className="custom-field-label">
                    Email Address
                  </label>
                  <input
                    id="reg-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="form-control pristine-input"
                    placeholder="shyam.verma@yopmail.com"
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

                {/* Password field */}
                <div className="mb-4 text-start">
                  <label htmlFor="reg-password" className="custom-field-label">
                    Password
                  </label>
                  <div className="input-embedded-wrapper">
                    <input
                      id="reg-password"
                      name="password"
                      type={showPw ? "text" : "password"}
                      autoComplete="new-password"
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
                  {formData.password && (
                    <PasswordStrength password={formData.password} />
                  )}
                </div>

                {/* Execution CTA Switch */}
                <button
                  id="reg-submit-btn"
                  type="submit"
                  className="btn vivid-orange-btn w-100 mt-2 mb-3"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      />
                      Creating account…
                    </>
                  ) : (
                    "Register for free"
                  )}
                </button>
              </form>

              {/* Traversal Redirection Option */}
              <p className="text-center mb-0 login-footer-text">
                Already have an account?{" "}
                <Link to="/login" className="login-footer-link">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* Real-Time Password Analytics Component */
const PasswordStrength = ({ password }) => {
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const levels = [
    { label: "Very Weak", color: "#ef4444" },
    { label: "Weak", color: "#f97316" },
    { label: "Fair", color: "#eab308" },
    { label: "Good", color: "#22c55e" },
    { label: "Strong", color: "#10b981" },
  ];
  const current = levels[Math.min(score - 1, 4)] ?? levels[0];

  return (
    <div className="mt-2 text-start">
      <div className="d-flex gap-1">
        {levels.map((l, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 4,
              borderRadius: 4,
              background: i < score ? current.color : "rgba(0,0,0,0.06)",
              transition: "background 0.3s",
            }}
          />
        ))}
      </div>
      <span
        style={{
          fontSize: "0.72rem",
          color: current.color,
          fontWeight: 600,
          marginTop: 2,
          display: "block",
        }}
      >
        {current.label}
      </span>
    </div>
  );
};

export default Register;
