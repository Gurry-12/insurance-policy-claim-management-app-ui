import { FaBell, FaSearch } from "react-icons/fa";

const Navbar = () => {
  return (
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
            <h4>Agent John</h4>
            <p>Agent</p>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Navbar;