import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  createProfile,
  updateProfile,
  getProfile,
} from "../../../services/customerService";
import PageHeader from "../../../components/common/PageHeader";

const EditProfilePage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const profile = location.state?.profile;

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
    } catch (error) {
      // Ignore if no profile exists yet
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
                    <label className="form-label fw-medium">Date of Birth</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      className="form-control"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <h5 className="mb-0 mt-2 text-primary">Contact Information</h5>
                    <hr className="mt-2 mb-3" />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-medium">Address</label>
                    <input
                      type="text"
                      name="address"
                      className="form-control"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Street address, P.O. box, etc."
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-medium">City</label>
                    <input
                      type="text"
                      name="city"
                      className="form-control"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="City"
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-medium">State</label>
                    <input
                      type="text"
                      name="state"
                      className="form-control"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="State"
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-medium">Pin Code</label>
                    <input
                      type="text"
                      name="pinCode"
                      className="form-control"
                      value={formData.pinCode}
                      onChange={handleChange}
                      placeholder="Postal code"
                      required
                    />
                  </div>

                  <div className="col-12">
                    <h5 className="mb-0 mt-2 text-primary">Nominee Details</h5>
                    <hr className="mt-2 mb-3" />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-medium">Nominee Name</label>
                    <input
                      type="text"
                      name="nomineeName"
                      className="form-control"
                      value={formData.nomineeName}
                      onChange={handleChange}
                      placeholder="Full name of nominee"
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-medium">Nominee Relation</label>
                    <input
                      type="text"
                      name="nomineeRelation"
                      className="form-control"
                      value={formData.nomineeRelation}
                      onChange={handleChange}
                      placeholder="e.g., Spouse, Child, Parent"
                      required
                    />
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