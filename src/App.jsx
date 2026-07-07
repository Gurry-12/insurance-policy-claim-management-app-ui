import { Navigate, Outlet, Routes, Route, useLocation } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import { ROLES } from "./utils/roles";
import { Suspense, lazy } from "react";
import MainLayout from "./components/layouts/UnifiedLayout";
import GlobalToaster from "./components/common/GlobalToaster";
import GlobalApiHandler from "./components/common/GlobalApiHandler";
import LoadingSpinner from "./components/common/LoadingSpinner";

const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const VerifyOtp = lazy(() => import("./pages/auth/VerifyOtp"));
const LandingPage = lazy(() => import("./pages/LandingPage"));
const NotFound = lazy(() => import("./pages/shared/NotFound"));
const Unauthorized = lazy(() => import("./pages/shared/Unauthorized"));

const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const UserListPage = lazy(() => import("./pages/admin/users/UserListPage"));
const CreateStaffPage = lazy(
  () => import("./pages/admin/users/CreateStaffPage"),
);
const UserDetailPage = lazy(() => import("./pages/admin/users/UserDetailPage"));
const CustomerListPage = lazy(
  () => import("./pages/admin/customers/CustomerListPage"),
);
const CustomerDetailPage = lazy(
  () => import("./pages/admin/customers/CustomerDetailPage"),
);
const ProductListPage = lazy(
  () => import("./pages/admin/products/ProductListPage"),
);
const CreateProductPage = lazy(
  () => import("./pages/admin/products/CreateProductPage"),
);
const EditProductPage = lazy(
  () => import("./pages/admin/products/EditProductPage"),
);
const ProductDetailPage = lazy(
  () => import("./pages/admin/products/ProductDetailPage"),
);
const PlanListPage = lazy(() => import("./pages/admin/plans/PlanListPage"));
const CreatePlanPage = lazy(() => import("./pages/admin/plans/CreatePlanPage"));
const EditPlanPage = lazy(() => import("./pages/admin/plans/EditPlanPage"));
const PlanDetailPage = lazy(() => import("./pages/admin/plans/PlanDetailPage"));
const PolicyListPage = lazy(
  () => import("./pages/admin/policies/PolicyListPage"),
);
const PolicyDetailPage = lazy(
  () => import("./pages/admin/policies/PolicyDetailPage"),
);
const IssuePolicyPage = lazy(
  () => import("./pages/admin/policies/IssuePolicyPage"),
);
const ClaimListPage = lazy(() => import("./pages/admin/claims/ClaimListPage"));
const ClaimDetailPage = lazy(
  () => import("./pages/admin/claims/ClaimDetailPage"),
);
const PaymentListPage = lazy(
  () => import("./pages/admin/payments/PaymentListPage"),
);

const StaffDashboard = lazy(() => import("./pages/staff/StaffDashboard"));
const StaffCustomerListPage = lazy(
  () => import("./pages/staff/customers/StaffCustomerListPage"),
);
const StaffCustomerDetailPage = lazy(
  () => import("./pages/staff/customers/StaffCustomerDetailPage"),
);
const StaffPolicyListPage = lazy(
  () => import("./pages/staff/policies/StaffPolicyListPage"),
);
const StaffPolicyDetailPage = lazy(
  () => import("./pages/staff/policies/StaffPolicyDetailPage"),
);
const StaffIssuePolicyPage = lazy(
  () => import("./pages/staff/policies/StaffIssuePolicyPage"),
);
const StaffClaimListPage = lazy(
  () => import("./pages/staff/claims/StaffClaimListPage"),
);
const StaffClaimDetailPage = lazy(
  () => import("./pages/staff/claims/StaffClaimDetailPage"),
);
const StaffPaymentListPage = lazy(
  () => import("./pages/staff/payments/StaffPaymentListPage"),
);
const StaffRecordPaymentPage = lazy(
  () => import("./pages/staff/payments/StaffRecordPaymentPage"),
);

const CustomerDashboard = lazy(
  () => import("./pages/customer/CustomerDashboard"),
);
const ProfilePage = lazy(() => import("./pages/customer/profile/ProfilePage"));
const EditProfilePage = lazy(
  () => import("./pages/customer/profile/EditProfilePage"),
);
const CustomerProductListPage = lazy(
  () => import("./pages/customer/products/CustomerProductListPage"),
);
const CustomerPlanListPage = lazy(
  () => import("./pages/customer/plans/CustomerPlanListPage"),
);
const PurchasePolicyPage = lazy(
  () => import("./pages/customer/policies/PurchasePolicyPage"),
);
const CustomerPolicyListPage = lazy(
  () => import("./pages/customer/policies/CustomerPolicyListPage"),
);
const CustomerPolicyDetailPage = lazy(
  () => import("./pages/customer/policies/CustomerPolicyDetailPage"),
);
const CustomerPaymentHistoryPage = lazy(
  () => import("./pages/customer/payments/CustomerPaymentHistoryPage"),
);
const RecordPaymentPage = lazy(
  () => import("./pages/customer/payments/RecordPaymentPage"),
);
const CustomerClaimListPage = lazy(
  () => import("./pages/customer/claims/CustomerClaimListPage"),
);
const RaiseClaimPage = lazy(
  () => import("./pages/customer/claims/RaiseClaimPage"),
);
const ClaimDetailsPage = lazy(
  () => import("./pages/customer/claims/ClaimDetailsPage"),
);
const UploadDocumentsPage = lazy(
  () => import("./pages/customer/claims/UploadDocumentsPage"),
);

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

const GuestRoute = () => {
  const { isAuthenticated, user } = useAuth();
  if (isAuthenticated && user) {
    if (user.role === ROLES.ADMIN)
      return <Navigate to="/admin/dashboard" replace />;
    if (user.role === ROLES.INTERNAL_STAFF)
      return <Navigate to="/staff/dashboard" replace />;
    if (user.role === ROLES.CUSTOMER)
      return <Navigate to="/customer/dashboard" replace />;
  }
  return <Outlet />;
};

const RoleProtectedRoute = ({ allowedRole }) => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== allowedRole) {
    if (user?.role === "ADMIN")
      return <Navigate to="/admin/dashboard" replace />;
    if (user?.role === "INTERNAL_STAFF")
      return <Navigate to="/staff/dashboard" replace />;
    if (user?.role === "CUSTOMER")
      return <Navigate to="/customer/dashboard" replace />;
    return <Navigate to="/unauthorized" replace />;
  }
  return <Outlet />;
};

const DashboardRedirect = () => {
  const { user } = useAuth();
  if (user?.role === ROLES.ADMIN)
    return <Navigate to="/admin/dashboard" replace />;
  if (user?.role === ROLES.INTERNAL_STAFF)
    return <Navigate to="/staff/dashboard" replace />;
  return <Navigate to="/customer/dashboard" replace />;
};

const App = () => (
  <>
    <GlobalApiHandler />
    <GlobalToaster />
    <Suspense
      fallback={
        <div className="d-flex align-items-center justify-content-center vh-100">
          <LoadingSpinner />
        </div>
      }
    >
      <Routes>
        <Route element={<GuestRoute />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route
            element={
              <MainLayout>
                <Outlet />
              </MainLayout>
            }
          >
            <Route path="/dashboard" element={<DashboardRedirect />} />

            <Route element={<RoleProtectedRoute allowedRole={ROLES.ADMIN} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UserListPage />} />
              <Route path="/admin/users/create" element={<CreateStaffPage />} />
              <Route path="/admin/users/:id" element={<UserDetailPage />} />
              <Route path="/admin/customers" element={<CustomerListPage />} />
              <Route
                path="/admin/customers/:id"
                element={<CustomerDetailPage />}
              />
              <Route path="/admin/products" element={<ProductListPage />} />
              <Route
                path="/admin/products/create"
                element={<CreateProductPage />}
              />
              <Route
                path="/admin/products/edit/:id"
                element={<EditProductPage />}
              />
              <Route
                path="/admin/products/:id"
                element={<ProductDetailPage />}
              />
              <Route path="/admin/plans" element={<PlanListPage />} />
              <Route path="/admin/plans/create" element={<CreatePlanPage />} />
              <Route path="/admin/plans/edit/:id" element={<EditPlanPage />} />
              <Route path="/admin/plans/:id" element={<PlanDetailPage />} />
              <Route path="/admin/policies" element={<PolicyListPage />} />
              <Route
                path="/admin/policies/:id"
                element={<PolicyDetailPage />}
              />
              <Route
                path="/admin/policies/issue"
                element={<IssuePolicyPage />}
              />
              <Route path="/admin/claims" element={<ClaimListPage />} />
              <Route path="/admin/claims/:id" element={<ClaimDetailPage />} />
              <Route path="/admin/payments" element={<PaymentListPage />} />
            </Route>

            <Route
              element={
                <RoleProtectedRoute allowedRole={ROLES.INTERNAL_STAFF} />
              }
            >
              <Route path="/staff/dashboard" element={<StaffDashboard />} />
              <Route
                path="/staff/customers"
                element={<StaffCustomerListPage />}
              />
              <Route
                path="/staff/customers/:id"
                element={<StaffCustomerDetailPage />}
              />
              <Route path="/staff/profile" element={<ProfilePage />} />
              <Route path="/staff/profile/edit" element={<EditProfilePage />} />
              <Route path="/staff/policies" element={<StaffPolicyListPage />} />
              <Route
                path="/staff/policies/:policyId"
                element={<StaffPolicyDetailPage />}
              />
              <Route path="/staff/claims" element={<StaffClaimListPage />} />
              <Route
                path="/staff/claims/:id"
                element={<StaffClaimDetailPage />}
              />
              <Route
                path="/staff/issue-policy"
                element={<StaffIssuePolicyPage />}
              />
              <Route
                path="/staff/payments"
                element={<StaffPaymentListPage />}
              />
              <Route
                path="/staff/payments/pay/:policyId"
                element={<StaffRecordPaymentPage />}
              />
            </Route>

            <Route
              element={<RoleProtectedRoute allowedRole={ROLES.CUSTOMER} />}
            >
              <Route
                path="/customer/dashboard"
                element={<CustomerDashboard />}
              />
              <Route path="/customer/profile" element={<ProfilePage />} />
              <Route
                path="/customer/profile/edit"
                element={<EditProfilePage />}
              />
              <Route
                path="/customer/products"
                element={<CustomerProductListPage />}
              />
              <Route
                path="/customer/products/:productId/plans"
                element={<CustomerPlanListPage />}
              />
              <Route
                path="/customer/plans"
                element={<CustomerPlanListPage />}
              />
              <Route
                path="/customer/purchase-policy/:planId"
                element={<PurchasePolicyPage />}
              />
              <Route
                path="/customer/policies"
                element={<CustomerPolicyListPage />}
              />
              <Route
                path="/customer/policies/:policyId"
                element={<CustomerPolicyDetailPage />}
              />
              <Route
                path="/customer/payments"
                element={<CustomerPaymentHistoryPage />}
              />
              <Route
                path="/customer/payments/pay/:policyId"
                element={<RecordPaymentPage />}
              />
              <Route
                path="/customer/claims"
                element={<CustomerClaimListPage />}
              />
              <Route
                path="/customer/claims/raise"
                element={<RaiseClaimPage />}
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
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  </>
);

export default App;
