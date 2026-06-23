import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../../components/common/PageHeader';
import FormInput from '../../../components/forms/FormInput';
import FormSelect from '../../../components/forms/FormSelect';
import { recordPayment } from '../../../services/paymentService';

const AgentRecordPaymentPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    policyId: '',
    amount: '',
    paymentType: 'CREDIT_CARD'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await recordPayment(formData);
      setSuccess('Payment recorded successfully!');
      setTimeout(() => navigate('/agent/payments'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to record payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <PageHeader 
        title="Record Payment" 
        subtitle="Manually log a customer payment"
        onBack={() => navigate('/agent/payments')}
      />

      {error && <div className="alert alert-danger" style={{ borderRadius: '12px' }}>{error}</div>}
      {success && <div className="alert alert-success" style={{ borderRadius: '12px' }}>{success}</div>}

      <div className="card border-0 mb-4" style={{ borderRadius: 16, boxShadow: 'var(--ss-shadow)' }}>
        <div className="card-body p-4 p-md-5">
          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              <div className="col-md-6">
                <FormInput
                  label="Policy ID"
                  name="policyId"
                  value={formData.policyId}
                  onChange={handleChange}
                  placeholder="Enter policy ID"
                  required
                />
              </div>
              <div className="col-md-6">
                <FormInput
                  label="Amount (₹)"
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="col-12">
                <FormSelect
                  label="Payment Method"
                  name="paymentType"
                  value={formData.paymentType}
                  onChange={handleChange}
                  options={[
                    { value: 'CREDIT_CARD', label: 'Credit Card' },
                    { value: 'DEBIT_CARD', label: 'Debit Card' },
                    { value: 'NET_BANKING', label: 'Net Banking' },
                    { value: 'UPI', label: 'UPI' },
                    { value: 'CASH', label: 'Cash' },
                  ]}
                  required
                />
              </div>
              <div className="col-12 mt-5">
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  style={{ borderRadius: '8px', padding: '12px', fontWeight: 600 }}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Record Payment'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AgentRecordPaymentPage;
