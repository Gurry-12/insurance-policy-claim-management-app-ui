import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
  return (
    <div>
      <h4>DashboardLayout</h4>
      <Outlet />
    </div>
  );
};

export default DashboardLayout;
