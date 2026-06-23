import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AgentIssuePolicyPage = () => {

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customerId: "",
    policyId: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await AgentIssuePolicyPage(formData);
      alert("Policy Issued Successfully");
    } catch (error) {
      console.error(error);
    }
  };

  return (

    <div className="container mt-3">
      <h3>Issue Policy</h3>

     <button    
        className="btn btn-secondary mb-3"
        onClick={() => navigate("/agent/dashboard")}
      > Back </button>
      <form onSubmit={handleSubmit}>

        <input
          className="form-control mb-3"
          placeholder="Customer Id"
          value={formData.customerId}
          onChange={(e) =>
            setFormData({
              ...formData,
              customerId: e.target.value,
            })
          }
        />

        <input
          className="form-control mb-3"
          placeholder="Policy Id"
          value={formData.policyId}
          onChange={(e) =>
            setFormData({
              ...formData,
              policyId: e.target.value,
            })
          }
        />

        <button className="btn btn-success">
          Issue Policy
        </button>

      </form>
    </div>
  );
};
export default AgentIssuePolicyPage;



  
    

