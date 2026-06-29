// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import PageHeader from "../../../components/common/PageHeader";

// const StaffIssuePolicyPage = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     customerId: "",
//     planId: "",
//       startDate: "",

//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       // API integration here
//       alert("Policy Issued Successfully");
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div style={{ maxWidth: '600px', margin: '0 auto' }} className="animate-fade-in">
//       <PageHeader
//         title="Issue Policy"
//         subtitle="Issue a new policy directly to a registered customer"
//         action={
//           <button className="btn btn-secondary d-flex align-items-center gap-1" onClick={() => navigate("/Staff/dashboard")}>
//             <i className="bi bi-arrow-left"></i> Back
//           </button>
//         }
//       />

//       <div className="card border-0">
//         <div className="card-body p-4 p-md-5">
//           <form onSubmit={handleSubmit}>
//             <div className="mb-3">
//               <label className="form-label">Customer ID</label>
//               <input
//                 className="form-control"
//                 placeholder="Enter customer identifier (e.g. 12)"
//                 value={formData.customerId}
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     customerId: e.target.value,
//                   })
//                 }
//                 required
//               />
//             </div>

//             <div className="mb-4">
//               <label className="form-label">Plan ID</label>
//               <input
//                 className="form-control"
//                 placeholder="Enter policy identifier (e.g. 45)"
//                 value={formData.planId}
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     planId: e.target.value,
//                   })
//                 }
//                 required
//               />
//             </div>

//             <div className="d-flex justify-content-end gap-2">
//               <button type="button" className="btn btn-secondary" onClick={() => navigate("/Staff/dashboard")}>
//                 Cancel
//               </button>
//               <button type="submit" className="btn btn-primary px-4">
//                 Issue Policy
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StaffIssuePolicyPage;



  
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import PageHeader from "../../../components/common/PageHeader";

import { getAllCustomers } from "../../../services/customerService";
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
    startDate: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [customerData, planData] = await Promise.all([
          getAllCustomers(),
          getAllPlans(),
        ]);

        setCustomers(customerData || []);
        setPlans(planData || []);
      } catch (error) {
        console.error("Failed to load data", error);
      }
    };

    loadData();
  }, []);

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.fullName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      customer.email
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      customer.mobileNumber?.includes(searchTerm)
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

    if (!formData.startDate) {
      errs.startDate = "Please select a start date";
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
        startDate: formData.startDate,
      };

      await issuePolicy(payload);

      toast.success("Policy Issued Successfully");

      navigate("/Staff/policies");
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to issue policy"
      );
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
            onClick={() => navigate("/Staff/policies")}
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
                className={`form-control ${errors.customerId ? 'is-invalid' : ''}`}
                placeholder="Search by Name, Email or Mobile"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (errors.customerId) setErrors(prev => ({ ...prev, customerId: '' }));
                }}
              />
              {errors.customerId && <div className="invalid-feedback">{errors.customerId}</div>}
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
                            customerId:
                              customer.customerId,
                          }));

                          setSearchTerm(
                            customer.fullName
                          );
                        }}
                      >
                        <div>
                          <strong>
                            {customer.fullName}
                          </strong>
                        </div>

                        <small>
                          {customer.email}
                        </small>

                        <br />

                        <small>
                          {customer.mobileNumber}
                        </small>
                      </button>
                    ))
                  ) : (
                    <div className="p-3 text-muted">
                      No customer found
                    </div>
                  )}

                </div>
              </div>
            )}

            {/* Selected Customer */}
            {selectedCustomer && (
              <div className="alert alert-success">
                <h6 className="mb-2">
                  Selected Customer
                </h6>

                <div>
                  <strong>
                    {selectedCustomer.fullName}
                  </strong>
                </div>

                <div>
                  {selectedCustomer.email}
                </div>

                <div>
                  {selectedCustomer.mobileNumber}
                </div>

                <div>
                  Customer ID :
                  {" "}
                  {selectedCustomer.customerId}
                </div>
              </div>
            )}

            {/* Plan */}
            <div className="mb-3">
              <label className="form-label fw-semibold">
                Select Plan <span className="text-danger">*</span>
              </label>

              <select
                className={`form-select ${errors.planId ? 'is-invalid' : ''}`}
                value={formData.planId}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    planId: e.target.value,
                  });
                  if (errors.planId) setErrors(prev => ({ ...prev, planId: '' }));
                }}
                required
              >
                <option value="">
                  Select Plan
                </option>

                {plans.map((plan) => (
                  <option
                    key={plan.planId}
                    value={plan.planId}
                  >
                    {plan.planName}
                  </option>
                ))}
              </select>
              {errors.planId && <div className="invalid-feedback">{errors.planId}</div>}
            </div>

            {/* Start Date */}
            <div className="mb-4">
              <label className="form-label fw-semibold">
                Start Date <span className="text-danger">*</span>
              </label>

              <input
                type="date"
                className={`form-control ${errors.startDate ? 'is-invalid' : ''}`}
                value={formData.startDate}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    startDate: e.target.value,
                  });
                  if (errors.startDate) setErrors(prev => ({ ...prev, startDate: '' }));
                }}
                required
              />
              {errors.startDate && <div className="invalid-feedback">{errors.startDate}</div>}
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() =>
                  navigate("/Staff/policies")
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-primary px-4"
                disabled={loading}
              >
                {loading
                  ? "Issuing..."
                  : "Issue Policy"}
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
};

export default StaffIssuePolicyPage;


