import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../../components/common/PageHeader';
import FormInput from '../../../components/forms/FormInput';
import AlertModal from '../../../components/modals/AlertModal';
import { createAgent } from '../../../services/userService';
import toast from 'react-hot-toast';

const CreateAgentPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    const fullName = `${formData.firstName} ${formData.lastName}`.trim();

    // 1. Full Name Validation: letters and spaces only, min 2 max 100
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(fullName)) {
      toast.error('Only letters and spaces are allowed in name.');
      setSubmitting(false);
      return;
    }
    if (fullName.length < 2 || fullName.length > 100) {
      toast.error('Name should be between 2 and 100 characters.');
      setSubmitting(false);
      return;
    }

    // 2. Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Enter a valid email address.');
      setSubmitting(false);
      return;
    }

    // 3. Password Validation: uppercase, lowercase, digit, special char, length 6-15
    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{6,15}$/;
    if (!passRegex.test(formData.password)) {
      toast.error('Password must be 6-15 characters and contain at least one uppercase letter, one lowercase letter, one digit, and one special character (@#$%^&+=!).');
      setSubmitting(false);
      return;
    }

    // 4. Mobile Number Validation: international format +919876543210
    const mobileRegex = /^\+?[1-9]\d{9,14}$/;
    if (!mobileRegex.test(formData.phone)) {
      toast.error('Use international format for mobile number, example: +919876543210');
      setSubmitting(false);
      return;
    }

    const payload = {
      fullName: fullName,
      email: formData.email,
      password: formData.password,
      mobileNumber: formData.phone
    };

    createAgent(payload)
      .then(() => {
        toast.success('Agent registered successfully!');
        navigate('/admin/users');
      })
      .catch((err) => toast.error(err.response?.data?.message || 'Failed to register new agent. Please check your connection.'))
      .finally(() => setSubmitting(false));
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <PageHeader 
        title="Create New Agent" 
        subtitle="Register a new insurance agent into the system"
        onBack={() => navigate('/admin/users')}
      />

      <div className="card border-0" style={{ borderRadius: 16, boxShadow: 'var(--ss-shadow)' }}>
        <div className="card-body p-4 p-md-5">
          <form onSubmit={handleSubmit}>
            <h5 className="mb-4 fw-bold" style={{ color: 'var(--ss-text-primary)' }}>Agent Information</h5>
            
            <div className="row">
              <div className="col-md-6">
                <FormInput 
                  label="First Name" 
                  name="firstName" 
                  value={formData.firstName} 
                  onChange={handleChange} 
                  required 
                  placeholder="e.g. John"
                />
              </div>
              <div className="col-md-6">
                <FormInput 
                  label="Last Name" 
                  name="lastName" 
                  value={formData.lastName} 
                  onChange={handleChange} 
                  required 
                  placeholder="e.g. Doe"
                />
              </div>
            </div>

            <div className="row mt-2">
              <div className="col-md-6">
                <FormInput 
                  label="Email Address" 
                  name="email" 
                  type="email"
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                  placeholder="john.doe@example.com"
                />
              </div>
              <div className="col-md-6">
                <FormInput 
                  label="Phone Number" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  required 
                  placeholder="+919876543210"
                />
              </div>
            </div>

            <div className="row mt-2">
              <div className="col-md-6">
                <FormInput 
                  label="Temporary Password" 
                  name="password" 
                  type="password"
                  value={formData.password} 
                  onChange={handleChange} 
                  required 
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="d-flex justify-content-end gap-3 mt-5">
              <button 
                type="button" 
                className="btn btn-light px-4" 
                style={{ borderRadius: '8px' }}
                onClick={() => navigate('/admin/users')}
                disabled={submitting}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary px-4" 
                style={{ borderRadius: '8px' }}
                disabled={submitting}
              >
                {submitting ? 'Creating...' : 'Create Agent'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <AlertModal 
        isOpen={showSuccess}
        type="success"
        title="Agent Created!"
        message="The new agent has been successfully registered in the system."
        onClose={() => {
          setShowSuccess(false);
          navigate('/admin/users');
        }}
      />
    </div>
  );
};

export default CreateAgentPage;
