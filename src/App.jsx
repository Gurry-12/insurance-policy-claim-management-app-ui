import { Navigate, Outlet, Routes, Route, useLocation } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import { ROLES } from './utils/roles';


import AgentDashboard from "./pages/agent/AgentDashboard";
import AgentIssuePolicyPage from "./pages/agent/policies/AgentIssuePolicyPage";

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import NotFound from './pages/shared/NotFound';
import Unauthorized from './pages/shared/Unauthorized';
import AdminDashboard from './pages/admin/AdminDashboard';
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import VerifyOtp from './pages/auth/VerifyOtp';
import AgentClaimHistory from './pages/agent/claims/AgentClaimHistory';
import AgentPolicyListPage from './pages/agent/policies/AgentPolicyListPage';
import AgentCustomerListPage from './pages/agent/customers/AgentCustomerListPage';
import AgentClaimListPage from './pages/agent/claims/AgentClaimListPage';
import AgentPaymentListPage from './pages/agent/payments/AgentPaymentListPage';


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


function App() {
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
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<RoleProtectedRoute allowedRole={ROLES.CUSTOMER} />}>
          <Route path="/customer/dashboard" element={<CustomerDashboard></CustomerDashboard>} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;

    

