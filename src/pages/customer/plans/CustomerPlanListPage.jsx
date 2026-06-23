import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getActivePlans, getPlansByProduct } from "../../../services/planService";
import PageHeader from "../../../components/common/PageHeader";

const CustomerPlanListPage = () => {
  const [plans, setPlans] = useState([]);
  const { productId } = useParams();

  const fetchPlans = async () => {
    try {
      let response;
      if (productId) {
        response = await getPlansByProduct(productId);
      } else {
        response = await getActivePlans();
      }
      setPlans(response.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Browse Plans" 
        subtitle="Explore our insurance plans and find the best coverage for you"
      />

      <div className="row g-4 mt-2">
        {plans.map((plan) => (
          <div
            className="col-md-6 col-lg-4"
            key={plan.planId}
          >
            <div className="card h-100 border-0 shadow-sm hover-elevate transition-all">
              <div className="card-body p-4 d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h5 className="card-title text-primary fw-bold mb-0">{plan.planName}</h5>
                  <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-2">
                    Active
                  </span>
                </div>

                <div className="mb-4 text-muted border-bottom pb-3">
                  <i className="bi bi-shield-check me-2 text-primary"></i>
                  {plan.productName}
                </div>

                <div className="mt-auto">
                  <div className="row g-3 mb-4">
                    <div className="col-6">
                      <div className="p-3 bg-light rounded text-center h-100">
                        <small className="text-muted d-block mb-1">Coverage</small>
                        <strong className="fs-5 text-dark">₹{plan.coverageAmount?.toLocaleString() || plan.coverageAmount}</strong>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="p-3 bg-light rounded text-center h-100">
                        <small className="text-muted d-block mb-1">Premium</small>
                        <strong className="fs-5 text-dark">₹{plan.premiumAmount?.toLocaleString() || plan.premiumAmount}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <span className="text-muted fw-medium">
                      <i className="bi bi-clock me-2 text-secondary"></i>
                      {plan.duration} Months
                    </span>
                    <Link
                      className="btn btn-primary px-4 rounded-pill"
                      to={`/customer/purchase-policy/${plan.planId}`}
                    >
                      Purchase
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {plans.length === 0 && (
          <div className="col-12 text-center py-5">
            <div className="card border-0 shadow-sm">
              <div className="card-body py-5">
                <div className="text-muted">
                  <i className="bi bi-inbox fs-1 d-block mb-3 text-secondary"></i>
                  <h5>No active plans available</h5>
                  <p>Please check back later for new insurance plans.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default CustomerPlanListPage;