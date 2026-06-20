import useAuth from "../../hooks/useAuth";

 
const AdminDashboard = () => {

  const { logout } = useAuth();
  return (
    <div>
      <h4>Admin Dashboard</h4>

      <button
        className="btn btn-outline-danger rounded-pill px-4 mt-2"
        onClick={logout}
      >
        <i className="bi bi-box-arrow-right me-2" />
        Logout
      </button>
    
    </div>
  );
};

export default AdminDashboard;
