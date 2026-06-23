import { useEffect, useState } from "react";
import { getClaimHistory } from "../../../services/claimHistoryService";
import { useNavigate } from "react-router-dom";



const AgentClaimHistory = () => {
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
   useEffect(() => {
    
    const loadClaimHistory = async () => {
    try {
      const data = await getClaimHistory();
      setHistoryList(data);
    } catch (error) {
      console.error("Error fetching claim history:", error);
    } finally {
      setLoading(false);
    }
  };

  
    loadClaimHistory();
  }, []);

  if (loading) {
    return (
      <div className="container mt-4">
        <h4>Loading Claim History...</h4>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">Claim Status History</h3>
        </div>

       <div className="d-flex justify-content-end mb-3">
     <button    
        className="btn btn-secondary mb-3"
        onClick={() => navigate("/agent/dashboard")}
      > Back </button>
      </div>
      
        <div className="card-body">
          {historyList.length === 0 ? (
            <div className="alert alert-info">
              No claim history available.
            </div>
          ) : (
            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th>History ID</th>
                  <th>Previous Status</th>
                  <th>New Status</th>
                  <th>Remarks</th>
                  <th>Updated By</th>
                  <th>Updated Date</th>
                </tr>
              </thead>

              <tbody>
                {historyList.map((history) => (
                  <tr key={history.historyId}>
                    <td>{history.historyId}</td>
                    <td>{history.previousStatus}</td>
                    <td>
                      <span
                        className={`badge ${
                          history.newStatus === "APPROVED"
                            ? "bg-success"
                            : history.newStatus === "REJECTED"
                            ? "bg-danger"
                            : "bg-warning text-dark"
                        }`}
                      >
                        {history.newStatus}
                      </span>
                    </td>
                    <td>{history.remarks}</td>
                    <td>{history.updatedBy}</td>
                    <td>
                      {new Date(history.updatedDate).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentClaimHistory;