import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../../components/common/PageHeader';
import ModernSelect from "../../../components/forms/ModernSelect";
import AlertModal from '../../../components/modals/AlertModal';
import { getAllCustomers } from '../../../services/customerService';
import { getAllProducts } from '../../../services/productService';
import { getAllPlans } from '../../../services/planService';
import { issuePolicy } from '../../../services/policyService';
import { notify } from '../../../utils/notificationService';

const IssuePolicyPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customerId: '',
    planId: '',
  });
  const [customers, setCustomers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    Promise.all([
      getAllCustomers().catch(() => []),
      getAllPlans().catch(() => []),
      getAllProducts().catch(() => [])
    ]).then(([customersData, plansData, productsData]) => {
      
      const activeProductIds = new Set(productsData?.map(p => p.productId || p.id));
      const activeProductPlans = (plansData || []).filter(plan => 
        activeProductIds.has(plan.productId)
      );

      setCustomers(customersData || []);
      setPlans(activeProductPlans);
      
      // Set initial drop-down selection
      const initialCust = customersData?.[0]?.id || customersData?.[0]?.customerId || '';
      const initialPlan = plansData?.[0]?.id || plansData?.[0]?.planId || '';
      setFormData(prev => ({
        ...prev,
        customerId: initialCust,
        planId: initialPlan
      }));
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    const errs = {};

    if (!formData.customerId) {
      errs.customerId = 'Customer is required.';
    }
    if (!formData.planId) {
      errs.planId = 'Plan is required.';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setSubmitting(false);
      return;
    }

    const payload = {
      customerId: Number(formData.customerId),
      planId: Number(formData.planId),
      startDate: new Date().toISOString().split("T")[0],
    };

    issuePolicy(payload)
      .then((res) => {
        notify.success(res, 'Policy Issued Successfully!');
        navigate('/admin/policies');
      })
      .catch((err) => {
        if (err.fieldErrors) {
          setErrors(err.fieldErrors);
          notify.error("Please correct the highlighted fields.");
        } else {
          notify.error(err);
        }
      })
      .finally(() => setSubmitting(false));
  };

  const customerOptions = customers.map(c => ({
    value: c.id || c.customerId,
    label: `${c.fullName || c.name || 'Customer'} (Email: ${c.email })`,
    mainText: c.fullName || c.name || 'Customer',
    subText: `Email: ${c.email}`
  }));

  const planOptions = plans.map(p => ({
    value: p.id || p.planId,
    label: `${p.planName || p.name || 'Plan'} (Product : ${p.productName })`,
    mainText: p.planName || p.name || 'Plan',
    subText: `Product: ${p.productName}`
  }));

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <PageHeader 
        title="Issue New Policy" 
        subtitle="Directly issue an insurance policy to a customer"
        onBack={() => navigate('/admin/policies')}
      />

      <div className="card border-0" style={{ borderRadius: 16, boxShadow: 'var(--ip-shadow-md)' }}>
        <div className="card-body p-4 p-md-5">
          <form onSubmit={handleSubmit} noValidate>
            <h5 className="mb-4 fw-bold" style={{ color: 'var(--ip-text-primary)' }}>Policy Information</h5>
            
            <div className="row">
              <div className="col-md-6">
                <ModernSelect 
                  label="Select Customer" 
                  name="customerId" 
                  value={formData.customerId} 
                  onChange={handleChange} 
                  options={customerOptions}
                  placeholder="Choose a customer..."
                  error={errors.customerId}
                  required={true}
                />
              </div>
              <div className="col-md-6">
                <ModernSelect 
                  label="Select Plan" 
                  name="planId" 
                  value={formData.planId} 
                  onChange={handleChange} 
                  options={planOptions}
                  placeholder="Choose an insurance plan..."
                  error={errors.planId}
                  required={true}
                />
              </div>
            </div>


            <div className="mb-4 mt-4">
              <p className="fw-medium text-dark">
                Date of Issue: {new Date().toLocaleDateString()}
              </p>
              <div className="form-text mt-2 text-muted">
                The policy coverage will begin starting today.
              </div>
            </div>

            <div className="d-flex justify-content-end gap-3 mt-5">
              <button 
                type="button" 
                className="btn btn-light px-4" 
                style={{ borderRadius: '8px' }}
                onClick={() => navigate('/admin/policies')}
                disabled={submitting}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary px-4" 
                style={{ borderRadius: '8px' }}
                disabled={submitting || customerOptions.length === 0 || planOptions.length === 0}
              >
                {submitting ? 'Issuing...' : 'Issue Policy'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <AlertModal 
        isOpen={showSuccess}
        type="success"
        title="Policy Issued!"
        message="The policy has been successfully issued to the customer."
        onClose={() => {
          setShowSuccess(false);
          navigate('/admin/policies');
        }}
      />
    </div>
  );
};

export default IssuePolicyPage;
