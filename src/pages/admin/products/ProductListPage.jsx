import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageHeader from '../../../components/common/PageHeader';
import DataTable from '../../../components/tables/DataTable';
import PaginationBar from '../../../components/tables/PaginationBar';
import StatusBadge from '../../../components/ui/StatusBadge';
import ErrorAlert from '../../../components/ui/ErrorAlert';
import { getAllProductsPaginated } from '../../../services/productService';
import useTableState from '../../../hooks/useTableState';
import SortableHeader from '../../../components/tables/SortableHeader';
import useSearch from '../../../hooks/useSearch';
import ExportButton from '../../../components/common/ExportButton';

const ProductListPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const tableState = useTableState({
    initialSortBy: 'id',
    initialFilters: { statusFilter: 'ALL', productTypeFilter: 'ALL' }
  });

  const fetchProducts = () => {
    setLoading(true);
    const params = tableState.getQueryParams();
    
    if (tableState.filters.statusFilter !== 'ALL') {
      params.isActive = tableState.filters.statusFilter === 'ACTIVE';
    }
    delete params.statusFilter;

    if (tableState.filters.productTypeFilter !== 'ALL') {
      params.productType = tableState.filters.productTypeFilter;
    }
    delete params.productTypeFilter;

    getAllProductsPaginated(params)
      .then((res) => {
        setProducts(res.content);
        tableState.setTotalPages(res.totalPages);
        tableState.setTotalElements(res.totalElements || res.totalRecords || 0);
      })
      .catch(() => setError('Could not load products. Please check your API connection.'))
      .finally(() => setLoading(false));
  };

  const { searchTerm, setSearchTerm, filteredData: filteredProducts } = useSearch(products || [], [
    "productName",
    "productType"
  ]);

  useEffect(() => {
    fetchProducts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    tableState.currentPage, 
    tableState.filters.statusFilter, 
    tableState.filters.productTypeFilter,
    tableState.sortBy, 
    tableState.sortDirection
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
      minWidth: "85px" 
    },
    { header: renderHeader("Name", "productName"), accessor: "productName" },
    { header: renderHeader("Category", "productType"), accessor: "productType" },
    { header: "Created", accessor: "createdDate" },
    {
      header: "Status",
      cell: (row) => row.active ? <StatusBadge status={"Active"}/> : <StatusBadge status={"InActive"}/>,
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm btn-light text-primary border-0"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin/products/${row.productId}`);
            }}
            title="View Details"
          >
            <i className="bi bi-eye"></i>
          </button>
          <button
            className="btn btn-sm btn-light text-primary border-0"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin/products/edit/${row.productId}`);
            }}
            title="Edit Product"
          >
            <i className="bi bi-pencil-square"></i>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Insurance Products"
        subtitle="Manage product categories and offerings"
        action={
          <div className="d-flex gap-2">
            <ExportButton
              data={products || []}
              columns={[
                { header: "Product Name", accessor: "productName" },
                { header: "Product Type", accessor: "productType" },
                { header: "Active Status", exportValue: (r) => r.isActive ? "Active" : "Inactive" }
              ]}
              filename="products_list.csv"
            />
            <Link
              to="/admin/products/create"
              className="btn btn-primary d-flex align-items-center gap-2"
              style={{ borderRadius: "8px" }}
            >
              <i className="bi bi-plus-lg"></i>
              Create Product
            </Link>
          </div>
        }
      />

      <ErrorAlert message={error} />

      <div
        className="card border-0"
        style={{ borderRadius: 16, boxShadow: "var(--ip-shadow-md)" }}
      >
        <div className="card-body p-0">
          <div className="p-4 border-bottom border-light d-flex justify-content-between align-items-center flex-wrap gap-3">
            <h6 className="m-0 fw-bold">All Products</h6>
            <div className="d-flex gap-2 flex-wrap">
              <select
                className="form-select form-select-sm"
                style={{
                  width: "160px",
                  borderRadius: "8px",
                  border: "1px solid var(--ip-border)",
                }}
                value={tableState.filters.statusFilter}
                onChange={(e) =>
                  tableState.handleFilterChange({
                    statusFilter: e.target.value,
                  })
                }
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
              <select
                className="form-select form-select-sm"
                style={{
                  width: "160px",
                  borderRadius: "8px",
                  border: "1px solid var(--ip-border)",
                }}
                value={tableState.filters.productTypeFilter}
                onChange={(e) =>
                  tableState.handleFilterChange({
                    productTypeFilter: e.target.value,
                  })
                }
              >
                <option value="ALL">All Categories</option>
                <option value="HEALTH">Health</option>
                <option value="MOTOR">Motor</option>
                <option value="LIFE">Life</option>
                <option value="TRAVEL">Travel</option>
                <option value="INSURANCE">Insurance</option>
              </select>
              <div
                className="input-group input-group-sm"
                style={{ width: "220px" }}
              >
                <span
                  className="input-group-text bg-white border-end-0"
                  style={{ border: "1px solid var(--ip-border)" }}
                >
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0"
                  placeholder="Search products on this page..."
                  style={{
                    border: "1px solid var(--ip-border)",
                    borderRadius: "0 8px 8px 0",
                  }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="p-4">
            <DataTable
              columns={columns}
              data={filteredProducts}
              loading={loading}
              onRowClick={(row) => navigate(`/admin/products/${row.productId}`)}
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

export default ProductListPage;
