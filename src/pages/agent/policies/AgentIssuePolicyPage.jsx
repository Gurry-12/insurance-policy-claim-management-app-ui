import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/common/PageHeader";

const AgentIssuePolicyPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customerId: "",
    policyId: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // API integration here
      alert("Policy Issued Successfully");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }} className="animate-fade-in">
      <PageHeader
        title="Issue Policy"
        subtitle="Issue a new policy directly to a registered customer"
        action={
          <button className="btn btn-secondary d-flex align-items-center gap-1" onClick={() => navigate("/agent/dashboard")}>
            <i className="bi bi-arrow-left"></i> Back
          </button>
        }
      />

      <div className="card border-0">
        <div className="card-body p-4 p-md-5">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Customer ID</label>
              <input
                className="form-control"
                placeholder="Enter customer identifier (e.g. 12)"
                value={formData.customerId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    customerId: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label">Policy ID</label>
              <input
                className="form-control"
                placeholder="Enter policy identifier (e.g. 45)"
                value={formData.policyId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    policyId: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button type="button" className="btn btn-secondary" onClick={() => navigate("/agent/dashboard")}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary px-4">
                Issue Policy
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AgentIssuePolicyPage;



  
    

