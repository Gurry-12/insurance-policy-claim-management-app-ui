import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  createProfile,
  updateProfile,
  getProfile,
} from "../../../services/customerService";

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

  useEffect(() => {
    loadProfile();
  }, []);

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
    } catch (error) {}
  };

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
    <div className="container mt-4">

      <div className="card">
        <div className="card-header">
          <h3>{customerId ? "Update Profile" : "Create Profile"}</h3>
        </div>

        <div className="card-body">

          <form onSubmit={handleSubmit}>

            <div className="mb-3">
              <label>DOB</label>
              <input
                type="date"
                name="dateOfBirth"
                className="form-control"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label>Address</label>
              <input
                type="text"
                name="address"
                className="form-control"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label>City</label>
              <input
                type="text"
                name="city"
                className="form-control"
                value={formData.city}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label>State</label>
              <input
                type="text"
                name="state"
                className="form-control"
                value={formData.state}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label>Pin Code</label>
              <input
                type="text"
                name="pinCode"
                className="form-control"
                value={formData.pinCode}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label>Nominee Name</label>
              <input
                type="text"
                name="nomineeName"
                className="form-control"
                value={formData.nomineeName}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label>Nominee Relation</label>
              <input
                type="text"
                name="nomineeRelation"
                className="form-control"
                value={formData.nomineeRelation}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="btn btn-success"
            >
              {customerId ? "Update Profile" : "Create Profile"}
            </button>

          </form>

        </div>
      </div>

    </div>
  );
};

export default EditProfilePage;