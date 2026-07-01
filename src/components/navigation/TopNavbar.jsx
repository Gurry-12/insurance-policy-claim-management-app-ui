import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';
import useAuth from '../../hooks/useAuth';
import { Search, Bell } from 'lucide-react';

const TopNavbar = ({ onMenuClick, breadcrumb }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="ip-topbar px-4 align-items-center justify-content-between">
      {/* Left Section: Mobile menu button + Breadcrumb/Navigation */}
      <div className="d-flex align-items-center gap-3">
        <button
          className="btn d-md-none p-1 text-secondary border-0"
          onClick={onMenuClick}
          aria-label="Toggle navigation"
        >
          <i className="bi bi-list fs-4" />
        </button>

        <div className="d-none d-md-flex align-items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-sm btn-light rounded-circle p-0 d-flex align-items-center justify-content-center"
            style={{ width: 32, height: 32 }}
            title="Go Back"
          >
            <i className="bi bi-chevron-left small" />
          </button>
          <button
            onClick={() => navigate(1)}
            className="btn btn-sm btn-light rounded-circle p-0 d-flex align-items-center justify-content-center"
            style={{ width: 32, height: 32 }}
            title="Go Forward"
          >
            <i className="bi bi-chevron-right small" />
          </button>
        </div>

        <span className="fw-medium text-muted small ms-2 d-none d-sm-block text-capitalize">
          {breadcrumb ?? (user?.role ? `${user.role.charAt(0) + user.role.slice(1).toLowerCase()} Portal` : 'Portal')}
        </span>
      </div>


      {/* Right Section: Actions + Profile */}
      <div className="d-flex align-items-center gap-3 ms-auto">
        

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="btn btn-sm text-secondary p-1 border-0"
          title="Toggle Light/Dark Theme"
        >
          <i className={`bi ${theme === 'dark' ? 'bi-sun-fill' : 'bi-moon-fill'} fs-6`} />
        </button>

        <div className="vr bg-secondary opacity-25 mx-1" style={{ width: '1px', height: '24px' }}></div>

        {/* User Profile Dropdown (Mock) */}
        <div className="dropdown">
          <div 
            className="d-flex align-items-center gap-2" 
            role="button" 
            data-bs-toggle="dropdown" 
            aria-expanded="false"
          >
            <div
              className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm"
              style={{
                width: 34,
                height: 34,
                background: 'linear-gradient(135deg, var(--ip-brand), var(--ip-secondary, #1e3a8a))',
                fontSize: '0.85rem'
              }}
            >
              {user?.name?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div className="d-none d-sm-block text-start" style={{ lineHeight: 1.2 }}>
              <div className="fw-semibold text-dark" style={{ fontSize: '0.85rem' }}>
                {user?.name ?? 'User'}
              </div>
              <div className="text-muted text-capitalize" style={{ fontSize: '0.7rem' }}>
                {user?.role ? user.role.toLowerCase() : 'User'}
              </div>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};

export default TopNavbar;