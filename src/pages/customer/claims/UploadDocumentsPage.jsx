import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { uploadDocuments } from "../../../services/claimService";
import PageHeader from "../../../components/common/PageHeader";
import { UploadCloud, ArrowLeft, Upload } from "lucide-react";

const UploadDocumentsPage = () => {
  const { claimId } = useParams();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      alert("Please select files to upload");
      return;
    }

    try {
      setIsUploading(true);
      await uploadDocuments(claimId, files);
      alert("Documents Uploaded Successfully");
      navigate("/customer/claims");
    } catch (error) {
      console.error(error);
      alert("Failed to upload documents");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Upload Documents"
        subtitle={`Add documents to claim #${claimId}`}
        icon={UploadCloud}
        action={
          <Link to="/customer/claims" className="btn btn-outline-secondary">
            <ArrowLeft size={18} className="me-2" />
            Back to Claims
          </Link>
        }
      />

      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label fw-medium">Select Files</label>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="form-control"
                    onChange={(e) => setFiles([...e.target.files])}
                  />
                  <div className="form-text">Supported formats: PDF, JPG, PNG</div>
                </div>

                <div className="d-grid">
                  <button
                    className="btn btn-primary d-flex justify-content-center align-items-center"
                    type="submit"
                    disabled={isUploading || files.length === 0}
                  >
                    {isUploading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload size={18} className="me-2" />
                        Upload
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadDocumentsPage;