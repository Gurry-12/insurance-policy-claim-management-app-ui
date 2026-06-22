import { useState } from "react";
import { useParams } from "react-router-dom";
import { uploadDocuments } from "../../../services/claimService";

const UploadDocumentsPage = () => {
  const { claimId } = useParams();

  const [files, setFiles] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await uploadDocuments(
        claimId,
        files
      );

      alert("Documents Uploaded Successfully");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Upload Documents</h3>

      <form onSubmit={handleSubmit}>
        <input
          type="file"
          multiple
          className="form-control"
          onChange={(e) =>
            setFiles([...e.target.files])
          }
        />

        <button
          className="btn btn-success mt-3"
          type="submit"
        >
          Upload
        </button>
      </form>
    </div>
  );
};

export default UploadDocumentsPage;