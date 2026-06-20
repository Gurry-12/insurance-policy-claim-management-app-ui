const ProfilePage = () => {
  return (
    <div className="container mt-4">
      <h2>My Profile</h2>

      <table className="table table-bordered">
        <tbody>
          <tr>
            <th>Full Name</th>
            <td>Loading...</td>
          </tr>

          <tr>
            <th>Email</th>
            <td>Loading...</td>
          </tr>

          <tr>
            <th>Address</th>
            <td>Loading...</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ProfilePage;