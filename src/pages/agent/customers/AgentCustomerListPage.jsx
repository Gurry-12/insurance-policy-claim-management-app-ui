 

  import { useEffect, useState } from "react";
import { getAllCustomers } from "../../../services/customerService";
import { useNavigate } from "react-router-dom";

const AgentCustomerListPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
    const navigate = useNavigate();


  useEffect(() => {
  
  const loadCustomers = async () => {
    try {
      const data = await getAllCustomers();
      setCustomers(data);
    } catch (error) {
      console.error("Error loading customers:", error);
    } finally {
      setLoading(false);
    }
  };

    loadCustomers();
  }, []);

  if (loading) {
    return <h2>Loading Customers...</h2>;
  }

  return (

    
    
    <div className="page-container">
      <div className="page-header">
        <h2>Customer Management</h2>
      </div>

         <div className="d-flex justify-content-end mb-3">
    <button    
        className="btn btn-secondary mb-3"
        onClick={() => navigate("/agent/dashboard")}
      > Back </button>
      </div>
      <div className="content-card">
        <table className="customer-table">
          <thead>
            <tr>
              <th>Customer ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Date Of Birth</th>
              <th>City</th>
              <th>State</th>
              <th>Nominee Name</th>
              <th>Relation</th>
              <th>Created Date</th>
            </tr>
          </thead>

          <tbody>
            {customers.length > 0 ? (
              customers.map((customer) => (
                <tr key={customer.customerId}>
                  <td>{customer.customerId}</td>
                  <td>{customer.fullName}</td>
                  <td>{customer.email}</td>
                  <td>{customer.mobileNumber}</td>
                  <td>{customer.dateOfBirth}</td>
                  <td>{customer.city}</td>
                  <td>{customer.state}</td>
                  <td>{customer.nomineeName}</td>
                  <td>{customer.nomineeRelation}</td>
                  <td>
                    {customer.createdDate
                      ? new Date(customer.createdDate).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10">No Customers Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>

    
  );
};

export default AgentCustomerListPage;
