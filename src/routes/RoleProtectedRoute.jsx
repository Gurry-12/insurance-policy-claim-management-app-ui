import { Outlet } from 'react-router-dom';

const RoleProtectedRoute = () => {
  return (
    <div>
      <h4>RoleProtectedRoute</h4>
      <Outlet />
    </div>
  );
};

export default RoleProtectedRoute;
