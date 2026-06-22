import {
  FaHome,
  FaFileAlt,
  FaUsers,
  FaClipboardList,
  FaMoneyCheckAlt,
} from "react-icons/fa";

import { NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';   


const Sidebar = ({ navItems, isOpen, setIsOpen, title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (

    
    <>
      <aside
        className={`sidebar sidebar-open-${isOpen}`}
        style={{
          position: 'fixed', top: 0, left: 0, bottom: 0,
          width: 260, zIndex: 1040,
          backgroundColor: 'var(--ss-sidebar-bg)',
          borderRight: '1px solid var(--ss-border)',
          display: 'flex', flexDirection: 'column',
          transition: 'transform 0.25s ease',
          transform: isOpen ? 'translateX(0)' : undefined,
        }}
      >
        {/* Brand */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--ss-border)' }}>
          <div className="d-flex align-items-center gap-2">
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: 'linear-gradient(135deg,#f05a28,#e04f1e)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <i className="bi bi-shield-fill-check text-white" style={{ fontSize: '1rem' }} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--ss-text-primary)', lineHeight: 1.2 }}>
                InsureFlow
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--ss-text-muted)', fontWeight: 500 }}>
                {title}
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '0.75rem 0.75rem' }}>
          {navItems.map(({ to, icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `sidebar-link d-flex align-items-center gap-2 px-3 py-2 mb-1 rounded-3 text-decoration-none fw-500 ${isActive ? 'sidebar-link-active' : ''}`
              }
              style={{ fontSize: '0.875rem', fontWeight: 500 }}
            >
              <i className={`bi ${icon}`} style={{ fontSize: '1rem', width: 20, textAlign: 'center' }} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User footer */}
        <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid var(--ss-border)' }}>
          <div className="d-flex align-items-center gap-2 mb-2">
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'linear-gradient(135deg,#f05a28,#e04f1e)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.8rem', color: '#fff', fontWeight: 700, flexShrink: 0,
            }}>
              {user?.name?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ss-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.name ?? 'User'}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--ss-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.email}
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-sm w-100 d-flex align-items-center justify-content-center gap-2"
            style={{ borderRadius: 8, border: '1px solid var(--ss-border)', color: 'var(--ss-text-secondary)', backgroundColor: 'transparent', fontSize: '0.8rem' }}
          >
            <i className="bi bi-box-arrow-right" /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 1039, background: 'rgba(0,0,0,0.4)' }}
        />
      )}

       <div className="sidebar">

      <div className="logo-section">
        <h2>ICMS</h2>
        <p>Agent Portal</p>
      </div>

      <ul className="menu">

        <li>
          <NavLink to="/agent/dashboard">
            <FaHome />
            <span>Dashboard</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/agent/claims">
            <FaFileAlt />
            <span>Claims</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/agent/customers">
            <FaUsers />
            <span>Customers</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/agent/policies">
            <FaClipboardList />
            <span>Policies</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/agent/payments">
            <FaMoneyCheckAlt />
            <span>Payments</span>
          </NavLink>
        </li>

      </ul>

    </div>
    </>
    
  );
};

export default Sidebar;