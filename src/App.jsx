import { Navigate, Outlet, Routes, Route, useLocation } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import { ROLES } from './utils/roles';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import NotFound from './pages/shared/NotFound';
import Unauthorized from './pages/shared/Unauthorized';
import AdminDashboard from './pages/admin/AdminDashboard';
import AgentDashboard from "./pages/agent/AgentDashboard";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import VerifyOtp from './pages/auth/VerifyOtp';
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


const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  return <Outlet />;
};

const RoleProtectedRoute = ({ allowedRole }) => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== allowedRole) return <Navigate to="/unauthorized" replace />;
  return <Outlet />;
};

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/verify-otp" element={<VerifyOtp></VerifyOtp>} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<RoleProtectedRoute allowedRole={ROLES.ADMIN} />}>
          <Route
            path="/admin/dashboard"
            element={<AdminDashboard></AdminDashboard>}
          />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<RoleProtectedRoute allowedRole={ROLES.AGENT} />}>
          <Route
            path="/agent/dashboard"
            element={<AgentDashboard></AgentDashboard>}
          />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<RoleProtectedRoute allowedRole={ROLES.CUSTOMER} />}>

          <Route
            path="/customer/dashboard"
            element={<CustomerDashboard />}
          />

          <Route
            path="/customer/profile"
            element={<ProfilePage />}
          />

          <Route
            path="/customer/profile/edit"
            element={<EditProfilePage />}
          />

          <Route
            path="/customer/products"
            element={<CustomerProductListPage />}
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
            path="/customer/claims/history/:claimId"
            element={<ClaimStatusHistoryPage />}
          />

          <Route
            path="/customer/claims/upload/:claimId"
            element={<UploadDocumentsPage />}
          />




        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;