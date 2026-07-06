import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import PageHeader from "../../../components/common/PageHeader";

import { getAllCustomers } from "../../../services/customerService";
import { getAllProducts } from "../../../services/productService";
import { getAllPlans } from "../../../services/planService";
import { issuePolicy } from "../../../services/policyService";

const StaffIssuePolicyPage = () => {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [plans, setPlans] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

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

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.mobileNumber?.includes(searchTerm),
  );

  const [errors, setErrors] = useState({});

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

      await issuePolicy(payload);

      toast.success("Policy Issued Successfully");

      navigate("/staff/policies");
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Failed to issue policy");
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
            className="btn btn-secondary d-flex align-items-center gap-1"
            onClick={() => navigate("/staff/policies")}
          >
            <i className="bi bi-arrow-left"></i>
            Back
          </button>
        }
      />

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            {/* Search Customer */}
            <div className="mb-3">
              <label className="form-label fw-semibold">
                Search Customer <span className="text-danger">*</span>
              </label>

              <input
                type="text"
                className={`form-control ${errors.customerId ? "is-invalid" : ""}`}
                placeholder="Search by Name, Email or Mobile"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (errors.customerId)
                    setErrors((prev) => ({ ...prev, customerId: "" }));
                }}
              />
              {errors.customerId && (
                <div className="invalid-feedback">{errors.customerId}</div>
              )}
            </div>

            {/* Customer List */}
            {searchTerm && (
              <div
                className="card mb-3"
                style={{
                  maxHeight: "250px",
                  overflowY: "auto",
                }}
              >
                <div className="list-group list-group-flush">
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((customer) => (
                      <button
                        key={customer.customerId}
                        type="button"
                        className="list-group-item list-group-item-action text-start"
                        onClick={() => {
                          setSelectedCustomer(customer);

                          setFormData((prev) => ({
                            ...prev,
                            customerId: customer.customerId,
                          }));

                          setSearchTerm(customer.fullName);
                        }}
                      >
                        <div>
                          <strong>{customer.fullName}</strong>
                        </div>

                        <small>{customer.email}</small>

                        <br />

                        <small>{customer.mobileNumber}</small>
                      </button>
                    ))
                  ) : (
                    <div className="p-3 text-muted">No customer found</div>
                  )}
                </div>
              </div>
            )}

            {/* Selected Customer */}
            {selectedCustomer && (
              <div className="alert alert-success">
                <h6 className="mb-2">Selected Customer</h6>

                <div>
                  <strong>{selectedCustomer.fullName}</strong>
                </div>

                <div>{selectedCustomer.email}</div>

                <div>{selectedCustomer.mobileNumber}</div>
              </div>
            )}

            {/* Plan */}
            <div className="mb-3">
              <label className="form-label fw-semibold">
                Select Plan <span className="text-danger">*</span>
              </label>

              <select
                className={`form-select ${errors.planId ? "is-invalid" : ""}`}
                value={formData.planId}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    planId: e.target.value,
                  });
                  if (errors.planId)
                    setErrors((prev) => ({ ...prev, planId: "" }));
                }}
                required
              >
                <option value="">Select Plan</option>

                {plans.map((plan) => (
                  <option key={plan.planId} value={plan.planId}>
                    {plan.planName} (Product: {plan.productName})
                  </option>
                ))}
              </select>
              {errors.planId && (
                <div className="invalid-feedback">{errors.planId}</div>
              )}
            </div>

            {/* Start Date Removed */}
            <div className="mb-4">
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
