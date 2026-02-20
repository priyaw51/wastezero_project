// import "../styles/dashboard.css";

// function Sidebar() {
//   return (
//     <div className="sidebar">
//       <h2>WasteZero</h2>
//       <ul>
//         <li>Dashboard</li>
//         <li>Profile</li>
//         <li>Settings</li>
//       </ul>
//     </div>
//   );
// }

// export default Sidebar;








// UPDATED SIDEBAR
import { Link, useLocation } from "react-router-dom";
import "../styles/dashboard.css";

function Sidebar({ role }) {
  return (
    <div className="sidebar">
      <h2>WasteZero</h2>

      {role === "admin" && (
        <>
          <Link to="/admin">Admin Dashboard</Link>
        </>
      )}

      {role === "user" && (
        <>
          <Link to="/user">User Dashboard</Link>
        </>
      )}

      {role === "ngo" && (
        <>
          <Link to="/ngo">NGO Dashboard</Link>
        </>
      )}
    </div>
  );
}

export default Sidebar;

