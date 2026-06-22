import { Route } from "react-router-dom";

import CustomerLayout from "../pages/customer/shared/CustomerLayout";
import CustomerDashboard from "../pages/customer/CustomerDashboard";

import ProfilePage from "../pages/customer/profile/ProfilePage";
import ProductPage from "../pages/customer/products/ProductPage";
import PolicyPage from "../pages/customer/policies/PolicyPage";
import PaymentPage from "../pages/customer/payments/PaymentPage";
import ClaimPage from "../pages/customer/claims/ClaimPage";

const CustomerRoutes = (
  <Route path="/customer" element={<CustomerLayout />}>
    <Route path="dashboard" element={<CustomerDashboard />} />
    <Route path="profile" element={<ProfilePage />} />
    <Route path="products" element={<ProductPage />} />
    <Route path="policies" element={<PolicyPage />} />
    <Route path="payments" element={<PaymentPage />} />
    <Route path="claims" element={<ClaimPage />} />
  </Route>
);

export default CustomerRoutes;