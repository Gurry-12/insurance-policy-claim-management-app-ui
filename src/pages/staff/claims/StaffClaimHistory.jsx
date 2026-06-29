import { useEffect, useState } from "react";
import { getClaimHistory } from "../../../services/claimService";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../../components/common/PageHeader";
import StatusBadge from "../../../components/ui/StatusBadge";

const StaffClaimHistory = () => {
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const loadClaimHistory = async () => {
      try {
        const data = await getClaimHistory(id);
        setHistoryList(data?.content || data?.data || (Array.isArray(data) ? data : []));
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
        title="Claim Status History"
        subtitle="Historical logs of claim adjustments and statuses"
        action={
          <button className="btn btn-secondary d-flex align-items-center gap-1" onClick={() => navigate(`/Staff/claims/${id}`)}>
            <i className="bi bi-arrow-left"></i> Back
          </button>
        }
      />

      {historyList.length === 0 ? (
        <div className="alert alert-info" style={{ borderRadius: 12 }}>
          No claim history available.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>Sr. No.</th>
                <th>Previous Status</th>
                <th>New Status</th>
                <th>Remarks</th>
                <th>Updated By</th>
                <th>Updated Date</th>
              </tr>
            </thead>

            <tbody>
              {historyList.map((history, index) => (
                <tr key={history.historyId}>
                  <td style={{ fontWeight: 600 }}>{index + 1}</td>
                  <td>
                    <StatusBadge status={history.previousStatus} />
                  </td>
                  <td>
                    <StatusBadge status={history.newStatus} />
                  </td>
                  <td>{history.remarks || "-"}</td>
                  <td style={{ fontWeight: 500 }}>{history.updatedBy}</td>
                  <td style={{ color: 'var(--ss-text-muted)' }}>
                    {new Date(history.updatedDate).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StaffClaimHistory;
