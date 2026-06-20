// import { useEffect, useState } from "react";
// import { getProfile } from "../../../services/customerService";

// const ProfilePage = () => {

//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   const fetchProfile = async () => {
//     try {
//       const response = await getProfile();

//       console.log(response);

//       setProfile(response.data);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return <h4>Loading Profile...</h4>;
//   }

//   if (!profile) {
//     return <h4>No Profile Found</h4>;
//   }

//   return (
//     <div className="container mt-4">

//       <h2>My Profile</h2>

//       <table className="table table-bordered mt-3">

//         <tbody>

//           <tr>
//             <th>Customer ID</th>
//             <td>{profile.customerId}</td>
//           </tr>

//           <tr>
//             <th>Full Name</th>
//             <td>{profile.fullName}</td>
//           </tr>

//           <tr>
//             <th>Email</th>
//             <td>{profile.email}</td>
//           </tr>

//           <tr>
//             <th>Mobile Number</th>
//             <td>{profile.mobileNumber}</td>
//           </tr>

//           <tr>
//             <th>Date Of Birth</th>
//             <td>{profile.dateOfBirth}</td>
//           </tr>

//           <tr>
//             <th>Address</th>
//             <td>{profile.address}</td>
//           </tr>

//           <tr>
//             <th>City</th>
//             <td>{profile.city}</td>
//           </tr>

//           <tr>
//             <th>State</th>
//             <td>{profile.state}</td>
//           </tr>

//           <tr>
//             <th>Pin Code</th>
//             <td>{profile.pinCode}</td>
//           </tr>

//           <tr>
//             <th>Nominee Name</th>
//             <td>{profile.nomineeName}</td>
//           </tr>

//           <tr>
//             <th>Nominee Relation</th>
//             <td>{profile.nomineeRelation}</td>
//           </tr>

//         </tbody>

//       </table>

//     </div>
//   );
// };

// export default ProfilePage;

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProfile } from "../../../services/customerService";
import CustomerProfilePage from "./CustomerProfilePage";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileExists, setProfileExists] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await getProfile();

      setProfile(response.data);
      setProfileExists(true);
    } catch (error) {
      setProfileExists(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <h4>Loading...</h4>;

  if (!profileExists) {
    return (
      <div className="container mt-4">
        <h3>No Profile Found</h3>

        <Link
          to="/customer/profile/edit"
          className="btn btn-primary mt-3"
        >
          Create Profile
        </Link>
      </div>
    );
  }

  return <CustomerProfilePage profile={profile} />;
};

export default ProfilePage;