import { useState } from "react";
import { createPortal } from "react-dom";
import toast from 'react-hot-toast';
import { resendOtpApi } from "../../services/authService";
import "../../pages/css/Otp.css";

const ResendOtp = ({ email = '', triggerButton = true, isOpenProp, onClose, onSuccess }) => {
  const [isInternalOpen, setIsInternalOpen] = useState(false);
  const [formData, setFormData] = useState({ email, phone: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const isOpen = isOpenProp !== undefined ? isOpenProp : isInternalOpen;

  const handleClose = () => {
    if (onClose) onClose();
    setIsInternalOpen(false);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.email.trim()) {
      errs.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = "Enter a valid email.";
    }
    if (!formData.phone.trim()) {
      errs.phone = "Phone number is required.";
    }
    return errs;
  };

  const handleResendSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    try {
      setLoading(true);

      const payload = {
        email: formData.email.trim(),
        phone: formData.phone.trim(),
      };

      if (await resendOtpApi(payload)) {
        toast.success("New verification codes sent!");
        setTimeout(() => {
          handleClose();
          setFormData({ email: "", phone: "" });
          if (onSuccess) onSuccess();
        }, 1800);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to resend OTP.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Trigger button styled seamlessly within the footer text */}
      {triggerButton && (
        <button
          type="button"
          className="vivid-text-link-btn ms-1"
          onClick={() => setIsInternalOpen(true)}
        >
          Resend OTP
        </button>
      )}

      {/* Pop-up Modal Window Overlay */}
      {isOpen && createPortal(
        <div className="otp-modal-backdrop">
          <div className="otp-modal-card p-4 text-start">
            {/* Modal Header */}
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5
                className="mb-0 fw-bold text-dark"
                style={{ fontSize: "1.1rem" }}
              >
                Request New OTP
              </h5>
              <button
                type="button"
                className="btn-close shadow-none"
                style={{ fontSize: "0.85rem" }}
                onClick={handleClose}
                disabled={loading}
              />
            </div>

            {/* Form Fields */}
            <form onSubmit={handleResendSubmit} noValidate>
              <div className="mb-3">
                <label htmlFor="resend-email" className="custom-field-label">
                  Email Address
                </label>
                <input
                  id="resend-email"
                  name="email"
                  type="email"
                  className="form-control pristine-input"
                  placeholder="username@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.email && (
                  <div className="input-error-tip">{errors.email}</div>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="resend-phone" className="custom-field-label">
                  Phone Number
                </label>
                <input
                  id="resend-phone"
                  name="phone"
                  type="tel"
                  className="form-control pristine-input"
                  placeholder="+919983710550"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.phone && (
                  <div className="input-error-tip">{errors.phone}</div>
                )}
              </div>

              <button
                type="submit"
                className="btn login-submit-btn w-100"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    />
                    Requesting...
                  </>
                ) : (
                  "Send Code Request"
                )}
              </button>
            </form>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default ResendOtp;
