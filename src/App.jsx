import { Navigate, Outlet, Routes, Route, useLocation } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import { ROLES } from "./utils/roles";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import VerifyOtp from "./pages/auth/VerifyOtp";
import NotFound from "./pages/shared/NotFound";
import StaffDashboard from "./pages/Staff/StaffDashboard";


import AdminDashboard from "./pages/admin/AdminDashboard";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import StaffClaimHistory from './pages/Staff/claims/StaffClaimHistory';
import StaffPolicyListPage from "./pages/Staff/policies/StaffPolicyListPage";
import StaffCustomerListPage from './pages/Staff/customers/StaffCustomerListPage';
import StaffPolicyDetailPage from "./pages/Staff/policies/StaffPolicyDetailPage";
import StaffIssuePolicyPage from "./pages/Staff/policies/StaffIssuePolicyPage";
import StaffClaimListPage from './pages/Staff/claims/StaffClaimListPage';
import StaffClaimDetailPage from './pages/Staff/claims/StaffClaimDetailPage';
import StaffPaymentListPage from './pages/Staff/payments/StaffPaymentListPage';
import ProfilePage from "./pages/customer/profile/ProfilePage";
import EditProfilePage from "./pages/customer/profile/EditProfilePage";
import CustomerProductListPage from "./pages/customer/products/CustomerProductListPage";
import CustomerPlanListPage from "./pages/customer/plans/CustomerPlanListPage";
import PurchasePolicyPage from "./pages/customer/policies/PurchasePolicyPage";
import CustomerPolicyListPage from "./pages/customer/policies/CustomerPolicyListPage";
import CustomerPolicyDetailPage from "./pages/customer/policies/CustomerPolicyDetailPage";
import CustomerPaymentHistoryPage from "./pages/customer/payments/CustomerPaymentHistoryPage";
import RecordPaymentPage from "./pages/customer/payments/RecordPaymentPage";
import CustomerClaimListPage from "./pages/customer/claims/CustomerClaimListPage";
import RaiseClaimPage from "./pages/customer/claims/RaiseClaimPage";
import ClaimStatusHistoryPage from "./pages/customer/claims/ClaimStatusHistoryPage";
import UploadDocumentsPage from "./pages/customer/claims/UploadDocumentsPage";
import UserListPage from "./pages/admin/users/UserListPage";
import CreateStaffPage from "./pages/admin/users/CreateStaffPage";
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

/* Staff */

import ClaimDetailsPage from './pages/customer/claims/ClaimDetailsPage';
import UnifiedLayout from './components/layouts/UnifiedLayout';
import StaffRecordPaymentPage from "./pages/Staff/payments/StaffRecordPaymentPage";
/* Admin */

/* Staff */

/* Customer */

/* ── Guards  */
const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    const isLoggingOut = localStorage.getItem("isLoggingOut");
    if (isLoggingOut) {
      localStorage.removeItem("isLoggingOut");
      return <Navigate to="/login" replace />;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
};

const RoleProtectedRoute = ({ allowedRole }) => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== allowedRole) {
    // If logged in but accessing a different role's page (e.g. from a cached logout redirect)
    // smoothly send them to their own role's dashboard instead of a dead-end unauthorized page.
    if (user?.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
    if (user?.role === 'Staff') return <Navigate to="/Staff/dashboard" replace />;
    if (user?.role === 'CUSTOMER') return <Navigate to="/customer/dashboard" replace />;
    return <Navigate to="/unauthorized" replace />;
  }
  return <Outlet />;
};

const DashboardRedirect = () => {
  const { user } = useAuth();
  if (user?.role === ROLES.ADMIN) return <Navigate to="/admin/dashboard" replace />;
  if (user?.role === ROLES.INTERNAL_STAFF) return <Navigate to="/Staff/dashboard" replace />;
  return <Navigate to="/customer/dashboard" replace />;
};


/* ── App  */

import GlobalToaster from "./components/common/GlobalToaster";
import GlobalApiHandler from "./components/common/GlobalApiHandler";
import StaffCustomerDetailPage from "./pages/Staff/customers/StaffCustomerDetailPage";

const App = () => (
  <>
    <GlobalApiHandler />
    <GlobalToaster />
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Protected routes under UnifiedLayout */}
      <Route element={<ProtectedRoute />}>
        <Route element= {<UnifiedLayout></UnifiedLayout>}
        >
          {/* Common Dashboard Redirect */}
          <Route path="/dashboard" element={<DashboardRedirect />} />

          {/* ── Admin Routes ── */}
          <Route element={<RoleProtectedRoute allowedRole={ROLES.ADMIN} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserListPage />} />
            <Route path="/admin/users/create" element={<CreateStaffPage />} />
            <Route path="/admin/users/:id" element={<UserDetailPage />} />
            <Route path="/admin/customers" element={<CustomerListPage />} />
            <Route path="/admin/customers/:id" element={<CustomerDetailPage />} />
            <Route path="/admin/products" element={<ProductListPage />} />
            <Route path="/admin/products/create" element={<CreateProductPage />} />
            <Route path="/admin/products/edit/:id" element={<EditProductPage />} />
            <Route path="/admin/products/:id" element={<ProductDetailPage />} />
            <Route path="/admin/plans" element={<PlanListPage />} />
            <Route path="/admin/plans/create" element={<CreatePlanPage />} />
            <Route path="/admin/plans/edit/:id" element={<EditPlanPage />} />
            <Route path="/admin/plans/:id" element={<PlanDetailPage />} />
            <Route path="/admin/policies" element={<PolicyListPage />} />
            <Route path="/admin/policies/:id" element={<PolicyDetailPage />} />
            <Route path="/admin/policies/issue" element={<IssuePolicyPage />} />
            <Route path="/admin/claims" element={<ClaimListPage />} />
            <Route path="/admin/claims/:id" element={<ClaimDetailPage />} />
            <Route path="/admin/claims/:id/history" element={<AdminClaimHistoryPage />} />
            <Route path="/admin/payments" element={<PaymentListPage />} />
          </Route>

        {/* ── Staff Routes ── */}
        <Route element={<RoleProtectedRoute allowedRole={ROLES.INTERNAL_STAFF} />}>
          <Route path="/Staff/dashboard" element={<StaffDashboard />} />
          <Route path="/Staff/customers" element={<StaffCustomerListPage />} />
          <Route path="/Staff/customers" element={<StaffCustomerDetailPage />} />

          <Route path="/Staff/profile" element={<ProfilePage />} />
          <Route path="/Staff/profile/edit" element={<EditProfilePage />} />
          <Route path="/Staff/policies" element={<StaffPolicyListPage />} />
          <Route path="/Staff/policies/:policyId" element={<StaffPolicyDetailPage />} />
          <Route path="/Staff/claims" element={<StaffClaimListPage />} />
          <Route path="/Staff/claims/:id" element={<StaffClaimDetailPage />} />
          <Route path="/Staff/issue-policy" element={<StaffIssuePolicyPage />} />
          <Route path="/Staff/claims/:id/history" element={<StaffClaimHistory />} />
          <Route path="/Staff/payments/page" element={<StaffPaymentListPage />} />
          <Route path="/Staff/payments/pay/:policyId" element={<StaffRecordPaymentPage />}
          
/>
        </Route>

          {/* ── Customer Routes ── */}
          <Route element={<RoleProtectedRoute allowedRole={ROLES.CUSTOMER} />}>
            <Route path="/customer/dashboard" element={<CustomerDashboard />} />
            <Route path="/customer/profile" element={<ProfilePage />} />
            <Route path="/customer/profile/edit" element={<EditProfilePage />} />
            <Route path="/customer/products" element={<CustomerProductListPage />} />
            <Route path="/customer/products/:productId/plans" element={<CustomerPlanListPage />} />
            <Route path="/customer/plans" element={<CustomerPlanListPage />} />
            <Route path="/customer/purchase-policy/:planId" element={<PurchasePolicyPage />} />
            <Route path="/customer/policies" element={<CustomerPolicyListPage />} />
            <Route path="/customer/policies/:policyId" element={<CustomerPolicyDetailPage />} />
            <Route path="/customer/payments" element={<CustomerPaymentHistoryPage />} />
            <Route path="/customer/payments/pay/:policyId" element={<RecordPaymentPage />} />
            <Route path="/customer/claims" element={<CustomerClaimListPage />} />
            <Route path="/customer/claims/raise" element={<RaiseClaimPage />} />
            <Route path="/customer/claims/history/:claimId" element={<ClaimStatusHistoryPage />} />
            <Route path="/customer/claims/upload/:claimId" element={<UploadDocumentsPage />} />
            <Route path="/customer/claims/:claimId" element={<ClaimDetailsPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  </>
);

export default App;

    


