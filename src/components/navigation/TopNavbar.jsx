
import { FaBell, FaSearch } from "react-icons/fa";
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';

const TopNavbar = ({ onMenuClick }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();


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
      {/* Left side: Hamburger (mobile) + Back & Forward Controls */}
      <div className="d-flex align-items-center gap-3">
        <button
          className="btn d-lg-none p-1"
          onClick={onMenuClick}
          style={{ color: 'var(--ss-text-secondary)', border: 'none', background: 'none', fontSize: '1.25rem' }}
        >
          <i className="bi bi-list" />
        </button>

        {/* Modern Circular Navigation Controls */}
        <div className="d-flex align-items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="btn p-0 d-flex align-items-center justify-content-center"
            style={{ 
              width: 36, 
              height: 36, 
              borderRadius: '50%', 
              border: '1px solid var(--ss-border)',
              backgroundColor: 'transparent',
              color: 'var(--ss-text-secondary)',
              transition: 'all 0.2s ease-in-out',
              boxShadow: 'var(--ss-shadow-sm)'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--ss-primary)';
              e.currentTarget.style.backgroundColor = 'var(--ss-primary-light)';
              e.currentTarget.style.color = 'var(--ss-primary)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--ss-border)';
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--ss-text-secondary)';
            }}
            title="Go Back"
          >
            <i className="bi bi-chevron-left" style={{ fontSize: '0.95rem', fontWeight: 'bold' }} />
          </button>
          <button
            onClick={() => navigate(1)}
            className="btn p-0 d-flex align-items-center justify-content-center"
            style={{ 
              width: 36, 
              height: 36, 
              borderRadius: '50%', 
              border: '1px solid var(--ss-border)',
              backgroundColor: 'transparent',
              color: 'var(--ss-text-secondary)',
              transition: 'all 0.2s ease-in-out',
              boxShadow: 'var(--ss-shadow-sm)'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--ss-primary)';
              e.currentTarget.style.backgroundColor = 'var(--ss-primary-light)';
              e.currentTarget.style.color = 'var(--ss-primary)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--ss-border)';
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--ss-text-secondary)';
            }}
            title="Go Forward"
          >
            <i className="bi bi-chevron-right" style={{ fontSize: '0.95rem', fontWeight: 'bold' }} />
          </button>
        </div>
      </div>

      {/* Right side: Notification + Theme Toggle */}
      <div className="d-flex align-items-center gap-3">
        {/* Notification Icon */}
        <button
          className="btn btn-sm p-1 position-relative"
          title="Notifications"
          style={{ color: 'var(--ss-text-secondary)', border: 'none', background: 'none' }}
        >
          <i className="bi bi-bell" style={{ fontSize: '1.15rem' }} />
          <span 
            className="position-absolute bg-danger border border-light rounded-circle" 
            style={{ 
              width: 8, 
              height: 8, 
              top: 4, 
              right: 4 
            }}
          />
        </button>

        {/* Theme Toggle */}
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