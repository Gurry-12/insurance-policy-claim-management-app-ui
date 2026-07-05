import { useEffect, useState } from "react";
import { getClaimHistory } from "../../../services/claimService";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../../components/common/PageHeader";
import StatusBadge from "../../../components/ui/StatusBadge";
import DataTable from "../../../components/tables/DataTable";

const StaffClaimHistory = () => {
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const loadClaimHistory = async () => {
      try {
        setLoading(true);
        const data = await getClaimHistory(id);
        const rawData = data?.content || data?.data || (Array.isArray(data) ? data : []);
        const sortedData = [...rawData].sort((a, b) => new Date(b.updatedDate) - new Date(a.updatedDate));
        setHistoryList(sortedData);
      } catch (error) {
        console.error("Error fetching claim history:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadClaimHistory();
    }
  }, [id]);

  const columns = [
    {
      header: "Sr. No.",
      cell: (row, index) => index + 1,
      minWidth: "85px"
    },
    {
      header: "Previous Status",
      cell: (row) => <StatusBadge status={row.previousStatus} />
    },
    {
      header: "New Status",
      cell: (row) => <StatusBadge status={row.newStatus} />
    },
    { header: "Remarks", accessor: "remarks", cell: (row) => row.remarks || "-" },
    { header: "Updated By", accessor: "updatedBy", cell: (row) => <span className="fw-medium">{row.updatedBy}</span> },
    {
      header: "Updated Date",
      cell: (row) => new Date(row.updatedDate).toLocaleString(),
    }
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Claim Status History"
        subtitle="Historical logs of claim adjustments and statuses"
        action={
          <button
            className="btn btn-secondary d-flex align-items-center gap-1"
            onClick={() => navigate(`/staff/claims/${id}`)}
          >
            <i className="bi bi-arrow-left"></i> Back
          </button>
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
              data={historyList}
              loading={loading}
              emptyMessage="No claim history available."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffClaimHistory;
