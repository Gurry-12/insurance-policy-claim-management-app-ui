
import { FaBell, FaSearch } from "react-icons/fa";
import { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

const TopNavbar = ({ onMenuClick, breadcrumb }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <header
      className="top-navbar"
      style={{
        position: 'sticky', top: 0, zIndex: 1030,
        backgroundColor: 'var(--ss-navbar-bg)',
        borderBottom: '1px solid var(--ss-border)',
        backdropFilter: 'blur(12px)',
        padding: '0.65rem 1.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}
    >
      {/* Hamburger (mobile) */}
      <button
        className="btn d-lg-none p-1"
        onClick={onMenuClick}
        style={{ color: 'var(--ss-text-secondary)', border: 'none', background: 'none', fontSize: '1.25rem' }}
      >
        <i className="bi bi-list" />
      </button>

      {/* Page breadcrumb area – left on desktop */}
      <div className="d-none d-lg-block" style={{ fontSize: '0.85rem', color: 'var(--ss-text-muted)' }}>
        <i className="bi bi-shield-fill-check me-1" style={{ color: '#f05a28' }} />
        {breadcrumb}
      </div>

      {/* Right controls */}
      <div className="d-flex align-items-center gap-2">
        <button
          onClick={toggleTheme}
          className="btn btn-sm"
          title="Toggle theme"
          style={{ border: '1px solid var(--ss-border)', borderRadius: 8, color: 'var(--ss-text-secondary)', background: 'transparent', padding: '0.3rem 0.6rem' }}
        >
          <i className={`bi ${theme === 'dark' ? 'bi-sun' : 'bi-moon'}`} />
        </button>
      </div>

      <div className="navbar">

      <div className="navbar-left">
        <h2>Insurance Claim Management System</h2>
      </div>

      <div className="navbar-right">

        <div className="search-box">
          <FaSearch />
          <input type="text" placeholder="Search here..." />
        </div>

        <FaBell className="bell-icon" />

        <div className="profile">
          <img
            src="https://i.pravatar.cc/40"
            alt="profile"
          />

          <div>
            {/* <h4>Agent John</h4> */}
            <p>Agent</p>
          </div>
        </div>

      </div>

    </div>
    </header>


  );
};

export default TopNavbar;