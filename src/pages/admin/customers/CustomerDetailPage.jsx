import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../../components/common/PageHeader";
import StatusBadge from "../../../components/ui/StatusBadge";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import ErrorAlert from "../../../components/ui/ErrorAlert";
import { getCustomerById } from "../../../services/customerService";
import { getPoliciesByCustomerId } from "../../../services/policyService";

const CustomerDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [policies, setPolicies] = useState([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError("");

    Promise.all([
      getCustomerById(id).catch(err => {
        console.error("Profile load failed:", err);
        return null;
      }),
      getPoliciesByCustomerId(id).catch(err => {
        console.error("Policies load failed:", err);
        return [];
      })
    ]).then(([customerData, policiesData]) => {
      if (!customerData) {
        setError("Could not load customer profile details.");
      } else {
        setCustomer(customerData);
        setPolicies(policiesData || []);
      }
    }).finally(() => {
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return <LoadingSpinner text="Loading customer details..." />;
  }

  if (error || !customer) {
    return (
      <div>
        <PageHeader
          title="Customer Details"
          subtitle="Customer profile details view"
          onBack={() => navigate("/admin/customers")}
        />
        <ErrorAlert message={error || "Customer not found."} />
      </div>
    );
  }

  const name = customer.fullName || "Customer";
  const displayAddress = customer.address
    ? `${customer.address}, ${customer.city || ""}, ${customer.state || ""} ${customer.pinCode || ""}`
        .replace(/,\s*,/g, ",")
        .trim()
    : "N/A";

  return (
    <div>
      <PageHeader
        title="Customer Details"
        subtitle={`Viewing profile for ${name}`}
        onBack={() => navigate("/admin/customers")}
      />

      <div className="row g-4">
        {/* Profile Card */}
        <div className="col-lg-4">
          <div
            className="card border-0 h-100"
            style={{ borderRadius: 16, boxShadow: "var(--ss-shadow)" }}
          >
            <div className="card-body p-4 text-center">
              <div className="mb-3 d-flex justify-content-center">
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    backgroundColor: "var(--ss-primary)",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "2rem",
                    fontWeight: 600,
                  }}
                >
                  {name.charAt(0)}
                </div>
              </div>
              <h5 className="fw-bold mb-1">{name}</h5>
              <p className="text-muted mb-3">ID: {customer.customerId}</p>

              <hr
                className="my-4"
                style={{ borderColor: "var(--ss-border-light)" }}
              />

              <div className="text-start">
                <div className="mb-3">
                  <small className="text-muted d-block fw-bold">Email</small>
                  <span>{customer.email || "N/A"}</span>
                </div>
                <div className="mb-3">
                  <small className="text-muted d-block fw-bold">Phone</small>
                  <span>{customer.mobileNumber || "N/A"}</span>
                </div>
                <div className="mb-3">
                  <small className="text-muted d-block fw-bold">
                    Date of Birth
                  </small>
                  <span>{customer.dateOfBirth || "N/A"}</span>
                </div>
                <div className="mb-3">
                  <small className="text-muted d-block fw-bold">Address</small>
                  <span>{displayAddress}</span>
                </div>
                {customer.nomineeName && (
                  <div className="mb-3">
                    <small className="text-muted d-block fw-bold">
                      Nominee
                    </small>
                    <span>
                      {customer.nomineeName} (
                      {customer.nomineeRelation || "Nominee"})
                    </span>
                  </div>
                )}
                <div>
                  <small className="text-muted d-block fw-bold">Joined</small>
                  <span>{customer.createdDate?.split("T")[0] || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Policies & Activity */}
        <div className="col-lg-8">
          <div
            className="card border-0 mb-4"
            style={{ borderRadius: 16, boxShadow: "var(--ss-shadow)" }}
          >
            <div className="card-body p-4">
              <h6 className="fw-bold mb-4">Active & Past Policies</h6>
              {policies.length > 0 ? (
                <div className="table-responsive">
                  <table
                    className="table table-hover align-middle mb-0"
                    style={{ fontSize: "0.875rem" }}
                  >
                    <thead>
                      <tr
                        className="text-muted"
                        style={{
                          fontSize: "0.75rem",
                          textTransform: "uppercase",
                        }}
                      >
                        <th className="border-0">Policy #</th>
                        <th className="border-0">Plan</th>
                        <th className="border-0">Premium</th>
                        <th className="border-0">Expiry Date</th>
                        <th className="border-0">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {policies.map((p) => (
                        <tr key={p.policyId}>
                          <td className="fw-bold">{p.policyNumber}</td>
                          <td>{p.planName}</td>
                          <td>₹{p.coverageAmount.toLocaleString("en-IN")}</td>
                          <td>{p.endDate}</td>
                          <td>
                            <StatusBadge status={p.policyStatus} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted text-center my-4">
                  No policies found for this customer.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailPage;
