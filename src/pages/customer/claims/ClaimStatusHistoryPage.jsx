import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getClaimHistory } from "../../../services/claimService";

const ClaimStatusHistoryPage = () => {
  const { claimId } = useParams();

  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await getClaimHistory(claimId);

      setHistory(response.content || []);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Claim History</h3>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Status</th>
            <th>Updated By</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {history.map((item, index) => (
            <tr key={index}>
              <td>{item.status}</td>
              <td>{item.updatedBy}</td>
              <td>{item.updatedDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClaimStatusHistoryPage;