import { Link } from "react-router-dom";
import PageHeader from "../../../components/common/PageHeader";

const CustomerProfilePage = ({ profile }) => {
  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="My Profile" 
        subtitle="Manage your personal information and account details"
      />

      <div className="row justify-content-center mt-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-5">
              <div className="text-center mb-5">
                <div className="avatar-placeholder bg-primary-subtle text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3 fw-bold" style={{ width: '80px', height: '80px', fontSize: '2.5rem' }}>
                  {profile.fullName?.charAt(0).toUpperCase() || 'C'}
                </div>
                <h3 className="mb-1 fw-bold text-dark">{profile.fullName}</h3>
                <p className="text-muted mb-2">{profile.email}</p>
                <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-2">Customer ID: {profile.customerId}</span>
              </div>

              <div className="row g-4 mt-2 border-top pt-4">
                <div className="col-md-6">
                  <div className="d-flex flex-column">
                    <span className="text-muted small mb-1">Mobile Number</span>
                    <span className="fw-medium text-dark">{profile.mobileNumber}</span>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex flex-column">
                    <span className="text-muted small mb-1">Date of Birth</span>
                    <span className="fw-medium text-dark">{profile.dateOfBirth}</span>
                  </div>
                </div>
                <div className="col-12">
                  <div className="d-flex flex-column">
                    <span className="text-muted small mb-1">Address</span>
                    <span className="fw-medium text-dark">{profile.address}, {profile.city}, {profile.state} - {profile.pinCode}</span>
                  </div>
                </div>
                
                <div className="col-12 mt-4">
                  <h6 className="text-uppercase text-muted fw-bold mb-0 border-bottom pb-2">Nominee Information</h6>
                </div>
                
                <div className="col-md-6 mt-3">
                  <div className="d-flex flex-column">
                    <span className="text-muted small mb-1">Nominee Name</span>
                    <span className="fw-medium text-dark">{profile.nomineeName}</span>
                  </div>
                </div>
                <div className="col-md-6 mt-3">
                  <div className="d-flex flex-column">
                    <span className="text-muted small mb-1">Nominee Relation</span>
                    <span className="fw-medium text-dark">{profile.nomineeRelation}</span>
                  </div>
                </div>
              </div>

              <div className="text-center mt-5 pt-4 border-top">
                <Link
                  to="/customer/profile/edit"
                  state={{ profile }}
                  className="btn btn-primary px-4 py-2"
                >
                  <i className="bi bi-pencil me-2"></i>
                  Update Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfilePage;