
const FormTextarea = ({ label, name, value, onChange, placeholder, error, required = false, rows = 3, ...props }) => {
  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={name} className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <textarea
        className={`form-control ${error ? 'is-invalid' : ''}`}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        style={{ borderRadius: '8px', padding: '0.6rem 1rem' }}
        {...props}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default FormTextarea;
