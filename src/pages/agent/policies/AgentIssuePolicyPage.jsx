// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import PageHeader from "../../../components/common/PageHeader";

// const AgentIssuePolicyPage = () => {
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
//           <button className="btn btn-secondary d-flex align-items-center gap-1" onClick={() => navigate("/agent/dashboard")}>
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
//               <button type="button" className="btn btn-secondary" onClick={() => navigate("/agent/dashboard")}>
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

// export default AgentIssuePolicyPage;



  
   import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/common/PageHeader";

import { getAllCustomers } from "../../../services/customerService";
import { getAllPlans } from "../../../services/planService";
import { issuePolicy } from "../../../services/policyService";

const AgentIssuePolicyPage = () => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.customerId) {
      alert("Please select a customer");
      return;
    }

    if (!formData.planId) {
      alert("Please select a plan");
      return;
    }

    if (!formData.startDate) {
      alert("Please select a start date");
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

      alert("Policy Issued Successfully");

      navigate("/agent/policies");
    } catch (error) {
      console.error(error);

      alert(
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
            onClick={() => navigate("/agent/policies")}
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
                Search Customer
              </label>

              <input
                type="text"
                className="form-control"
                placeholder="Search by Name, Email or Mobile"
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
              />
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
                Select Plan
              </label>

              <select
                className="form-select"
                value={formData.planId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    planId: e.target.value,
                  })
                }
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
            </div>

            {/* Start Date */}
            <div className="mb-4">
              <label className="form-label fw-semibold">
                Start Date
              </label>

              <input
                type="date"
                className="form-control"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    startDate: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() =>
                  navigate("/agent/policies")
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

export default AgentIssuePolicyPage;

