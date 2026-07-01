import { useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import { uploadDocuments } from "../../../services/claimService";
import PageHeader from "../../../components/common/PageHeader";
import { ArrowLeft, Upload } from "lucide-react";
import LoadingButton from "../../../components/ui/LoadingButton";

const UploadDocumentsPage = () => {
  const { claimId } = useParams();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const [errors, setErrors] = useState({});

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles(Array.from(e.dataTransfer.files));
      if (errors.files) {
        setErrors(prev => ({ ...prev, files: '' }));
      }
    }
  };

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
                  <label className="form-label fw-bold mb-2">Select Files <span className="text-danger">*</span></label>
                  <div
                    className={`p-5 text-center border rounded-3 ${isDragging ? 'bg-light border-primary' : 'bg-white'} ${errors.files ? 'border-danger' : 'border-secondary'}`}
                    style={{ borderStyle: 'dashed', borderWidth: '2px', cursor: 'pointer', transition: 'all 0.2s' }}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current.click()}
                  >
                    <Upload size={32} className="text-muted mb-3" />
                    <h6 className="fw-bold">Drag and drop files here</h6>
                    <p className="text-muted small mb-0">or click to browse from your computer</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/jpeg, image/png, application/pdf"
                      className="d-none"
                      onChange={handleFileChange}
                    />
                  </div>
                  {files.length > 0 && (
                    <div className="mt-3">
                      <small className="fw-bold d-block mb-2">Selected files:</small>
                      <ul className="list-unstyled mb-0">
                        {files.map((f, i) => (
                          <li key={i} className="small d-flex align-items-center gap-2 mb-1 text-primary">
                            <i className="bi bi-file-earmark-check"></i> {f.name} ({(f.size / 1024 / 1024).toFixed(2)} MB)
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {errors.files && <div className="text-danger small mt-2">{errors.files}</div>}
                  {!errors.files && files.length === 0 && <div className="form-text mt-2">Supported formats: PDF, JPG, PNG</div>}
                </div>

                <div className="d-grid">
                  <LoadingButton
                    className="w-100 py-2 fw-bold"
                    type="submit"
                    isLoading={isUploading}
                    loadingText="Uploading..."
                    disabled={files.length === 0}
                  >
                    <Upload size={18} className="me-2" />
                    Upload
                  </LoadingButton>
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