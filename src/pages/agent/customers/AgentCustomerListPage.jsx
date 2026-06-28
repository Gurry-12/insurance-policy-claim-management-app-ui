import { useEffect, useState } from "react";
import { getAllCustomers } from "../../../services/customerService";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/common/PageHeader";
import useSearch from "../../../hooks/useSearch";
import useCustomerPdf from "../../../hooks/PdfDownload/useCustomerPdf";

const AgentCustomerListPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { downloadCustomer } = useCustomerPdf();

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

  const {
  searchTerm,
  setSearchTerm,
  filteredData: filteredCustomers,
} = useSearch(customers, [
  "fullName",
  "email",
  "mobileNumber",
]);
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Customer Management"
        subtitle="Manage and view your registered clients"
        action={
          <button className="btn btn-secondary d-flex align-items-center gap-1" onClick={() => navigate("/agent/dashboard")}>
            <i className="bi bi-arrow-left"></i> Back
          </button>
        }
      />

        <input
          type="text"
          className="form-control"
          placeholder="Search by Name, Email or Mobile"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>City</th>
              <th>State</th>
              <th>Download</th>
            </tr>
          </thead>

         
          <tbody>
  {filteredCustomers.length > 0 ? (
    filteredCustomers.map((customer,index) => (
      <tr key={customer.customerId}>
          <td>{index + 1}</td>
         <td style={{ fontWeight: 600 }}>
          {customer.fullName}
        </td>

        <td>{customer.email}</td>
        <td>{customer.mobileNumber}</td>
        <td>{customer.city}</td>
        <td>{customer.state}</td>

        <td>
    <button
        className="btn btn-danger btn-sm"
        onClick={() => downloadCustomer(customer)}
    >
        <i className="bi bi-download me-1"></i>
        PDF
    </button>
</td>

      </tr>
    ))
  ) : (
    <tr>
      
           <td colSpan="5" className="text-center py-4">
        No Customers Found
      </td>

    </tr>
  )}
</tbody>
        </table>
      </div>
    </div>
  );
};

export default AgentCustomerListPage;
