import { useEffect, useState } from "react";
import { getAllCustomersPaginated } from "../../../services/customerService";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/common/PageHeader";
import useSearch from "../../../hooks/useSearch";
import useCustomerPdf from "../../../hooks/PdfDownload/useCustomerPdf";
import ExportButton from "../../../components/common/ExportButton";
import useTableState from "../../../hooks/useTableState";
import PaginationBar from "../../../components/tables/PaginationBar";

const StaffCustomerListPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { downloadCustomer } = useCustomerPdf();

  const tableState = useTableState({
    initialSortBy: 'id'
  });

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        setLoading(true);
        const params = tableState.getQueryParams();
        const res = await getAllCustomersPaginated(params);
        setCustomers(res.content || []);
        tableState.setTotalPages(res.totalPages || 1);
        tableState.setTotalElements(res.totalElements || res.totalRecords || 0);
      } catch (error) {
        console.error("Error loading customers:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, [tableState.currentPage, tableState.sortBy, tableState.sortDirection]);

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
          <div className="d-flex gap-2">
            <ExportButton
              data={customers || []}
              columns={[
                { header: "Customer Name", accessor: "fullName" },
                { header: "Email Address", accessor: "email" },
                { header: "Mobile Number", accessor: "mobileNumber" },
                { header: "City", accessor: "city" },
                { header: "State", accessor: "state" },
                { header: "Nominee Name", accessor: "nomineeName" },
                { header: "Nominee Relation", accessor: "nomineeRelation" }
              ]}
              filename="Staff_customers_list.csv"
            />
            <button className="btn btn-secondary d-flex align-items-center gap-1" onClick={() => navigate("/staff/dashboard")}>
              <i className="bi bi-arrow-left"></i> Back
            </button>
          </div>
        }
      />

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by Name, Email or Mobile"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead>
            <tr>
              <th>Sr. No.</th>
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
          <td>{tableState.getSrNo(index)}</td>
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
      {customers.length > 0 && (
        <div className="mt-3">
          <PaginationBar
            currentPage={tableState.currentPage}
            totalPages={tableState.totalPages}
            onPageChange={tableState.setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default StaffCustomerListPage;

