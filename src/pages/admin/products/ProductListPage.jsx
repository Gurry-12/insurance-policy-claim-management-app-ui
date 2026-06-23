import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageHeader from '../../../components/common/PageHeader';
import DataTable from '../../../components/tables/DataTable';
import PaginationBar from '../../../components/tables/PaginationBar';
import StatusBadge from '../../../components/ui/StatusBadge';
import ErrorAlert from '../../../components/ui/ErrorAlert';
import { getAllProductsPaginated } from '../../../services/productService';
import usePagination from '../../../hooks/usePagination';

const ProductListPage = () => {
  const navigate = useNavigate();
  const { currentPage, totalPages, setTotalPages, setCurrentPage, pageParams, pageSize } = usePagination(1, 10);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
 
  const columns = [
    { 
      header: "#", 
      cell: (row, index) => (currentPage - 1) * pageSize + index + 1, 
      minWidth: "60px" 
    },
    { header: "Name", accessor: "productName" },
    { header: "Category", accessor: "productType" },
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

  const fetchProducts = () => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    getAllProductsPaginated(pageParams)
      .then((res) => {
        setProducts(res.content);
        setTotalPages(res.totalPages);
      })
      .catch(() => setError('Could not load products. Please check your API connection.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  return (
    <div>
      <PageHeader 
        title="Insurance Products" 
        subtitle="Manage product categories and offerings"
        action={
          <Link to="/admin/products/create" className="btn btn-primary d-flex align-items-center gap-2" style={{ borderRadius: '8px' }}>
            <i className="bi bi-plus-lg"></i>
            Create Product
          </Link>
        }
      />
      
      <ErrorAlert message={error} />
      
      <div className="card border-0" style={{ borderRadius: 16, boxShadow: 'var(--ss-shadow)' }}>
        <div className="card-body p-0">
          <div className="p-4 border-bottom border-light d-flex justify-content-between align-items-center">
            <h6 className="m-0 fw-bold">All Products</h6>
          </div>
          <div className="p-4">
            <DataTable 
              columns={columns} 
              data={products} 
              loading={loading}
              onRowClick={(row) => navigate(`/admin/products/${row.productId}`)}
            />
            <PaginationBar 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={setCurrentPage} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;
