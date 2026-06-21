import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { getMyPolicies } from "../../services/policyService";

const CustomerDashboard = () => {
  const { user, logout } = useAuth();

  const [totalPolicies, setTotalPolicies] = useState(0);
  const [pendingPolicies, setPendingPolicies] = useState(0);

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const response = await getMyPolicies();

      setTotalPolicies(response.totalRecords || 0);

      const pendingCount =
        response.content?.filter(
          (policy) => policy.policyStatus === "PENDING_PAYMENT"
        ).length || 0;

      setPendingPolicies(pendingCount);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">

        {/* Sidebar */}
        <div className="col-md-2 bg-dark text-white min-vh-100 p-3">
          <h4>Customer</h4>

          <ul className="nav flex-column mt-4">
            <li className="nav-item mb-3">
              <Link
                to="/customer/dashboard"
                className="nav-link text-white"
              >
                Dashboard
              </Link>
            </li>

            <li className="nav-item mb-3">
              <Link
                to="/customer/profile"
                className="nav-link text-white"
              >
                My Profile
              </Link>
            </li>
          </ul>

          <li className="nav-item mb-3">
            <Link
              to="/customer/products"
              className="nav-link text-white"
            >
              Browse Products
            </Link>
          </li>

          <li className="nav-item mb-3">
            <Link
              to="/customer/plans"
              className="nav-link text-white"
            >
              Browse Plans
            </Link>
          </li>

          <li className="nav-item mb-3">
            <Link
              to="/customer/policies"
              className="nav-link text-white"
            >
              My Policies
            </Link>
          </li>

          <button
            className="btn btn-danger mt-4 w-100"
            onClick={logout}
          >
            Logout
          </button>
        </div>

        {/* Dashboard Content */}
        <div className="col-md-10 p-4">

          <h2>Welcome {user?.name}</h2>

          <div className="row mt-4">

            <div className="col-md-4">
              <div className="card shadow-sm">
                <div className="card-body text-center">
                  <h5>Total Policies</h5>
                  <h2>{totalPolicies}</h2>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card shadow-sm">
                <div className="card-body text-center">
                  <h5>Pending Policies</h5>
                  <h2>{pendingPolicies}</h2>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default CustomerDashboard;