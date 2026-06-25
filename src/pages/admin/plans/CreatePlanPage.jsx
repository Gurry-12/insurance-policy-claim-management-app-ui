import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../../components/common/PageHeader';
import FormInput from '../../../components/forms/FormInput';
import FormSelect from '../../../components/forms/FormSelect';
import FormTextarea from '../../../components/forms/FormTextarea';
import AlertModal from '../../../components/modals/AlertModal';
import { getAllProducts } from '../../../services/productService';
import { createPlan } from '../../../services/planService';

const CreatePlanPage = () => {
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
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getAllProducts()
      .then((data) => {
        setProducts(data || []);
        if (data && data.length > 0) {
          setFormData(prev => ({ ...prev, productId: data[0].id || data[0].productId }));
        }
      })
      .catch((err) => console.error("Could not load products:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    const nameRegex = /^[a-zA-Z\s]*$/;
    if (!nameRegex.test(formData.name)) {
      alert('Only letters and spaces are allowed in the plan name.');
      setSubmitting(false);
      return;
    }

    if (Number(formData.premium) <= 0) {
      alert('Base premium must be greater than zero.');
      setSubmitting(false);
      return;
    }

    if (Number(formData.coverage) <= 0) {
      alert('Coverage amount must be greater than zero.');
      setSubmitting(false);
      return;
    }

    if (Number(formData.duration) <= 0 || !Number.isInteger(Number(formData.duration))) {
      alert('Duration must be a positive integer.');
      setSubmitting(false);
      return;
    }

    if (!formData.termsAndConditions.trim()) {
      alert('Terms and conditions are required.');
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

    createPlan(payload)
      .then(() => {
        setShowSuccess(true);
      })
      .catch((err) => alert(err.response?.data?.message || 'Failed to create plan. Check your connection.'))
      .finally(() => setSubmitting(false));
  };

  const productOptions = products.map(p => ({
    value: p.id || p.productId,
    label: p.productName || 'Unnamed Product'
  }));

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <PageHeader 
        title="Create Plan" 
        subtitle="Add a new plan to an existing product"
        onBack={() => navigate('/admin/plans')}
      />

      <div className="card border-0" style={{ borderRadius: 16, boxShadow: 'var(--ss-shadow)' }}>
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
                  placeholder="e.g. Individual Platinum"
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
                  placeholder="e.g. 15000"
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
                  placeholder="e.g. 500000"
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
                    { value: 'ANNUAL', label: 'Annual' },
                    { value: 'ONE_TIME', label: 'One-time' },
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
                    { value: 'Active', label: 'Active' },
                    { value: 'Inactive', label: 'Inactive' },
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
                />
              </div>
            </div>

            <div className="d-flex justify-content-end gap-3 mt-5">
              <button 
                type="button" 
                className="btn btn-light px-4" 
                style={{ borderRadius: '8px' }}
                onClick={() => navigate('/admin/plans')}
                disabled={submitting}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary px-4" 
                style={{ borderRadius: '8px' }}
                disabled={submitting || productOptions.length === 0}
              >
                {submitting ? 'Creating...' : 'Create Plan'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <AlertModal 
        isOpen={showSuccess}
        type="success"
        title="Plan Created!"
        message="The new insurance plan has been successfully added."
        onClose={() => {
          setShowSuccess(false);
          navigate('/admin/plans');
        }}
      />
    </div>
  );
};

export default CreatePlanPage;
