import { Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  return (
    <div>
      <h4>ProtectedRoute</h4>
      <Outlet />
    </div>
  );
};

export default ProtectedRoute;
