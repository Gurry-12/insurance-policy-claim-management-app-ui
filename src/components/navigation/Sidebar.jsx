import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import logoImg from "../../assets/logo/insurance-heart-vector.png";
import { PanelLeftClose, PanelLeftOpen, LogOut } from "lucide-react";

const Sidebar = ({ navItems, isOpen, setIsOpen, isCollapsed, setIsCollapsed, title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    navigate("/login", { replace: true });
  };

  return (
    <>
      <aside className={`ip-sidebar ${isCollapsed ? 'collapsed' : ''} ${isOpen ? 'mobile-open' : ''}`}>
        {/* Brand */}
        <div className="ip-sidebar-header">
          <div className="ip-sidebar-brand">
            <img 
              src={logoImg} 
              alt="InsureFlow Logo" 
              className="ip-sidebar-logo"
            />
            {!isCollapsed && <div className="ip-sidebar-portal-name">{title}</div>}
          </div>
          {/* Desktop Toggle */}
          <button 
            className="ip-sidebar-toggle d-none d-md-flex" 
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="ip-sidebar-nav">
          {!isCollapsed && <div className="ip-nav-section">Main Menu</div>}
          {navItems.map(({ to, icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `ip-nav-item ${isActive ? "active" : ""}`}
              title={isCollapsed ? label : ""}
            >
              <i className={`bi ${icon}`} style={{ fontSize: "1.1rem", width: 22, textAlign: "center" }} />
              {!isCollapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User footer */}
        <div className="ip-sidebar-footer">
          <div className="ip-sidebar-user">
            <div className="ip-sidebar-avatar">
              {user?.name?.[0]?.toUpperCase() ?? "U"}
            </div>
            {!isCollapsed && (
              <div className="ip-sidebar-user-info">
                <div className="ip-sidebar-user-name" title={user?.name}>
                  {user?.name ?? "User"}
                </div>
                <div className="ip-sidebar-user-role" title={user?.email}>
                  {user?.email}
                </div>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="ip-sidebar-logout mt-2"
            title="Logout"
          >
            <LogOut size={16} />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="ip-sidebar-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
