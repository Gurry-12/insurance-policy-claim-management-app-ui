import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../../components/common/PageHeader';
import FormInput from '../../../components/forms/FormInput';
import FormSelect from '../../../components/forms/FormSelect';
import FormTextarea from '../../../components/forms/FormTextarea';
import AlertModal from '../../../components/modals/AlertModal';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ErrorAlert from '../../../components/ui/ErrorAlert';
import { getAllProducts } from '../../../services/productService';
import { getPlanById, updatePlan } from '../../../services/planService';
import toast from 'react-hot-toast';

const EditPlanPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    productId: '',
    premium: '',
    coverage: '',
    premiumType: 'ANNUAL',
    duration: '1',
    termsAndConditions: '',
    status: 'Active'
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [errors, setErrors] = useState({});

  useEffect(() => {
     
    setLoading(true);
    Promise.all([
      getAllProducts().catch(() => []),
      getPlanById(id).catch(() => null)
    ])
      .then(([productsData, planData]) => {
        setProducts(productsData || []);
        if (planData) {
          setFormData({
            name: planData.planName || '',
            productId: planData.productId || '',
            premium: planData.premiumAmount || '',
            coverage: planData.coverageAmount || '',
            premiumType: planData.premiumType || 'ANNUAL',
            duration: planData.duration || '1',
            termsAndConditions: planData.termsAndConditions || '',
            status: (planData.activeStatus ?? planData.active) ? 'Active' : 'Inactive'
          });
        } else {
          setError('Could not load plan details.');
        }
      })
      .catch(() => setError('Could not load plan details.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const errs = {};

    if (!/^[A-Za-z\s]+$/.test(formData.name)) {
      errs.name = 'Only letters and spaces are allowed in the plan name.';
    }

    if (Number(formData.premium) <= 0) {
      errs.premium = 'Base premium must be greater than zero.';
    }

    if (Number(formData.coverage) <= 0) {
      errs.coverage = 'Coverage amount must be greater than zero.';
    }

    try {
      const Big = (await import('big.js')).default;
      if (new Big(formData.coverage).lte(new Big(formData.premium))) {
        errs.coverage = 'Coverage amount must strictly exceed the premium amount.';
      }
    } catch {
      if (Number(formData.coverage) <= Number(formData.premium)) {
         errs.coverage = 'Coverage amount must strictly exceed the premium amount.';
      }
    }

    if (Number(formData.duration) <= 0 || !Number.isInteger(Number(formData.duration))) {
      errs.duration = 'Duration must be a positive integer.';
    } else if (Number(formData.duration) > 40) {
      errs.duration = 'Duration cannot exceed 40 years.';
    }

    if (!formData.termsAndConditions.trim()) {
      errs.termsAndConditions = 'Terms and conditions are required.';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setSubmitting(false);
      return;
    }

    const payload = {
      productId: Number(formData.productId),
      planName: formData.name,
      coverageAmount: Number(formData.coverage),
      premiumAmount: Number(formData.premium),
      premiumType: formData.premiumType,
      duration: Number(formData.duration),
      termsAndConditions: formData.termsAndConditions,
      activeStatus: formData.status === 'Active'
    };

    updatePlan(id, payload)
      .then(() => {
        toast.success('Plan updated successfully!');
        navigate(`/admin/plans/${id}`);
      })
      .catch((err) => toast.error(err.response?.data?.message || 'Failed to save plan changes.'))
      .finally(() => setSubmitting(false));
  };

  const productOptions = products.map(p => ({
    value: p.id || p.productId,
    label: p.productName || 'Unnamed Product'
  }));

  if (loading) {
    return <LoadingSpinner text="Loading plan details..." />;
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <PageHeader
        title="Edit Plan"
        subtitle={`Editing Plan: ${id}`}
        onBack={() => navigate("/admin/plans")}
      />

      <ErrorAlert message={error} />

      {!error && (
        <div
          className="card border-0"
          style={{ borderRadius: 16, boxShadow: "var(--ip-shadow-md)" }}
        >
          <div className="card-body p-4 p-md-5">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <FormInput
                    label="Plan Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    error={errors.name}
                  />
                </div>
                <div className="col-md-6">
                  <FormSelect
                    label="Product"
                    name="productId"
                    value={formData.productId}
                    onChange={handleChange}
                    required
                    options={productOptions}
                  />
                </div>
              </div>

              <div className="row mt-2">
                <div className="col-md-6">
                  <FormInput
                    label="Premium Amount (₹)"
                    name="premium"
                    type="number"
                    value={formData.premium}
                    onChange={handleChange}
                    required
                    error={errors.premium}
                  />
                </div>
                <div className="col-md-6">
                  <FormInput
                    label="Coverage Amount (₹)"
                    name="coverage"
                    type="number"
                    value={formData.coverage}
                    onChange={handleChange}
                    required
                    error={errors.coverage}
                  />
                </div>
              </div>

              <div className="row mt-2">
                <div className="col-md-6">
                  <FormSelect
                    label="Premium Type"
                    name="premiumType"
                    value={formData.premiumType}
                    onChange={handleChange}
                    required
                    options={[
                      { value: "ANNUAL", label: "Annual" },
                      { value: "ONE_TIME", label: "One-time" },
                    ]}
                  />
                </div>
                <div className="col-md-6">
                  <FormInput
                    label="Duration (Years/Months)"
                    name="duration"
                    type="number"
                    value={formData.duration}
                    onChange={handleChange}
                    required
                    placeholder="e.g. 1"
                    error={errors.duration}
                  />
                </div>
              </div>

              <div className="row mt-2">
                <div className="col-md-6">
                  <FormSelect
                    label="Status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                    options={[
                      { value: "Active", label: "Active" },
                      { value: "Inactive", label: "Inactive" },
                    ]}
                  />
                </div>
              </div>

              <div className="row mt-2">
                <div className="col-12">
                  <FormTextarea
                    label="Terms & Conditions"
                    name="termsAndConditions"
                    value={formData.termsAndConditions}
                    onChange={handleChange}
                    required
                    placeholder="Describe coverage terms, rules, and conditions..."
                    rows={4}
                    error={errors.termsAndConditions}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end gap-3 mt-5">
                <button
                  type="button"
                  className="btn btn-light px-4"
                  style={{ borderRadius: "8px" }}
                  onClick={() => navigate("/admin/plans")}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary px-4"
                  style={{ borderRadius: "8px" }}
                  disabled={submitting || productOptions.length === 0}
                >
                  {submitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AlertModal
        isOpen={showSuccess}
        type="success"
        title="Plan Updated!"
        message="The changes to the plan have been saved successfully."
        onClose={() => {
          setShowSuccess(false);
          navigate("/admin/plans");
        }}
      />
    </div>
  );
};

export default EditPlanPage;
