import Sidebar from "../components/layout/Sidebar";
import { Outlet } from "react-router-dom";
import TopNavbar from "../navigation/TopNavbar";

const AgentLayout = () => {

  return (
    
      
      <>
  <Sidebar />
  <TopNavbar />

  <main
    style={{
      marginLeft: "260px",
      marginTop: "70px",
      padding: "20px",
    }}
  >
    <Outlet />
  </main>
</>

  );
};

export default AgentLayout;