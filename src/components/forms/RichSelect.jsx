import { useState, useEffect, useRef } from 'react';

const RichSelect = ({ label, name, value, onChange, options, placeholder = "Select an option", error, required }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((o) => String(o.value) === String(value));

  return (
    <div className="mb-3 position-relative" ref={dropdownRef}>
      <label className="form-label">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <div
        className="form-control d-flex align-items-center justify-content-between"
        style={{
          cursor: "pointer",
          border: error ? "1.5px solid var(--bs-danger)" : undefined,
          boxShadow: isOpen ? "0 0 0 3px var(--ip-brand-light)" : "none",
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOption ? (
          <div className="text-truncate">
            <span className="fw-bold" style={{ color: "var(--ip-text-primary)" }}>{selectedOption.mainText}</span>
            <span className="text-muted ms-2" style={{ fontSize: "0.8rem" }}>{selectedOption.subText}</span>
          </div>
        ) : (
          <span className="text-muted">{placeholder}</span>
        )}
        <i className={`bi bi-chevron-${isOpen ? "up" : "down"} text-muted`} />
      </div>

      {isOpen && (
        <div
          className="position-absolute w-100 shadow rounded-3 mt-2 bg-white border"
          style={{ zIndex: 1050, maxHeight: "240px", overflowY: "auto" }}
        >
          {options.length === 0 ? (
            <div className="p-3 text-muted text-center" style={{ fontSize: "0.85rem" }}>
              No options available
            </div>
          ) : (
            options.map((opt) => (
              <div
                key={opt.value}
                className="p-3 border-bottom d-flex flex-column"
                style={{
                  cursor: "pointer",
                  backgroundColor: String(value) === String(opt.value) ? "var(--ip-brand-light)" : "transparent",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (String(value) !== String(opt.value)) e.currentTarget.style.backgroundColor = "var(--ip-surface-raised)";
                }}
                onMouseLeave={(e) => {
                  if (String(value) !== String(opt.value)) e.currentTarget.style.backgroundColor = "transparent";
                }}
                onClick={() => {
                  onChange({ target: { name, value: opt.value } });
                  setIsOpen(false);
                }}
              >
                <span className="fw-bold" style={{ fontSize: "0.9rem", color: "var(--ip-text-primary)" }}>
                  {opt.mainText}
                </span>
                <span className="text-muted" style={{ fontSize: "0.75rem", marginTop: "2px" }}>
                  {opt.subText}
                </span>
              </div>
            ))
          )}
        </div>
      )}
      {error && <div className="text-danger mt-1" style={{ fontSize: '0.875em' }}>{error}</div>}
    </div>
  );
};

export default RichSelect;
