import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createProfile,
  updateProfile,
  getProfile,
} from "../../../services/customerService";
import PageHeader from "../../../components/common/PageHeader";


const EditProfilePage = () => {
  const navigate = useNavigate();

  const [customerId, setCustomerId] = useState(null);

  const [formData, setFormData] = useState({
    dateOfBirth: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
    nomineeName: "",
    nomineeRelation: "",
  });

  const loadProfile = async () => {
    try {
      const response = await getProfile();
      const data = response.data;

      setCustomerId(data.customerId);

      setFormData({
        dateOfBirth: data.dateOfBirth || "",
        address: data.address || "",
        city: data.city || "",
        state: data.state || "",
        pinCode: data.pinCode || "",
        nomineeName: data.nomineeName || "",
        nomineeRelation: data.nomineeRelation || "",
      });
    } catch {
      // Ignore if no profile exists yet
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};

    if (!formData.dateOfBirth) errs.dateOfBirth = "Date of Birth is required";
    if (!formData.address) errs.address = "Address is required";
    if (!formData.city) errs.city = "City is required";
    if (!formData.state) errs.state = "State is required";
    if (!formData.pinCode) errs.pinCode = "Pin Code is required";
    if (!formData.nomineeName) errs.nomineeName = "Nominee Name is required";
    if (!formData.nomineeRelation) errs.nomineeRelation = "Nominee Relation is required";

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    try {
      if (customerId) {
        await updateProfile(customerId, formData);
      } else {
        await createProfile(formData);
      }

      navigate("/customer/profile");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title={customerId ? "Update Profile" : "Create Profile"} 
        subtitle="Manage your personal information and contact details"
      />

      <div className="row justify-content-center mt-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4 p-md-5">
              <form onSubmit={handleSubmit}>
                <div className="row g-4">
                  
                  <div className="col-12">
                    <h5 className="mb-0 text-primary">Personal Details</h5>
                    <hr className="mt-2 mb-3" />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-medium">Date of Birth <span className="text-danger">*</span></label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      className={`form-control ${errors.dateOfBirth ? 'is-invalid' : ''}`}
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      required
                    />
                    {errors.dateOfBirth && <div className="invalid-feedback">{errors.dateOfBirth}</div>}
                  </div>

                  <div className="col-12">
                    <h5 className="mb-0 mt-2 text-primary">Contact Information</h5>
                    <hr className="mt-2 mb-3" />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-medium">Address <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      name="address"
                      className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Street address, P.O. box, etc."
                      required
                    />
                    {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-medium">City <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      name="city"
                      className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="City"
                      required
                    />
                    {errors.city && <div className="invalid-feedback">{errors.city}</div>}
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-medium">State <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      name="state"
                      className={`form-control ${errors.state ? 'is-invalid' : ''}`}
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="State"
                      required
                    />
                    {errors.state && <div className="invalid-feedback">{errors.state}</div>}
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-medium">Pin Code <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      name="pinCode"
                      className={`form-control ${errors.pinCode ? 'is-invalid' : ''}`}
                      value={formData.pinCode}
                      onChange={handleChange}
                      placeholder="Postal code"
                      required
                    />
                    {errors.pinCode && <div className="invalid-feedback">{errors.pinCode}</div>}
                  </div>

                  <div className="col-12">
                    <h5 className="mb-0 mt-2 text-primary">Nominee Details</h5>
                    <hr className="mt-2 mb-3" />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-medium">Nominee Name <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      name="nomineeName"
                      className={`form-control ${errors.nomineeName ? 'is-invalid' : ''}`}
                      value={formData.nomineeName}
                      onChange={handleChange}
                      placeholder="Full name of nominee"
                      required
                    />
                    {errors.nomineeName && <div className="invalid-feedback">{errors.nomineeName}</div>}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-medium">Nominee Relation <span className="text-danger">*</span></label>
                    <select
                      name="nomineeRelation"
                      className={`form-select ${errors.nomineeRelation ? 'is-invalid' : ''}`}
                      value={formData.nomineeRelation}
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled>Select Relation</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Child">Child</option>
                      <option value="Parent">Parent</option>
                      <option value="Sibling">Sibling</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.nomineeRelation && <div className="invalid-feedback">{errors.nomineeRelation}</div>}
                  </div>

                  <div className="col-12 mt-5 d-flex gap-2 justify-content-end border-top pt-4">
                    <button
                      type="button"
                      className="btn btn-light px-4"
                      onClick={() => navigate(-1)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary px-4"
                    >
                      <i className="bi bi-check-circle me-2"></i>
                      {customerId ? "Update Profile" : "Save Profile"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;