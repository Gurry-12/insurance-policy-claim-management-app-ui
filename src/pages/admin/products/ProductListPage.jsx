import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageHeader from '../../../components/common/PageHeader';
import DataTable from '../../../components/tables/DataTable';
import PaginationBar from '../../../components/tables/PaginationBar';
import StatusBadge from '../../../components/ui/StatusBadge';
import ConfirmModal from '../../../components/modals/ConfirmModal';
import ErrorAlert from '../../../components/ui/ErrorAlert';
import { activateProduct, deactivateProduct, getAllProductsPaginated } from '../../../services/productService';

const ProductListPage = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusModal, setStatusModal] = useState({ isOpen: false, productId: null, currentStatus: false });

  const columns = [
    { header: "Product ID", accessor: "productId", minWidth: "100px" },
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
              navigate(`/admin/products/edit/${row.productId}`);
            }}
            title="Edit Product"
          >
            <i className="bi bi-pencil-square"></i>
          </button>
          {row.active ? (
            <button
              className="btn btn-sm btn-light text-warning border-0"
              onClick={(e) => {
                e.stopPropagation();
                setStatusModal({
                  isOpen: true,
                  productId: row.productId,
                  currentStatus: true,
                });
              }}
              title="Deactivate Product"
            >
              <i className="bi bi-dash-circle"></i>
            </button>
          ) : (
            <button
              className="btn btn-sm btn-light text-success border-0"
              onClick={(e) => {
                e.stopPropagation();
                setStatusModal({
                  isOpen: true,
                  productId: row.productId,
                  currentStatus: false,
                });
              }}
              title="Activate Product"
            >
              <i className="bi bi-check-circle"></i>
            </button>
          )}
        </div>
      ),
    },
  ];

  const fetchProducts = () => {
    setLoading(true);
    getAllProductsPaginated()
      .then(setProducts)
      .catch(() => setError('Could not load products. Please check your API connection.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts();
  }, []);

  const handleStatusToggle = () => {
    const { productId, currentStatus } = statusModal;
    const action = currentStatus ? deactivateProduct(productId) : activateProduct(productId);
    
    setLoading(true);
    setStatusModal({ isOpen: false, productId: null, currentStatus: false });
    
    action
      .then(() => {
        alert(`Product ${currentStatus ? 'deactivated' : 'activated'} successfully!`);
        fetchProducts();
      })
      .catch(() => {
        alert(`Failed to ${currentStatus ? 'deactivate' : 'activate'} product.`);
        setLoading(false);
      });
  };

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
            />
            <PaginationBar 
              currentPage={currentPage} 
              totalPages={1} 
              onPageChange={setCurrentPage} 
            />
          </div>
        </div>
      </div>

      <ConfirmModal 
        isOpen={statusModal.isOpen}
        title={statusModal.currentStatus ? "Deactivate Product" : "Activate Product"}
        message={statusModal.currentStatus 
          ? "Are you sure you want to deactivate this product? This will make the product category unavailable." 
          : "Are you sure you want to activate this product?"}
        isDanger={statusModal.currentStatus}
        confirmText={statusModal.currentStatus ? "Deactivate" : "Activate"}
        onCancel={() => setStatusModal({ isOpen: false, productId: null, currentStatus: false })}
        onConfirm={handleStatusToggle}
      />
    </div>
  );
};

export default ProductListPage;
