import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getActivePlans } from "../../../services/planService";

const CustomerPlanListPage = () => {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await getActivePlans();
      setPlans(response.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mt-4">

      <h2>Browse Plans</h2>

      <div className="row">

        {plans.map((plan) => (
          <div
            className="col-md-4 mb-4"
            key={plan.planId}
          >
            <div className="card h-100">

              <div className="card-body">

                <h5>{plan.planName}</h5>

                <p>
                  <strong>Product:</strong>{" "}
                  {plan.productName}
                </p>

                <p>
                  <strong>Coverage:</strong>{" "}
                  ₹{plan.coverageAmount}
                </p>

                <p>
                  <strong>Premium:</strong>{" "}
                  ₹{plan.premiumAmount}
                </p>

                <p>
                  <strong>Duration:</strong>{" "}
                  {plan.duration} Months
                </p>

                <Link
                  className="btn btn-primary"
                  to={`/customer/purchase-policy/${plan.planId}`}
                >
                  Purchase
                </Link>

              </div>

            </div>
          </div>
        ))}

      </div>

    </div>
  );
};

export default CustomerPlanListPage;