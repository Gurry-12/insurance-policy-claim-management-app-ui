import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../navigation/Sidebar';
import TopNavbar from '../navigation/TopNavbar';
import useAuth from '../../hooks/useAuth';
import { ROLES } from '../../utils/roles';

// Define navigation items dynamically per role
const NAV_ITEMS_BY_ROLE = {
  [ROLES.ADMIN]: [
    { to: '/admin/dashboard',       icon: 'bi-speedometer2',      label: 'Dashboard', end: true },
    { to: '/admin/users',             icon: 'bi-people',             label: 'Users' },
    { to: '/admin/customers',         icon: 'bi-person-badge',       label: 'Customers' },
    { to: '/admin/products',          icon: 'bi-box-seam',           label: 'Products' },
    { to: '/admin/plans',             icon: 'bi-layers',             label: 'Plans' },
    { to: '/admin/policies',          icon: 'bi-file-earmark-text',  label: 'Policies' },
    { to: '/admin/claims',            icon: 'bi-shield-exclamation', label: 'Claims' },
    { to: '/admin/payments',          icon: 'bi-credit-card',        label: 'Payments' },
  ],
  [ROLES.AGENT]: [
    { to: '/agent/dashboard',       icon: 'bi-speedometer2',      label: 'Dashboard', end: true },
    { to: '/agent/customers',         icon: 'bi-people',             label: 'Customers' },
    { to: '/agent/policies',          icon: 'bi-file-earmark-text',  label: 'Policies' },
    { to: '/agent/claims',            icon: 'bi-shield-exclamation', label: 'Claims' },
    { to: '/agent/payments/page',     icon: 'bi-credit-card',        label: 'Payments' },
  ],
  [ROLES.CUSTOMER]: [
    { to: '/customer/dashboard',    icon: 'bi-speedometer2',      label: 'Dashboard', end: true },
    { to: '/customer/profile',        icon: 'bi-person-circle',      label: 'My Profile' },
    { to: '/customer/products',       icon: 'bi-box-seam',           label: 'Insurance Products' },
    { to: '/customer/policies',        icon: 'bi-file-earmark-text',  label: 'My Policies' },
    { to: '/customer/payments',        icon: 'bi-credit-card',        label: 'Payment History' },
    { to: '/customer/claims',          icon: 'bi-shield-exclamation', label: 'My Claims' },
  ],
};

const THEME_CLASS_BY_ROLE = {
  [ROLES.ADMIN]: 'theme-admin',
  [ROLES.AGENT]: 'theme-agent',
  [ROLES.CUSTOMER]: 'theme-customer',
};

const PORTAL_TITLE_BY_ROLE = {
  [ROLES.ADMIN]: 'Admin Panel',
  [ROLES.AGENT]: 'Agent Console',
  [ROLES.CUSTOMER]: 'Customer Portal',
};

const UnifiedLayout = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const userRole = user?.role || ROLES.CUSTOMER;
  const navItems = NAV_ITEMS_BY_ROLE[userRole] || [];
  const themeClass = THEME_CLASS_BY_ROLE[userRole] || 'theme-customer';
  const portalTitle = PORTAL_TITLE_BY_ROLE[userRole] || 'Portal';

  // Map user role for nice visual breadcrumb
  const formattedRole = userRole.replace('ROLE_', '');
  const breadcrumb = `${formattedRole.charAt(0) + formattedRole.slice(1).toLowerCase()} Portal`;

  return (
    <div className={themeClass} style={{ minHeight: '100vh', backgroundColor: 'var(--ss-bg)' }}>
      {/* ── Sidebar ───────────────────────────────── */}
      <Sidebar 
        navItems={navItems} 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
        title={portalTitle} 
      />

      {/* ── Main area ─────────────────────────────── */}
      <div className="dashboard-main" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Top Navbar */}
        <TopNavbar 
          onMenuClick={() => setSidebarOpen(v => !v)} 
          breadcrumb={breadcrumb} 
        />

        {/* Page content */}
        <main style={{ flex: 1, padding: '1.75rem 1.5rem' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UnifiedLayout;
