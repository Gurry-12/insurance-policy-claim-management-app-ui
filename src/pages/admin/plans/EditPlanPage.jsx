import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../../components/common/PageHeader';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ErrorAlert from '../../../components/ui/ErrorAlert';
import { getAllProducts } from '../../../services/productService';
import { getPlanById, updatePlan } from '../../../services/planService';
import { notify } from '../../../utils/notificationService';
import { PREMIUM_TYPE_OPTIONS } from '../../../utils/options';

const DURATION_OPTIONS = [1, 2, 3, 5, 7, 10, 15, 20, 25, 30];

const sectionCard = {
  borderRadius: 'var(--ip-radius-lg)',
  boxShadow: 'var(--ip-shadow-md)',
};

const sectionHeader = {
  fontSize: '0.8rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: 'var(--ip-text-muted)',
  marginBottom: '1rem',
};

const inputStyle = {
  borderRadius: 'var(--ip-radius-sm)',
  border: '1.5px solid var(--ip-border)',
  padding: '0.6rem 0.85rem',
  fontSize: '0.88rem',
  backgroundColor: 'var(--ip-surface)',
  color: 'var(--ip-text-primary)',
  transition: 'border-color 0.2s, box-shadow 0.2s',
};

const labelStyle = {
  fontSize: '0.78rem',
  fontWeight: 600,
  color: 'var(--ip-text-muted)',
  marginBottom: '0.35rem',
};

const EditPlanPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    planName: '',
    productId: '',
    premiumType: 'ANNUAL',
    durations: [],
    termsAndConditions: '',
  });

  useEffect(() => {
    Promise.all([
      getAllProducts().catch(() => []),
      getPlanById(id).catch(() => null),
    ])
      .then(([productsData, planData]) => {
        const list = productsData?.data || productsData || [];
        setProducts(Array.isArray(list) ? list : []);

        if (planData) {
          setForm({
            planName: planData.planName || '',
            productId: planData.productId || '',
            premiumType: planData.supportedPremiumType || planData.supportedPremiumTypes?.[0] || 'ANNUAL',
            durations: planData.allowedDurations || [],
            termsAndConditions: planData.termsAndConditions || '',
          });
        } else {
          setError('Could not load plan details.');
        }
      })
      .catch(() => setError('Could not load plan details.'))
      .finally(() => setLoading(false));
  }, [id]);

  const toggleDuration = (yr) => {
    setForm((f) => ({
      ...f,
      durations: f.durations.includes(yr)
        ? f.durations.filter((d) => d !== yr)
        : [...f.durations, yr].sort((a, b) => a - b),
    }));
  };

  const handleSubmit = async () => {
    if (!form.planName.trim()) return notify.error('Plan name is required');
    if (!form.productId) return notify.error('Select a product');
    if (form.durations.length === 0) return notify.error('Select at least one duration');
    if (!form.termsAndConditions.trim()) return notify.error('Terms & conditions are required');

    setSubmitting(true);
    try {
      await updatePlan(id, {
        productId: Number(form.productId),
        planName: form.planName,
        supportedPremiumType: form.premiumType,
        allowedDurations: form.durations,
        termsAndConditions: form.termsAndConditions,
      });
      notify.success('Plan updated successfully!');
      navigate(`/admin/plans/${id}`);
    } catch (err) {
      notify.error(err.message || 'Failed to update plan');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading plan details..." />;
  if (error) {
    return (
      <div>
        <PageHeader title="Edit Plan" onBack={() => navigate('/admin/plans')} />
        <ErrorAlert message={error} />
      </div>
    );
  }

  const selectedProduct = products.find((p) => (p.productId || p.id) == form.productId);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <PageHeader
        title="Edit Plan"
        subtitle={form.planName}
        onBack={() => navigate(`/admin/plans/${id}`)}
      />

      <div className="d-flex flex-column gap-4">

        {/* Basic Info */}
        <div className="card border-0" style={sectionCard}>
          <div className="card-body p-4">
            <div style={sectionHeader}>
              <i className="bi bi-info-circle me-2" style={{ color: 'var(--ip-brand)' }} />
              Basic Information
            </div>
            <div className="row g-3">
              <div className="col-md-8">
                <label style={labelStyle}>Plan Name *</label>
                <input
                  type="text"
                  className="form-control"
                  style={inputStyle}
                  value={form.planName}
                  onChange={(e) => setForm((f) => ({ ...f, planName: e.target.value }))}
                  placeholder="e.g. Health Guard Platinum"
                />
              </div>
              <div className="col-md-4">
                <label style={labelStyle}>Product *</label>
                <select
                  className="form-select"
                  style={inputStyle}
                  value={form.productId}
                  onChange={(e) => setForm((f) => ({ ...f, productId: e.target.value }))}
                >
                  <option value="">Select product...</option>
                  {products.map((p) => (
                    <option key={p.productId || p.id} value={p.productId || p.id}>
                      {p.productName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Type */}
        <div className="card border-0" style={sectionCard}>
          <div className="card-body p-4">
            <div style={sectionHeader}>
              <i className="bi bi-credit-card me-2" style={{ color: 'var(--ip-brand)' }} />
              Premium Type
            </div>
            <div className="d-flex flex-wrap gap-2">
              {PREMIUM_TYPE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className="btn"
                  style={{
                    borderRadius: 'var(--ip-radius-pill)',
                    padding: '0.5rem 1.25rem',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    border: form.premiumType === opt.value ? 'none' : '1.5px solid var(--ip-border)',
                    backgroundColor: form.premiumType === opt.value ? 'var(--ip-brand)' : 'transparent',
                    color: form.premiumType === opt.value ? '#fff' : 'var(--ip-text-secondary)',
                    transition: 'all 0.2s',
                  }}
                  onClick={() => setForm((f) => ({ ...f, premiumType: opt.value }))}
                >
                  {form.premiumType === opt.value && <i className="bi bi-check2 me-1" />}
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Durations */}
        <div className="card border-0" style={sectionCard}>
          <div className="card-body p-4">
            <div style={sectionHeader}>
              <i className="bi bi-clock-history me-2" style={{ color: 'var(--ip-brand)' }} />
              Allowed Durations *
            </div>
            <div className="d-flex flex-wrap gap-2">
              {DURATION_OPTIONS.map((yr) => {
                const selected = form.durations.includes(yr);
                return (
                  <button
                    key={yr}
                    type="button"
                    className="btn"
                    style={{
                      borderRadius: 'var(--ip-radius-pill)',
                      padding: '0.45rem 1rem',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      minWidth: '72px',
                      border: selected ? 'none' : '1.5px solid var(--ip-border)',
                      backgroundColor: selected ? 'var(--ip-success)' : 'transparent',
                      color: selected ? '#fff' : 'var(--ip-text-secondary)',
                      transition: 'all 0.2s',
                    }}
                    onClick={() => toggleDuration(yr)}
                  >
                    {yr} {yr === 1 ? 'Yr' : 'Yrs'}
                  </button>
                );
              })}
            </div>
            {form.durations.length === 0 && (
              <div className="text-danger small mt-2">
                <i className="bi bi-exclamation-circle me-1" />
                Select at least one duration
              </div>
            )}
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="card border-0" style={sectionCard}>
          <div className="card-body p-4">
            <div style={sectionHeader}>
              <i className="bi bi-file-text me-2" style={{ color: 'var(--ip-brand)' }} />
              Terms & Conditions *
            </div>
            <textarea
              className="form-control"
              style={{ ...inputStyle, resize: 'vertical' }}
              rows={4}
              value={form.termsAndConditions}
              onChange={(e) => setForm((f) => ({ ...f, termsAndConditions: e.target.value }))}
              placeholder="Describe coverage terms, rules, and conditions..."
            />
          </div>
        </div>

        {/* Info Banner */}
        <div
          className="p-3"
          style={{
            borderRadius: 'var(--ip-radius-md)',
            backgroundColor: 'var(--ip-brand-light)',
            border: '1px solid var(--ip-brand-muted)',
          }}
        >
          <div className="d-flex align-items-start gap-2">
            <i className="bi bi-info-circle text-primary mt-1" />
            <div className="small" style={{ color: 'var(--ip-text-secondary)' }}>
              <strong style={{ color: 'var(--ip-brand)' }}>Coverage options and pricing rules</strong>{' '}
              are managed from the{' '}
              <strong style={{ color: 'var(--ip-brand)' }}>Plan Details</strong> page after saving.
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="d-flex justify-content-end gap-3 pb-2">
          <button
            className="btn px-4"
            style={{
              borderRadius: 'var(--ip-radius-pill)',
              fontWeight: 600,
              border: '1.5px solid var(--ip-border)',
              color: 'var(--ip-text-secondary)',
            }}
            onClick={() => navigate(`/admin/plans/${id}`)}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            className="btn px-5"
            style={{
              borderRadius: 'var(--ip-radius-pill)',
              fontWeight: 700,
              backgroundColor: 'var(--ip-brand)',
              color: '#fff',
              boxShadow: 'var(--ip-shadow-sm)',
            }}
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <><span className="spinner-border spinner-border-sm me-2" /> Saving...</>
            ) : (
              <><i className="bi bi-check-lg me-2" /> Save Changes</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPlanPage;
