import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../../components/common/PageHeader';
import DataTable from '../../../components/tables/DataTable';
import PaginationBar from '../../../components/tables/PaginationBar';
import { getAllCustomersPaginated } from '../../../services/customerService';
import useTableState from '../../../hooks/useTableState';
import SortableHeader from '../../../components/tables/SortableHeader';
import useSearch from '../../../hooks/useSearch';
import ExportButton from '../../../components/common/ExportButton';

const CustomerListPage = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState(null);
  const tableState = useTableState({ initialSortBy: 'id' });

  // Custom debounced filter for City
  const [cityQuery, setCityQuery] = useState('');
  const [debouncedCity, setDebouncedCity] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedCity(cityQuery);
    }, 400);
    return () => clearTimeout(handler);
  }, [cityQuery]);

  const fetchCustomers = () => {
    const params = tableState.getQueryParams();
    if (debouncedCity) {
      params.city = debouncedCity;
    }

    getAllCustomersPaginated(params)
      .then((res) => {
        setCustomers(res.content);
        tableState.setTotalPages(res.totalPages);
        tableState.setTotalElements(res.totalElements || res.totalRecords || 0);
      })
      .catch((error) => console.log(error));
  };

  const { searchTerm, setSearchTerm, filteredData: filteredCustomers } = useSearch(customers || [], [
    "fullName",
    "email",
    "mobileNumber"
  ]);

  useEffect(() => {
    fetchCustomers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    tableState.currentPage, 
    tableState.sortBy, 
    tableState.sortDirection, 
    debouncedCity
  ]);

  const renderHeader = (label, field) => (
    <SortableHeader 
      label={label} 
      field={field} 
      currentSortBy={tableState.sortBy} 
      currentDirection={tableState.sortDirection} 
      onSort={tableState.handleSort} 
    />
  );

  const columns = [
    {
      header: "Sr. No.",
      cell: (row, index) => tableState.getSrNo(index),
      minWidth: "85px",
    },
    { header: "Name", accessor: "fullName" },
    { header: "Email", accessor: "email" },
    { header: "Phone", accessor: "mobileNumber" },
    { header: renderHeader("Joined", "createdDate"), accessor: "createdDate" },
    {
      header: renderHeader("City", "city"),
      accessor: "city"
    },
    {
      header: "Actions",
      cell: (row) => (
        <button
          className="btn btn-sm btn-light text-primary border-0"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/admin/customers/${row.customerId}`);
          }}
        >
          <i className="bi bi-eye"></i> View
        </button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader 
        title="Customers Management" 
        subtitle="View and manage all registered customers"
        action={
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
            filename="customers_list.csv"
          />
        }
      />
      
      <div className="card border-0" style={{ borderRadius: 16, boxShadow: 'var(--ss-shadow)' }}>
        <div className="card-body p-0">
          <div className="p-4 border-bottom border-light d-flex justify-content-between align-items-center flex-wrap gap-3">
            <h6 className="m-0 fw-bold">All Customers</h6>
            <div className="d-flex gap-2 flex-wrap">
              <div className="input-group input-group-sm" style={{ width: '180px' }}>
                <span className="input-group-text bg-white border-end-0" style={{ border: '1px solid var(--ss-border)' }}>
                  <i className="bi bi-geo-alt text-muted"></i>
                </span>
                <input 
                  type="text" 
                  className="form-control border-start-0 ps-0" 
                  placeholder="City..." 
                  style={{ border: '1px solid var(--ss-border)', borderRadius: '0 8px 8px 0' }}
                  value={cityQuery}
                  onChange={(e) => {
                    setCityQuery(e.target.value);
                    tableState.setCurrentPage(1);
                  }}
                />
              </div>
              <div className="input-group input-group-sm" style={{ width: '220px' }}>
                <span className="input-group-text bg-white border-end-0" style={{ border: '1px solid var(--ss-border)' }}>
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input 
                  type="text" 
                  className="form-control border-start-0 ps-0" 
                  placeholder="Search customers on this page..." 
                  style={{ border: '1px solid var(--ss-border)', borderRadius: '0 8px 8px 0' }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="p-4">
            <DataTable 
              columns={columns} 
              data={filteredCustomers} 
            />
            <PaginationBar 
              currentPage={tableState.currentPage} 
              totalPages={tableState.totalPages} 
              onPageChange={tableState.setCurrentPage} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerListPage;
