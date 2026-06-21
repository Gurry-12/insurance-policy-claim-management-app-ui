import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { purchasePolicy } from "../../../services/policyService";

const PurchasePolicyPage = () => {
  const { planId } = useParams();
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await purchasePolicy({
        planId: Number(planId),
        startDate,
      });

      alert("Policy Purchased Successfully");

      navigate("/customer/policies");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mt-4">

      <div className="card">

        <div className="card-header">
          <h3>Purchase Policy</h3>
        </div>

        <div className="card-body">

          <form onSubmit={handleSubmit}>

            <div className="mb-3">
              <label>Start Date</label>

              <input
                type="date"
                className="form-control"
                value={startDate}
                onChange={(e) =>
                  setStartDate(e.target.value)
                }
                required
              />
            </div>

            <button
              className="btn btn-success"
              type="submit"
            >
              Purchase Policy
            </button>

          </form>

        </div>

      </div>

    </div>
  );
};

export default PurchasePolicyPage;