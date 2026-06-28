import { useEffect, useState } from "react";
import { getMyPolicies } from "../../../services/policyService";
import { Link } from "react-router-dom";
import PageHeader from "../../../components/common/PageHeader";
import StatusBadge from "../../../components/ui/StatusBadge";
import { Shield, CheckCircle, Clock, XCircle, AlertCircle, Eye } from "lucide-react";
import useTableState from "../../../hooks/useTableState";
import PaginationBar from "../../../components/tables/PaginationBar";
import ExportButton from "../../../components/common/ExportButton";

const CustomerPolicyListPage = () => {
  const [policies, setPolicies] = useState([]);

  const tableState = useTableState({
    initialSortBy: 'id'
  });

  const fetchPolicies = async () => {
    try {
      tableState.setIsLoading(true);
      const params = tableState.getQueryParams();
      const response = await getMyPolicies(params);
      setPolicies(response.content || []);
      tableState.setTotalPages(response.totalPages || 1);
      tableState.setTotalElements(response.totalElements || response.totalRecords || 0);
    } catch (error) {
      console.error(error);
    } finally {
      tableState.setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, [tableState.currentPage, tableState.sortBy, tableState.sortDirection]);

  

  const getStatusIcon = (status) => {
    switch (status) {
      case "ACTIVE": return <CheckCircle size={16} className="me-1" />;
      case "PENDING_PAYMENT": return <AlertCircle size={16} className="me-1" />;
      case "EXPIRED": return <Clock size={16} className="me-1" />;
      case "CANCELLED": return <XCircle size={16} className="me-1" />;
      default: return null;
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="My Policies"
        subtitle="Manage your purchased insurance policies"
        icon={Shield}
        action={
          <ExportButton
            data={policies || []}
            columns={[
              { header: "Policy ID", accessor: "policyId" },
              { header: "Policy Number", accessor: "policyNumber" },
              { header: "Plan Name", accessor: "planName" },
              { header: "Premium Amount (₹)", accessor: "premiumAmount" },
              { header: "Coverage Amount (₹)", accessor: "coverageAmount" },
              { header: "Status", accessor: "policyStatus" }
            ]}
            filename="my_policies.csv"
          />
        }
      />

      <div className="card border-0 shadow-sm mt-4">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="px-4 py-3">Policy No</th>
                  <th className="px-4 py-3">Plan Name</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Premium</th>
                  <th className="px-4 py-3">Coverage</th>
                  <th className="px-4 py-3 text-end">Action</th>
                </tr>
              </thead>

              <tbody>
                {policies.length > 0 ? (
                  policies.map((policy) => (
                    <tr key={policy.policyId}>
                      <td className="px-4 py-3 fw-medium text-primary">#{policy.policyNumber}</td>
                      <td className="px-4 py-3 fw-semibold">{policy.planName}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={policy.policyStatus} icon={getStatusIcon(policy.policyStatus)} />
                      </td>
                      <td className="px-4 py-3">₹{policy.premiumAmount?.toLocaleString()}</td>
                      <td className="px-4 py-3">₹{policy.coverageAmount?.toLocaleString()}</td>

                      <td className="px-4 py-3 text-end">
                        <Link
                          to={`/customer/policies/${policy.policyId}`}
                          className="btn btn-light btn-sm text-primary"
                          title="View Details"
                        >
                          <Eye size={16} /> <span className="ms-1">View Details</span>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">
                      <div className="d-flex flex-column align-items-center">
                        <Shield size={48} className="mb-3 text-secondary opacity-50" />
                        <p className="mb-0">No Policies Found</p>
                        <Link to="/customer/products" className="btn btn-primary mt-3">
                          Browse Products
                        </Link>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {policies.length > 0 && (
        <div className="mt-3">
          <PaginationBar
            currentPage={tableState.currentPage}
            totalPages={tableState.totalPages}
            totalElements={tableState.totalElements}
            pageSize={tableState.pageSize}
            onPageChange={tableState.setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default CustomerPolicyListPage;
