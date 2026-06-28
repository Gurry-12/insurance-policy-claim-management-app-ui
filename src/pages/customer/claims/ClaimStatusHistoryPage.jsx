import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getClaimHistory } from "../../../services/claimService";
import PageHeader from "../../../components/common/PageHeader";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import StatusBadge from "../../../components/ui/StatusBadge";
import { History, ArrowLeft } from "lucide-react";

const ClaimStatusHistoryPage = () => {
  const { claimId } = useParams();
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      const response = await getClaimHistory(claimId);
      setHistory(response?.content || response?.data || (Array.isArray(response) ? response : []));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  

  if (isLoading) {
    return <LoadingSpinner text="Loading claim history..." />;
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Claim History"
        subtitle="Track the status updates of your claim"
        icon={History}
        action={
          <Link to="/customer/claims" className="btn btn-outline-secondary">
            <ArrowLeft size={18} className="me-2" />
            Back to Claims
          </Link>
        }
      />

      <div className="card border-0 shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Status</th>
                <th>Updated By</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-muted">
                    No history found
                  </td>
                </tr>
              ) : (
                history.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <StatusBadge status={item.newStatus || item.status} />
                    </td>
                    <td>{item.updatedBy || "System"}</td>
                    <td>{new Date(item.updatedDate).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClaimStatusHistoryPage;