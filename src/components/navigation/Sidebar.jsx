import {
  FaHome,
  FaFileAlt,
  FaUsers,
  FaClipboardList,
  FaMoneyCheckAlt,
} from "react-icons/fa";

import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
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
  );
};

export default Sidebar;