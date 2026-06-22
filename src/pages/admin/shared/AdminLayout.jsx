import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../../components/navigation/Sidebar';
import TopNavbar from '../../../components/navigation/TopNavbar';

const NAV = [
  { to: '/admin/dashboard',         icon: 'bi-speedometer2',      label: 'Dashboard', end: true },
  { to: '/admin/users',             icon: 'bi-people',             label: 'Users' },
  { to: '/admin/customers',         icon: 'bi-person-badge',       label: 'Customers' },
  { to: '/admin/products',          icon: 'bi-box-seam',           label: 'Products' },
  { to: '/admin/plans',             icon: 'bi-layers',             label: 'Plans' },
  { to: '/admin/policies',          icon: 'bi-file-earmark-text',  label: 'Policies' },
  { to: '/admin/claims',            icon: 'bi-shield-exclamation', label: 'Claims' },
  { to: '/admin/payments',          icon: 'bi-credit-card',        label: 'Payments' },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--ss-bg)' }}>
      {/* ── Sidebar ───────────────────────────────── */}
      <Sidebar 
        navItems={NAV} 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
        title="Admin Panel" 
      />

      {/* ── Main area ─────────────────────────────── */}
      <div className="dashboard-main" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Top Navbar */}
        <TopNavbar 
          onMenuClick={() => setSidebarOpen(v => !v)} 
          breadcrumb="Admin" 
        />

        {/* Page content */}
        <main style={{ flex: 1, padding: '1.75rem 1.5rem' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
