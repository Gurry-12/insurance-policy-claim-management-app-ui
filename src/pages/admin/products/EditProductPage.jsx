import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../../components/common/PageHeader';
import FormInput from '../../../components/forms/FormInput';
import FormSelect from '../../../components/forms/FormSelect';
import FormTextarea from '../../../components/forms/FormTextarea';
import AlertModal from '../../../components/modals/AlertModal';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ErrorAlert from '../../../components/ui/ErrorAlert';
import { getProductById, updateProduct } from '../../../services/productService';
import toast from 'react-hot-toast';

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    category: 'HEALTH',
    description: '',
    status: 'Active'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => { 
    setLoading(true);
    getProductById(id)
      .then((data) => {
        if (data) {
          setFormData({
            name: data.productName || '',
            category: data.productType || 'HEALTH',
            description: data.description || data.productDescription || '',
            status: (data.activeStatus ?? data.active) ? 'Active' : 'Inactive'
          });
        }
      })
      .catch(() => setError('Could not load product details.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (!/^[A-Za-z\s]+$/.test(formData.name)) {
      toast.error('Only letters and spaces are allowed in the product name.');
      setSubmitting(false);
      return;
    }

    const payload = {
      productName: formData.name,
      productType: formData.category,
      description: formData.description,
      activeStatus: formData.status === 'Active'
    };

    updateProduct(id, payload)
      .then(() => {
        toast.success('Product updated successfully!');
        navigate(`/admin/products/${id}`);
      })
      .catch((err) => toast.error(err.response?.data?.message || 'Failed to save product changes.'))
      .finally(() => setSubmitting(false));
  };

  if (loading) {
    return <LoadingSpinner text="Loading product details..." />;
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <PageHeader
        title="Edit Product"
        subtitle={`Editing Product: ${id}`}
        onBack={() => navigate("/admin/products")}
      />

      <ErrorAlert message={error} />

      {!error && (
        <div
          className="card border-0"
          style={{ borderRadius: 16, boxShadow: "var(--ss-shadow)" }}
        >
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
                      { value: "HEALTH", label: "Health" },
                      { value: "MOTOR", label: "Motor" },
                      { value: "LIFE", label: "Life" },
                      { value: "TRAVEL", label: "Travel" },
                      { value: "INSURANCE", label: "Insurance" },
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
                      { value: "Active", label: "Active" },
                      { value: "Inactive", label: "Inactive" },
                    ]}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end gap-3 mt-5">
                <button
                  type="button"
                  className="btn btn-light px-4"
                  style={{ borderRadius: "8px" }}
                  onClick={() => navigate("/admin/products")}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary px-4"
                  style={{ borderRadius: "8px" }}
                  disabled={submitting}
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
        title="Product Updated!"
        message="The changes to the product have been saved successfully."
        onClose={() => {
          setShowSuccess(false);
          navigate("/admin/products");
        }}
      />
    </div>
  );
};

export default EditProductPage;
