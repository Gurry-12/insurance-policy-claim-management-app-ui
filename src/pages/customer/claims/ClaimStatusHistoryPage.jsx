import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getClaimHistory } from "../../../services/claimService";
import PageHeader from "../../../components/common/PageHeader";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import StatusBadge from "../../../components/ui/StatusBadge";
import { ArrowLeft, Clock } from "lucide-react";
import DataTable from "../../../components/tables/DataTable";

const ClaimStatusHistoryPage = () => {
  const { claimId } = useParams();
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      const response = await getClaimHistory(claimId);
      const rawData = response?.content || response?.data || (Array.isArray(response) ? response : []);
      const sortedData = [...rawData].sort((a, b) => new Date(b.updatedDate) - new Date(a.updatedDate));
      setHistory(sortedData);
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

  const columns = [
    {
      header: "Status",
      cell: (row) => <StatusBadge status={row.newStatus || row.status} />,
    },
    { header: "Updated By", cell: (row) => row.updatedBy || "System" },
    {
      header: "Date",
      cell: (row) => new Date(row.updatedDate).toLocaleString(),
    },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Claim History"
        subtitle="Track the status updates of your claim"
        action={
          <Link to="/customer/claims" className="btn btn-outline-secondary">
            <ArrowLeft size={18} className="me-2" />
            Back to Claims
          </Link>
        }
      />

      <div className="card border-0 shadow-sm" style={{ borderRadius: 16 }}>
        <div className="card-body p-0">
          <div className="p-4 border-bottom border-light">
            <h6 className="mb-0 fw-bold text-primary">History Timeline</h6>
          </div>
          <div className="p-4">
            <DataTable
              columns={columns}
              data={history}
              loading={isLoading}
              emptyMessage="No history found"
              emptyIcon={<Clock size={48} className="mb-3 text-secondary opacity-50" />}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimStatusHistoryPage;