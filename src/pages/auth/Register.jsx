import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import { register as registerService } from "../../services/authService";
import logoSrc from "../../assets/logo/insurance-heart-vector.png";
import LoadingButton from "../../components/ui/LoadingButton";
import "../css/Login.css";

const INIT = {
  fullName: "",
  email: "",
  mobileNumber: "",
  password: "",
  confirmPassword: "",
};

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(INIT);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      // Real-time confirm password validation
      if (name === 'confirmPassword' || name === 'password') {
        const pw = name === 'password' ? value : updated.password;
        const cpw = name === 'confirmPassword' ? value : updated.confirmPassword;
        if (cpw) {
          if (pw !== cpw) {
            setErrors((prev) => ({ ...prev, confirmPassword: 'Passwords do not match.' }));
          } else {
            setErrors((prev) => ({ ...prev, confirmPassword: '' }));
          }
        } else {
          setErrors((prev) => ({ ...prev, confirmPassword: '' }));
        }
      } else if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: '' }));
      }

      return updated;
    });
  };

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) {
      errs.fullName = "Full name is required.";
    }
    if (!formData.mobileNumber.trim()) {
      errs.mobileNumber = "Mobile number is required.";
    } else if (!/^\d{10}$/.test(formData.mobileNumber.trim())) {
      errs.mobileNumber = "Enter a valid 10-digit mobile number.";
    }
    if (!formData.email.trim()) {
      errs.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = "Enter a valid email.";
    }
    if (!formData.password) {
      errs.password = "Password is required.";
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{6,15}$/.test(formData.password)) {
      errs.password = "Password must be 6-15 characters and contain at least one uppercase letter, one lowercase letter, one digit, and one special character (@#$%^&+=!).";
    }
    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = "Passwords do not match.";
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
        mobileNumber: formData.mobileNumber.replace(/^\+91/, '').trim().length === 10
          ? "+91" + formData.mobileNumber.replace(/^\+91/, '').trim()
          : formData.mobileNumber,
        password: formData.password,
      };

      await registerService(payload);
      toast.success("Account created! Redirecting to verify email and phone...");
      setTimeout(
        () => navigate("/verify-otp", { state: { registered: true, email: payload.email } }),
        2200,
      );
    } catch (err) {
      toast.error(
        err.message ||
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



              {/* Clean Single-View 4-Field Form */}
              <form onSubmit={handleSubmit} noValidate>
                {/* Full Name field */}
                <div className="mb-3 text-start">
                  <label htmlFor="reg-fullName" className="custom-field-label">
                    Full Name <span className="text-danger">*</span>
                  </label>
                  <input
                    id="reg-fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    className={`form-control pristine-input ${errors.fullName ? 'is-invalid' : ''}`}
                    placeholder="Shyam Verma"
                    value={formData.fullName}
                    onChange={handleChange}
                    disabled={loading}
                    aria-invalid={errors.fullName ? "true" : "false"}
                    aria-describedby={errors.fullName ? "fullname-error" : undefined}
                  />
                  {errors.fullName && (
                    <div id="fullname-error" className="input-error-tip text-danger mt-1" aria-live="polite">
                      <i className="bi bi-x-circle-fill" /> {errors.fullName}
                    </div>
                  )}
                </div>

                {/* Mobile Number field */}
                <div className="mb-3 text-start">
                  <label htmlFor="reg-mobile" className="custom-field-label">
                    Mobile Number <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-white text-muted border-end-0 pe-2" id="basic-addon-mobile">+91</span>
                    <input
                      id="reg-mobile"
                      name="mobileNumber"
                      type="number"
                      step="1"
                      autoComplete="tel-national"
                      className={`form-control pristine-input border-start-0 ps-1 ${errors.mobileNumber ? 'is-invalid' : ''}`}
                      placeholder="9876543210"
                      value={formData.mobileNumber}
                      onChange={handleChange}
                      disabled={loading}
                      aria-invalid={errors.mobileNumber ? "true" : "false"}
                      aria-describedby={errors.mobileNumber ? "mobile-error" : undefined}
                      onKeyDown={(e) => { if (e.key === '.' || e.key === 'e') e.preventDefault(); }}
                      style={{ boxShadow: 'none' }}
                      onWheel={(e) => e.target.blur()} // prevent scrolling from changing number
                    />
                  </div>
                  {errors.mobileNumber && (
                    <div id="mobile-error" className="input-error-tip text-danger mt-1" aria-live="polite">
                      <i className="bi bi-x-circle-fill" />{" "}
                      {errors.mobileNumber}
                    </div>
                  )}
                </div>

                {/* Email Address field */}
                <div className="mb-3 text-start">
                  <label htmlFor="reg-email" className="custom-field-label">
                    Email Address <span className="text-danger">*</span>
                  </label>
                  <input
                    id="reg-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className={`form-control pristine-input ${errors.email ? 'is-invalid' : ''}`}
                    placeholder="shyam.verma@yopmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                    aria-invalid={errors.email ? "true" : "false"}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  {errors.email && (
                    <div id="email-error" className="input-error-tip text-danger mt-1" aria-live="polite">
                      <i className="bi bi-x-circle-fill" /> {errors.email}
                    </div>
                  )}
                </div>

                {/* Password field */}
                <div className="mb-4 text-start">
                  <label htmlFor="reg-password" className="custom-field-label">
                    Password <span className="text-danger">*</span>
                  </label>
                  <div className="input-embedded-wrapper">
                    <input
                      id="reg-password"
                      name="password"
                      type={showPw ? "text" : "password"}
                      autoComplete="new-password"
                      className={`form-control pristine-input ${errors.password ? 'is-invalid' : ''}`}
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={loading}
                      aria-invalid={errors.password ? "true" : "false"}
                      aria-describedby={errors.password ? "password-error" : undefined}
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
                    <div id="password-error" className="input-error-tip text-danger mt-1" aria-live="polite">
                      <i className="bi bi-x-circle-fill" /> {errors.password}
                    </div>
                  )}
                  {formData.password && (
                    <PasswordStrength password={formData.password} />
                  )}
                </div>

                {/* Confirm Password field */}
                <div className="mb-4 text-start">
                  <label htmlFor="reg-confirm-password" className="custom-field-label">
                    Confirm Password <span className="text-danger">*</span>
                  </label>
                  <div className="input-embedded-wrapper">
                    <input
                      id="reg-confirm-password"
                      name="confirmPassword"
                      type={showConfirmPw ? "text" : "password"}
                      autoComplete="new-password"
                      className={`form-control pristine-input ${
                        errors.confirmPassword
                          ? 'is-invalid'
                          : formData.confirmPassword && formData.password === formData.confirmPassword
                          ? 'is-valid'
                          : ''
                      }`}
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      disabled={loading}
                      aria-invalid={errors.confirmPassword ? "true" : "false"}
                      aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
                    />
                    <button
                      type="button"
                      className="input-embedded-trigger"
                      onClick={() => setShowConfirmPw((v) => !v)}
                      aria-label={showConfirmPw ? "Hide password" : "Show password"}
                    >
                      <i
                        className={`bi ${showConfirmPw ? "bi-eye-slash" : "bi-eye"}`}
                      />
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <div id="confirm-password-error" className="input-error-tip text-danger mt-1" aria-live="polite">
                      <i className="bi bi-x-circle-fill" /> {errors.confirmPassword}
                    </div>
                  )}
                  {!errors.confirmPassword && formData.confirmPassword && formData.password === formData.confirmPassword && (
                    <div className="input-error-tip text-success mt-1" aria-live="polite">
                      <i className="bi bi-check-circle-fill" /> Passwords match!
                    </div>
                  )}
                </div>

                {/* Execution CTA Switch */}
                <LoadingButton
                  id="reg-submit-btn"
                  type="submit"
                  className="login-submit-btn w-100 mt-2 mb-3"
                  isLoading={loading}
                  loadingText="Creating accountâ€¦"
                >
                  Register for free
                </LoadingButton>
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
