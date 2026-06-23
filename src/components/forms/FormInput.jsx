
const FormInput = ({ label, type = 'text', name, value, onChange, placeholder, error, required = false, ...props }) => {
  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={name} className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <input
        type={type}
        className={`form-control ${error ? 'is-invalid' : ''}`}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        style={{ borderRadius: '8px', padding: '0.6rem 1rem' }}
        {...props}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default FormInput;
