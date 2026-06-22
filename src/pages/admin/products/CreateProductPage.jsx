import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../../components/common/PageHeader';
import FormInput from '../../../components/forms/FormInput';
import FormSelect from '../../../components/forms/FormSelect';
import FormTextarea from '../../../components/forms/FormTextarea';
import AlertModal from '../../../components/modals/AlertModal';
import { createProduct } from '../../../services/productService';

const CreateProductPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    category: 'HEALTH',
    description: '',
    status: 'Active'
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

    const nameRegex = /^[a-zA-Z\s]*$/;
    if (!nameRegex.test(formData.name)) {
      alert('Only letters and spaces are allowed in the product name.');
      setSubmitting(false);
      return;
    }

    const payload = {
      productName: formData.name,
      productType: formData.category,
      description: formData.description,
      activeStatus: formData.status === 'Active'
    };

    createProduct(payload)
      .then(() => {
        setShowSuccess(true);
      })
      .catch((err) => alert(err.response?.data?.message || 'Failed to create product. Check your connection.'))
      .finally(() => setSubmitting(false));
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <PageHeader 
        title="Create Product" 
        subtitle="Add a new insurance product"
        onBack={() => navigate('/admin/products')}
      />

      <div className="card border-0" style={{ borderRadius: 16, boxShadow: 'var(--ss-shadow)' }}>
        <div className="card-body p-4 p-md-5">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6">
                <FormInput 
                  label="Product Name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                  placeholder="e.g. Health Shield Premium"
                />
              </div>
              <div className="col-md-6">
                <FormSelect 
                  label="Category" 
                  name="category" 
                  value={formData.category} 
                  onChange={handleChange} 
                  required 
                  options={[
                    { value: 'HEALTH', label: 'Health Insurance' },
                    { value: 'AUTO', label: 'Auto Insurance' },
                    { value: 'LIFE', label: 'Life Insurance' },
                    { value: 'HOME', label: 'Home Insurance' },
                  ]}
                />
              </div>
            </div>

            <div className="row mt-2">
              <div className="col-12">
                <FormTextarea 
                  label="Description" 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange} 
                  required 
                  placeholder="Enter detailed description of the product"
                  rows={4}
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

            <div className="d-flex justify-content-end gap-3 mt-5">
              <button 
                type="button" 
                className="btn btn-light px-4" 
                style={{ borderRadius: '8px' }}
                onClick={() => navigate('/admin/products')}
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
                {submitting ? 'Creating...' : 'Create Product'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <AlertModal 
        isOpen={showSuccess}
        type="success"
        title="Product Created!"
        message="The new insurance product has been successfully added."
        onClose={() => {
          setShowSuccess(false);
          navigate('/admin/products');
        }}
      />
    </div>
  );
};

export default CreateProductPage;
