import { Navigate, Outlet, Routes, Route, useLocation } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import { ROLES } from "./utils/roles";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import VerifyOtp from "./pages/auth/VerifyOtp";
import NotFound from "./pages/shared/NotFound";
import AgentDashboard from "./pages/agent/AgentDashboard";
import AgentIssuePolicyPage from "./pages/agent/policies/AgentIssuePolicyPage";


import AdminDashboard from "./pages/admin/AdminDashboard";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import AgentClaimHistory from './pages/agent/claims/AgentClaimHistory';
import AgentPolicyListPage from './pages/agent/policies/AgentPolicyListPage';
import AgentCustomerListPage from './pages/agent/customers/AgentCustomerListPage';
import AgentClaimListPage from './pages/agent/claims/AgentClaimListPage';
import AgentPaymentListPage from './pages/agent/payments/AgentPaymentListPage';
import ProfilePage from "./pages/customer/profile/ProfilePage";
import EditProfilePage from "./pages/customer/profile/EditProfilePage";
import CustomerProductListPage from "./pages/customer/products/CustomerProductListPage";
import CustomerPlanListPage from "./pages/customer/plans/CustomerPlanListPage";
import PurchasePolicyPage from "./pages/customer/policies/PurchasePolicyPage";
import CustomerPolicyListPage from "./pages/customer/policies/CustomerPolicyListPage";
import CustomerPaymentHistoryPage from "./pages/customer/payments/CustomerPaymentHistoryPage";
import RecordPaymentPage from "./pages/customer/payments/RecordPaymentPage";
import CustomerClaimListPage from "./pages/customer/claims/CustomerClaimListPage";
import RaiseClaimPage from "./pages/customer/claims/RaiseClaimPage";
import ClaimStatusHistoryPage from "./pages/customer/claims/ClaimStatusHistoryPage";
import UploadDocumentsPage from "./pages/customer/claims/UploadDocumentsPage";

import AdminLayout from "./pages/admin/shared/AdminLayout";
import UserListPage from "./pages/admin/users/UserListPage";
import CreateAgentPage from "./pages/admin/users/CreateAgentPage";
import UserDetailPage from "./pages/admin/users/UserDetailPage";
import CustomerListPage from "./pages/admin/customers/CustomerListPage";
import CustomerDetailPage from "./pages/admin/customers/CustomerDetailPage";
import ProductListPage from "./pages/admin/products/ProductListPage";
import CreateProductPage from "./pages/admin/products/CreateProductPage";
import EditProductPage from "./pages/admin/products/EditProductPage";
import ProductDetailPage from "./pages/admin/products/ProductDetailPage";
import PlanListPage from "./pages/admin/plans/PlanListPage";
import CreatePlanPage from "./pages/admin/plans/CreatePlanPage";
import EditPlanPage from "./pages/admin/plans/EditPlanPage";
import PlanDetailPage from "./pages/admin/plans/PlanDetailPage";
import PolicyListPage from "./pages/admin/policies/PolicyListPage";
import PolicyDetailPage from "./pages/admin/policies/PolicyDetailPage";
import IssuePolicyPage from "./pages/admin/policies/IssuePolicyPage";
import ClaimListPage from "./pages/admin/claims/ClaimListPage";
import ClaimDetailPage from "./pages/admin/claims/ClaimDetailPage";
import AdminClaimHistoryPage from "./pages/admin/claims/AdminClaimHistoryPage";
import PaymentListPage from "./pages/admin/payments/PaymentListPage";

/* Agent */

import ClaimDetailsPage from './pages/customer/claims/ClaimDetailsPage';

/* Admin */

/* Agent */

/* Customer */

/* ── Guards  */
const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated)
    return <Navigate to="/login" state={{ from: location }} replace />;
  return <Outlet />;
};

const RoleProtectedRoute = ({ allowedRole }) => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== allowedRole)
    return <Navigate to="/unauthorized" replace />;
  return <Outlet />;
};


/* ── App  */

const App = () => (
  <Routes>
    {/* Public */}
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/verify-otp" element={<VerifyOtp />} />
    {/* <Route path="/unauthorized" element={<Unauthorized />} /> */}
    <Route path="/" element={<Navigate to="/login" replace />} />

    {/* ── Admin  */}
    <Route element={<ProtectedRoute />}>
      <Route element={<RoleProtectedRoute allowedRole={ROLES.ADMIN} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserListPage />} />
          <Route path="users/create" element={<CreateAgentPage />} />
          <Route path="users/:id" element={<UserDetailPage />} />
          <Route path="customers" element={<CustomerListPage />} />
          <Route path="customers/:id" element={<CustomerDetailPage />} />
          <Route path="products" element={<ProductListPage />} />
          <Route path="products/create" element={<CreateProductPage />} />
          <Route path="products/edit/:id" element={<EditProductPage />} />
          <Route path="products/:id" element={<ProductDetailPage />} />
          <Route path="plans" element={<PlanListPage />} />
          <Route path="plans/create" element={<CreatePlanPage />} />
          <Route path="plans/edit/:id" element={<EditPlanPage />} />
          <Route path="plans/:id" element={<PlanDetailPage />} />
          <Route path="policies" element={<PolicyListPage />} />
          <Route path="policies/:id" element={<PolicyDetailPage />} />
          <Route path="policies/issue" element={<IssuePolicyPage />} />
          <Route path="claims" element={<ClaimListPage />} />
          <Route path="claims/:id" element={<ClaimDetailPage />} />
          <Route path="claims/:id/history" element={<AdminClaimHistoryPage />} />
          <Route path="payments" element={<PaymentListPage />} />
        </Route>
      </Route>
    </Route>


    {/* ── Agent  */}

      <Route element={<ProtectedRoute />}>
        <Route element={<RoleProtectedRoute allowedRole={ROLES.AGENT} />}>
         
          <Route path="/agent/dashboard" 
                  element={<AgentDashboard />}
          />

           <Route
              path="/agent/claims"
              element={<AgentClaimListPage />}
            />

            <Route
              path="/agent/customers"
              element={<AgentCustomerListPage />}
            />

            <Route
              path="/agent/policies"
              element={<AgentPolicyListPage />}
            />

            <Route
              path="/agent/payments/page"
              element={<AgentPaymentListPage />}
            />

             <Route
              path="/agent/issue-policy"
              element={<AgentIssuePolicyPage />}
            />

             <Route
              path="/agent/claims-history"
              element={<AgentClaimHistory />}
            />

        </Route>

    <Route element={<ProtectedRoute />}>
      <Route element={<RoleProtectedRoute allowedRole={ROLES.CUSTOMER} />}>
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />

        <Route path="/customer/profile" element={<ProfilePage />} />

        <Route path="/customer/profile/edit" element={<EditProfilePage />} />

        <Route
          path="/customer/products"
          element={<CustomerProductListPage />}
        />

        <Route path="/customer/plans" element={<CustomerPlanListPage />} />

        <Route
          path="/customer/purchase-policy/:planId"
          element={<PurchasePolicyPage />}
        />

        <Route path="/customer/policies" element={<CustomerPolicyListPage />} />

        <Route
          path="/customer/payments"
          element={<CustomerPaymentHistoryPage />}
        />

        <Route
          path="/customer/payments/pay/:policyId"
          element={<RecordPaymentPage />}
        />

        <Route path="/customer/claims" element={<CustomerClaimListPage />} />

        <Route path="/customer/claims/raise" element={<RaiseClaimPage />} />

        <Route
          path="/customer/claims/history/:claimId"
          element={<ClaimStatusHistoryPage />}
        />

        <Route
          path="/customer/claims/upload/:claimId"
          element={<UploadDocumentsPage />}
        />

          <Route
            path="/customer/claims/history/:claimId"
            element={<ClaimStatusHistoryPage />}
          />

          <Route
            path="/customer/claims/upload/:claimId"
            element={<UploadDocumentsPage />}
          />

          <Route
            path="/customer/claims/:claimId"
            element={<ClaimDetailsPage />}
          />




        </Route>
      </Route>
    </Route>

    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default App;

    

