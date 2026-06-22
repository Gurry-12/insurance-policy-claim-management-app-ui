import { Outlet, Link } from "react-router-dom";

function CustomerLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      
      {/* Sidebar */}
      <div
        style={{
          width: "250px",
          backgroundColor: "#1e293b",
          color: "white",
          padding: "20px",
        }}
      >
        <h2>Customer Panel</h2>

        <ul style={{ listStyle: "none", padding: 0 }}>
          <li>
            <Link to="/customer/dashboard">Dashboard</Link>
          </li>

          <li>
            <Link to="/customer/profile">Profile</Link>
          </li>

          <li>
            <Link to="/customer/products">Products</Link>
          </li>

          <li>
            <Link to="/customer/policies">Policies</Link>
          </li>

          <li>
            <Link to="/customer/payments">Payments</Link>
          </li>

          <li>
            <Link to="/customer/claims">Claims</Link>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "20px" }}>
        <Outlet />
      </div>
    </div>
  );
}

export default CustomerLayout;