import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/common/PageHeader";
import { notify } from "../../../utils/notificationService";
import ModernSelect from "../../../components/forms/ModernSelect";

import { getAllCustomers } from "../../../services/customerService";
import { getAllProducts } from "../../../services/productService";
import { getAllPlans } from "../../../services/planService";
import { issuePolicy } from "../../../services/policyService";

const StaffIssuePolicyPage = () => {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [plans, setPlans] = useState([]);

  
  

  const [formData, setFormData] = useState({
    customerId: "",
    planId: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [customerData, planData, productData] = await Promise.all([
          getAllCustomers(),
          getAllPlans(),
          getAllProducts(),
        ]);

        const activeProductIds = new Set(productData?.map(p => p.productId || p.id));
        const activeProductPlans = (planData || []).filter(plan => 
          activeProductIds.has(plan.productId)
        );

        setCustomers(customerData || []);
        setPlans(activeProductPlans);
      } catch (error) {
        console.error("Failed to load data", error);
      }
    };

    loadData();
  }, []);

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const customerOptions = customers.map(c => ({
    value: c.id || c.customerId,
    label: `${c.fullName || c.name || 'Customer'} (Email: ${c.email})`,
    mainText: c.fullName || c.name || 'Customer',
    subText: `Email: ${c.email}`
  }));

  const planOptions = plans.map(p => ({
    value: p.id || p.planId,
    label: `${p.planName || p.name || 'Plan'} (Product: ${p.productName || 'Unknown'})`,
    mainText: p.planName || p.name || 'Plan',
    subText: `Product: ${p.productName || 'Unknown'}`
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};

    if (!formData.customerId) {
      errs.customerId = "Please select a customer";
    }

    if (!formData.planId) {
      errs.planId = "Please select a plan";
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    try {
      setLoading(true);

      const payload = {
        customerId: Number(formData.customerId),
        planId: Number(formData.planId),
        startDate: new Date().toISOString().split("T")[0],
      };

      const res = await issuePolicy(payload);
      notify.success(res, "Policy Issued Successfully");

      navigate("/staff/policies");
    } catch (error) {
      console.error(error);

      if (error.fieldErrors) {
        setErrors(error.fieldErrors);
        notify.error("Please correct the highlighted fields.");
      } else {
        notify.error(error?.message || error?.response?.data?.message || "Failed to issue policy");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{ maxWidth: "800px", margin: "0 auto" }}
      className="animate-fade-in"
    >
      <PageHeader
        title="Issue Policy"
        subtitle="Issue a policy to an existing customer"
        action={
          <button
            className="btn btn-secondary d-inline-flex align-items-center gap-1"
            onClick={() => navigate("/staff/policies")}
          >
            <i className="bi bi-arrow-left"></i>
            Back
          </button>
        }
      />

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <form onSubmit={handleSubmit} noValidate>
            <div className="row">
              <div className="col-md-6 mb-3 mb-md-0">
                <ModernSelect
                  label="Select Customer"
                  name="customerId"
                  value={formData.customerId}
                  onChange={handleChange}
                  options={customerOptions}
                  placeholder="Choose a customer..."
                  error={errors.customerId}
                  required={true}
                />
              </div>
              <div className="col-md-6">
                <ModernSelect
                  label="Select Plan"
                  name="planId"
                  value={formData.planId}
                  onChange={handleChange}
                  options={planOptions}
                  placeholder="Choose an insurance plan..."
                  error={errors.planId}
                  required={true}
                />
              </div>
            </div>

            {/* Start Date Removed */}
            <div className="mb-4 mt-4">
              <p className="fw-medium text-dark">
                Date of Issue: {new Date().toLocaleDateString()}
              </p>
              <div className="form-text mt-2 text-muted">
                The policy coverage will begin starting today.
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/staff/policies")}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-primary px-4"
                disabled={loading}
              >
                {loading ? "Issuing..." : "Issue Policy"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StaffIssuePolicyPage;
