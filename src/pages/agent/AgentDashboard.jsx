

import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import "./AgentDashboard.css";


import Sidebar from "../../components/navigation/Sidebar";
import Navbar from "../../components/navigation/TopNavbar";

import { getAllPayments } from "../../services/paymentService";
import { getAllClaims } from "../../services/claimService";
import { getAllPolicies } from "../../services/policyService";
import { getAllCustomers } from "../../services/customerService";

const AgentDashboard = () => {
  const { logout } = useAuth();

  const [customersCount, setCustomersCount] = useState(0);
  const [policiesCount, setPoliciesCount] = useState(0);
  const [pendingClaimsCount, setPendingClaimsCount] = useState(0);
  const [reviewedClaimsCount, setReviewedClaimsCount] = useState(0);
  const [paymentsCount, setPaymentsCount] = useState(0);
  const [issuedPoliciesCount, setIssuedPoliciesCount] = useState(0);

  useEffect(() => {
    
  
  const loadDashboardData = async () => {
  try {
    const customers = await getAllCustomers();
    const policyResponse = await getAllPolicies();
    const claimResponse = await getAllClaims();
    const paymentResponse = await getAllPayments();

    

    setCustomersCount(customers?.length || 0);

    setPoliciesCount(policyResponse?.totalRecords || 0);

    setPaymentsCount(paymentResponse?.totalRecords || 0);

    setIssuedPoliciesCount(policyResponse?.totalRecords || 0);

    // Claims array from pagination response
    const claims = claimResponse?.content || [];

    setPendingClaimsCount(
      claims.filter(
        (claim) =>
          claim.claimStatus === "PENDING" ||
          claim.claimStatus === "UNDER_REVIEW"
      ).length
    );

    setReviewedClaimsCount(
      claims.filter(
        (claim) =>
          claim.claimStatus === "APPROVED" ||
          claim.claimStatus === "REJECTED" ||
          claim.claimStatus === "REVIEWED"
      ).length
    );
  } catch (error) {
    console.error("Dashboard Loading Error:", error);
  }
};

  loadDashboardData();
  }, []);


  return (
    <div className="layout">
      <Sidebar />

      <div className="main-content">
        <Navbar />

        <div className="dashboard">

          {/* Header */}
          <div className="dashboard-header">
            <div>
              <h1>Agent Dashboard</h1>
              <p>Welcome Back, Agent</p>
            </div>

            <div>
              <button
                className="btn btn-outline-danger rounded-pill px-4"
                onClick={logout}
              >
                Logout
              </button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="stats-grid">

            <div className="stat-card">
              <h4>Customers</h4>
              <h2>{customersCount}</h2>
              <p>Total Registered</p>
            </div>

            <div className="stat-card">
              <h4>Policies</h4>
              <h2>{policiesCount}</h2>
              <p>Active Policies</p>
            </div>

            <div className="stat-card">
              <h4>Pending Claims</h4>
              <h2>{pendingClaimsCount}</h2>
              <p>Awaiting Review</p>
            </div>

            <div className="stat-card">
              <h4>Reviewed Claims</h4>
              <h2>{reviewedClaimsCount}</h2>
              <p>Processed Claims</p>
            </div>

            <div className="stat-card">
              <h4>Premium Payments</h4>
              <h2>{paymentsCount}</h2>
              <p>Payment Records</p>
            </div>

            <div className="stat-card">
              <h4>Issued Policies</h4>
              <h2>{issuedPoliciesCount}</h2>
              <p>Total Issued</p>
            </div>

          </div>

          {/* Charts */}
          <div className="charts-section">

            <div className="chart-card">
              <h3>Claim Status Overview</h3>
              <div className="chart-placeholder">
                Pie Chart Here
              </div>
            </div>

            <div className="chart-card">
              <h3>Policy Distribution</h3>
              <div className="chart-placeholder">
                Bar Chart Here
              </div>
            </div>

          </div>

          {/* Recent Claims */}
          <div className="table-card">
            <div className="table-header">
              <h3>Recent Claims</h3>
              <button className="btn btn-primary">
                View All
              </button>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Claim ID</th>
                  <th>Customer</th>
                  <th>Policy</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td colSpan="6" className="empty-row">
                    Claims Data Will Be Loaded From Backend
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Recent Customers */}
          <div className="table-card">
            <div className="table-header">
              <h3>Recent Customers</h3>
              <button className="btn btn-primary">
                View All
              </button>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Customer ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Policies</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td colSpan="4" className="empty-row">
                    Customer Data Will Be Loaded From Backend
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;