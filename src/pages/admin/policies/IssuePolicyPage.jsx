import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../../components/common/PageHeader';
import FormInput from '../../../components/forms/FormInput';
import RichSelect from '../../../components/forms/RichSelect';
import AlertModal from '../../../components/modals/AlertModal';
import { getAllCustomers } from '../../../services/customerService';
import { getAllPlans } from '../../../services/planService';
import { issuePolicy } from '../../../services/policyService';
import toast from 'react-hot-toast';

const IssuePolicyPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customerId: '',
    planId: '',
    startDate: '',
  });
  const [customers, setCustomers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      getAllCustomers().catch(() => []),
      getAllPlans().catch(() => [])
    ]).then(([customersData, plansData]) => {
      setCustomers(customersData || []);
      setPlans(plansData || []);
      
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
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (!formData.startDate) {
      toast.error('Start date is required.');
      setSubmitting(false);
      return;
    }

    const today = new Date();
    today.setHours(24, 0, 0, 0);
    const selectedDate = new Date(formData.startDate);
    if (selectedDate > today) {
      toast.error('Start date cannot be in the future.');
      setSubmitting(false);
      return;
    }

    const payload = {
      customerId: Number(formData.customerId),
      planId: Number(formData.planId),
      startDate: formData.startDate
    };

    issuePolicy(payload)
      .then(() => {
        toast.success('Policy Issued Successfully!');
        navigate('/admin/policies');
      })
      .catch((err) => toast.error(err.response?.data?.message || 'Failed to issue policy. Check your connection.'))
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

      <div className="card border-0" style={{ borderRadius: 16, boxShadow: 'var(--ss-shadow)' }}>
        <div className="card-body p-4 p-md-5">
          <form onSubmit={handleSubmit}>
            <h5 className="mb-4 fw-bold" style={{ color: 'var(--ss-text-primary)' }}>Policy Information</h5>
            
            <div className="row">
              <div className="col-md-6">
                <RichSelect 
                  label="Select Customer" 
                  name="customerId" 
                  value={formData.customerId} 
                  onChange={handleChange} 
                  options={customerOptions}
                  placeholder="Choose a customer..."
                />
              </div>
              <div className="col-md-6">
                <RichSelect 
                  label="Select Plan" 
                  name="planId" 
                  value={formData.planId} 
                  onChange={handleChange} 
                  options={planOptions}
                  placeholder="Choose an insurance plan..."
                />
              </div>
            </div>

            <div className="row mt-2">
              <div className="col-md-6">
                <FormInput 
                  label="Start Date" 
                  name="startDate" 
                  type="date"
                  value={formData.startDate} 
                  onChange={handleChange} 
                  required 
                />
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
