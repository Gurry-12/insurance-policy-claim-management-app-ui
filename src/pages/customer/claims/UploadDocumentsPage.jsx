import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import { uploadDocuments } from "../../../services/claimService";
import PageHeader from "../../../components/common/PageHeader";
import { UploadCloud, ArrowLeft, Upload } from "lucide-react";

const UploadDocumentsPage = () => {
  const { claimId } = useParams();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const [errors, setErrors] = useState({});

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
    if (errors.files) {
      setErrors(prev => ({ ...prev, files: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};

    if (files.length === 0) {
      errs.files = "Please select files to upload";
    }

    // Check file sizes
    const maxFileSize = 10 * 1024 * 1024; // 10 MB
    for (let i = 0; i < files.length; i++) {
      if (files[i].size > maxFileSize) {
        errs.files = "Each document must not exceed 10 MB in size.";
        break;
      }
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    try {
      setIsUploading(true);
      await uploadDocuments(claimId, files);
      toast.success("Documents Uploaded Successfully");
      navigate("/customer/claims");
    } catch (error) {
      console.error(error);
      const errorMessage = error?.response?.data?.message || "Failed to upload documents";
      toast.error(errorMessage);
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
                  <label className="form-label fw-medium">Select Files <span className="text-danger">*</span></label>
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg, image/png, application/pdf"
                    className={`form-control ${errors.files ? 'is-invalid' : ''}`}
                    onChange={handleFileChange}
                  />
                  {errors.files ? (
                    <div className="invalid-feedback">{errors.files}</div>
                  ) : (
                    <div className="form-text">Supported formats: PDF, JPG, PNG</div>
                  )}
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