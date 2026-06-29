import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import PageHeader from '../../../components/common/PageHeader';
import FormInput from '../../../components/forms/FormInput';
import FormSelect from '../../../components/forms/FormSelect';
import { recordPayment } from '../../../services/paymentService';
import { useParams } from 'react-router-dom';

const StaffRecordPaymentPage = () => {
  const navigate = useNavigate();
  const { policyId } = useParams();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    policyId: policyId || '',
    amount: '',
    paymentMode: 'CARD'
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    
    const errs = {};
    if (!formData.policyId) {
      errs.policyId = 'Policy ID is required.';
    }
    if (!formData.amount || Number(formData.amount) <= 0) {
      errs.amount = 'Amount must be greater than zero.';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setLoading(false);
      return;
    }

    try {
      await recordPayment(formData);
      toast.success('Payment recorded successfully!');
      setTimeout(() => navigate('/Staff/payments'), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to record payment');
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <div
      className="animate-fade-in"
      style={{ maxWidth: "900px", margin: "0 auto" }}
    >
      <PageHeader
        title="Record Premium Payment"
        subtitle="Record payment for the selected policy"
        onBack={() => navigate("/Staff/policies")}
      />

      <div className="card border-0 mb-4" style={{ borderRadius: 16, boxShadow: 'var(--ss-shadow)' }}>
        <div className="card-body p-4 p-md-5">
          <form onSubmit={handleSubmit}>

            <div className="row g-4">

              {/* <div className="col-md-6">
                <FormInput
                  label="Policy ID"
                  name="policyId"
                  value={formData.policyId}
                  onChange={handleChange}
                  placeholder="Enter policy ID"
                  required
                  error={errors.policyId}
                />
              </div> */}

              <div className="col-md-6">
                <FormInput
                  label="Premium Amount (₹)"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                  error={errors.amount}
                />
              </div>

              <div className="col-12">
                <FormSelect
                  label="Payment Mode"
                  name="paymentMode"
                  value={formData.paymentMode}
                  onChange={handleChange}
                 options={[
                          { value: "CARD", label: "Card" },
                          { value: "NET_BANKING", label: "Net Banking" },
                          { value: "UPI", label: "UPI" },
                          { value: "CASH", label: "Cash" },
                        ]}
                  required
                />
              </div>

              <div className="col-12">
                <button
                  type="submit"
                  className="btn btn-success w-100"
                  disabled={loading}
                >
                  {loading ? "Recording Payment..." : "Record Payment"}
                </button>
              </div>

            </div>

          </form>

        </div>

      </div>
    </div>
  );
};


export default StaffRecordPaymentPage;
