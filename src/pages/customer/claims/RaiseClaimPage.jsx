import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { raiseClaim } from "../../../services/claimService";

const RaiseClaimPage = () => {
  const navigate = useNavigate();

  const [claim, setClaim] = useState({
    policyId: "",
    claimAmount: "",
    claimReason: "",
    incidentDate: "",
  });

  const [files, setFiles] = useState([]);

  const handleChange = (e) => {
    setClaim({
      ...claim,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !claim.policyId ||
      !claim.claimAmount ||
      !claim.claimReason ||
      !claim.incidentDate
    ) {
      alert("All fields are required");
      return;
    }

    if (files.length === 0) {
      alert("Upload at least one document");
      return;
    }

    try {
      const formData = new FormData();

      const claimBlob = new Blob(
        [JSON.stringify(claim)],
        {
          type: "application/json",
        }
      );

      formData.append("claim", claimBlob);

      files.forEach((file) => {
        formData.append("files", file);
      });

      await raiseClaim(formData);

      alert("Claim Raised Successfully");

      navigate("/customer/claims");
    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          "Unable to raise claim"
      );
    }
  };

  return (
    <div className="container mt-4">
      <h3>Raise Claim</h3>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Policy Id</label>

          <input
            type="number"
            className="form-control"
            name="policyId"
            value={claim.policyId}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Claim Amount</label>

          <input
            type="number"
            className="form-control"
            name="claimAmount"
            value={claim.claimAmount}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Incident Date</label>

          <input
            type="date"
            className="form-control"
            name="incidentDate"
            value={claim.incidentDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Claim Reason</label>

          <textarea
            className="form-control"
            rows="4"
            name="claimReason"
            value={claim.claimReason}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Documents</label>

          <input
            type="file"
            multiple
            className="form-control"
            onChange={(e) =>
              setFiles([...e.target.files])
            }
            required
          />
        </div>

        <button className="btn btn-primary">
          Raise Claim
        </button>
      </form>
    </div>
  );
};

export default RaiseClaimPage;