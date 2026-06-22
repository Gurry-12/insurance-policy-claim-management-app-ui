import { Link } from "react-router-dom";

const CustomerProfilePage = ({ profile }) => {
  return (
    <div className="container mt-4">

      <div className="card">
        <div className="card-header">
          <h3>My Profile</h3>
        </div>

        <div className="card-body">

          <p><strong>Customer Id:</strong> {profile.customerId}</p>
          <p><strong>Name:</strong> {profile.fullName}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Mobile:</strong> {profile.mobileNumber}</p>
          <p><strong>DOB:</strong> {profile.dateOfBirth}</p>
          <p><strong>Address:</strong> {profile.address}</p>
          <p><strong>City:</strong> {profile.city}</p>
          <p><strong>State:</strong> {profile.state}</p>
          <p><strong>Pin Code:</strong> {profile.pinCode}</p>
          <p><strong>Nominee Name:</strong> {profile.nomineeName}</p>
          <p><strong>Nominee Relation:</strong> {profile.nomineeRelation}</p>

          <Link
            to="/customer/profile/edit"
            state={{ profile }}
            className="btn btn-warning mt-3"
          >
            Update Profile
          </Link>

        </div>
      </div>

    </div>
  );
};

export default CustomerProfilePage;