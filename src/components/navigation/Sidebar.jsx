import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Sidebar = ({ isOpen, setIsOpen, title = "Agent Portal" }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const navItems = [
    {
      to: "/agent/dashboard",
      icon: "bi-speedometer2",
      label: "Dashboard",
      end: true,
    },
    {
      to: "/agent/claims",
      icon: "bi-file-earmark-text",
      label: "Claims",
    },
    {
      to: "/agent/claims-history",
      icon: "bi-clock-history",
      label: "Claims History",
    },
    {
      to: "/agent/customers",
      icon: "bi-people",
      label: "Customers",
    },
    {
      to: "/agent/policies",
      icon: "bi-shield-check",
      label: "Policies",
    },
    {
      to: "/agent/issue-policy",
      icon: "bi-file-earmark-plus",
      label: "Issue Policy",
    },
    {
      to: "/agent/payments/page",
      icon: "bi-credit-card",
      label: "Payments",
    },
  ];

  return (
    <>
      <aside
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: "260px",
          zIndex: 1040,
          backgroundColor: "#fff",
          borderRight: "1px solid #dee2e6",
          display: "flex",
          flexDirection: "column",
          transition: "all 0.3s ease",
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: "20px",
            borderBottom: "1px solid #dee2e6",
          }}
        >
          <div className="d-flex align-items-center gap-2">
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "#f05a28",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <i
                className="bi bi-shield-fill-check text-white"
                style={{ fontSize: "18px" }}
              />
            </div>

            <div>
              <h6 className="mb-0 fw-bold">InsureFlow</h6>
              <small className="text-muted">{title}</small>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "12px",
          }}
        >
          {navItems.map(({ to, icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `d-flex align-items-center gap-3 px-3 py-3 mb-2 rounded text-decoration-none ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-dark"
                }`
              }
            >
              <i className={`bi ${icon}`} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Section */}
        <div
          style={{
            padding: "16px",
            borderTop: "1px solid #dee2e6",
          }}
        >
          <div className="d-flex align-items-center gap-2 mb-3">
            <div
              style={{
                width: 35,
                height: 35,
                borderRadius: "50%",
                background: "#f05a28",
                color: "#fff",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: "bold",
              }}
            >
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>

            <div>
              <div className="fw-semibold">
                {user?.name || "Agent"}
              </div>

              <small className="text-muted">
                {user?.email}
              </small>
            </div>
          </div>

          <button
            className="btn btn-outline-danger w-100"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </aside>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            zIndex: 1039,
          }}
        />
      )}
    </>
  );
};

export default Sidebar;