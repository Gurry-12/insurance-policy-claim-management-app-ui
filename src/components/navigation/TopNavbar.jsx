import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';
import useAuth from '../../hooks/useAuth';

const TopNavbar = ({ onMenuClick, breadcrumb }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header
      className="top-navbar"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1030,
        backgroundColor: 'var(--ss-navbar-bg)',
        borderBottom: '1px solid var(--ss-border)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        padding: '0.75rem 1.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'background-color 0.25s, border-color 0.25s',
      }}
    >
      {/* Left Section: Mobile menu button + Navigation controls + Breadcrumb */}
      <div className="d-flex align-items-center gap-3">
        <button
          className="btn d-lg-none p-1"
          onClick={onMenuClick}
          style={{ color: 'var(--ss-text-secondary)', border: 'none', background: 'none', fontSize: '1.25rem' }}
        >
          <i className="bi bi-list" />
        </button>

        {/* Chevron Navigation Controls */}
        <div className="d-flex align-items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="btn p-0 d-flex align-items-center justify-content-center"
            style={{ 
              width: 34, 
              height: 34, 
              borderRadius: '50%', 
              border: '1px solid var(--ss-border)',
              backgroundColor: 'transparent',
              color: 'var(--ss-text-secondary)',
              transition: 'all 0.25s ease',
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
            <i className="bi bi-chevron-left" style={{ fontSize: '0.85rem' }} />
          </button>
          <button
            onClick={() => navigate(1)}
            className="btn p-0 d-flex align-items-center justify-content-center"
            style={{ 
              width: 34, 
              height: 34, 
              borderRadius: '50%', 
              border: '1px solid var(--ss-border)',
              backgroundColor: 'transparent',
              color: 'var(--ss-text-secondary)',
              transition: 'all 0.25s ease',
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
            <i className="bi bi-chevron-right" style={{ fontSize: '0.85rem' }} />
          </button>
        </div>

        {/* Breadcrumb Info */}
        <span style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--ss-text-muted)', letterSpacing: '0.02em', textTransform: 'capitalize' }}>
          {breadcrumb ?? (user?.role ? `${user.role.charAt(0) + user.role.slice(1).toLowerCase()} Portal` : 'Portal')}
        </span>
      </div>

      {/* Right Section: Theme Toggle + Profile Info */}
      <div className="d-flex align-items-center gap-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="btn btn-sm d-flex align-items-center justify-content-center"
          title="Toggle Light/Dark Theme"
          style={{ 
            border: '1px solid var(--ss-border)', 
            borderRadius: 10, 
            color: 'var(--ss-text-secondary)', 
            background: 'transparent', 
            width: 36, 
            height: 36,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--ss-primary)';
            e.currentTarget.style.color = 'var(--ss-primary)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--ss-border)';
            e.currentTarget.style.color = 'var(--ss-text-secondary)';
          }}
        >
          <i className={`bi ${theme === 'dark' ? 'bi-sun-fill' : 'bi-moon-fill'}`} style={{ fontSize: '0.95rem' }} />
        </button>

        {/* Divider */}
        <div style={{ width: 1, height: 24, backgroundColor: 'var(--ss-border)' }} />

        {/* User Profile */}
        <div className="d-flex align-items-center gap-2">
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--ss-primary), var(--ss-secondary, #1e3a8a))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.85rem',
              color: '#fff',
              fontWeight: 700,
              boxShadow: 'var(--ss-shadow-sm)',
            }}
          >
            {user?.name?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div className="d-none d-sm-block">
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--ss-text-primary)', lineHeight: 1.2 }}>
              {user?.name ?? 'User'}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--ss-text-muted)', fontWeight: 500, textTransform: 'capitalize' }}>
              {user?.role ? user.role.toLowerCase() : 'User'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;