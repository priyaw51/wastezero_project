// function Navbar() {
//   return (
//     <div className="navbar">
//       <h3>Welcome, User</h3>
//     </div>
//   );
// }

// export default Navbar;





//Navbar Update
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove stored data
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    // Redirect to login
    navigate("/login");
  };

  return (
    <div className="navbar">
      <h3>Welcome</h3>
      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
    </div>
  );
}

export default Navbar;
