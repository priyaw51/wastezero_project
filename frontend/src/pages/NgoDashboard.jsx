// const NgoDashboard = () => {
//   return <h2>NGO Dashboard Working </h2>;
// };
// export default NgoDashboard;





// import Sidebar from "../components/Sidebar";
// import Navbar from "../components/Navbar";
// import DashboardCard from "../components/DashboardCard";
// import "../styles/dashboard.css";

// function NgoDashboard() {
//   return (
//     <div className="dashboard-container">
//       <Sidebar />
//       <div className="main-content">
//         <Navbar />
//         <div className="card-container">
//           <DashboardCard title="New Pickup Requests" value="10" />
//           <DashboardCard title="Accepted Requests" value="6" />
//           <DashboardCard title="Completed Pickups" value="20" />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default NgoDashboard;








import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../styles/dashboard.css";

function NgoDashboard() {
  const [requests, setRequests] = useState([]);


  const updateStatus = (id, newStatus) => {
    const updatedRequests = requests.map((req) =>
      req.id === id ? { ...req, status: newStatus } : req
    );

    setRequests(updatedRequests);

    localStorage.setItem(
      "pickupRequests",
      JSON.stringify(updatedRequests)
    );
  };



  useEffect(() => {
    const storedRequests =
      JSON.parse(localStorage.getItem("pickupRequests")) || [];

    const assignedRequests = storedRequests.filter(
      (req) => req.status === "Assigned"
    );

    setRequests(assignedRequests);
  }, []);


  return (
    <div className="dashboard-container">
      <Sidebar role="ngo" />


      <div className="main-content">
        <Navbar />

        <div className="table-container">
          <h3>Incoming Pickup Requests</h3>

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Waste Type</th>
                <th>Address</th>
                <th>Status</th>
              </tr>
            </thead>
            {/* <tbody>
              {requests.map((req) => (
                <tr key={req.id}>
                  <td>{req.id}</td>
                  <td>{req.wasteType}</td>
                  <td>{req.address}</td>
                  <td>
                    <span className="status pending">
                      {req.status}
                    </span>
                  </td>
                </tr>
              ))}

              {requests.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    No requests available
                  </td>
                </tr>
              )}
            </tbody> */}

            <tbody>
              {requests.map((req) => (
                <tr key={req.id}>
                  <td>{req.id}</td>
                  <td>{req.wasteType}</td>
                  <td>{req.address}</td>
                  <td>
                    <span className={`status ${req.status.toLowerCase()}`}>
                      {req.status}
                    </span>
                  </td>

                  <td>
                    {req.status === "Pending" && (
                      <>
                        <button
                          className="accept-btn"
                          onClick={() => updateStatus(req.id, "Accepted")}
                        >
                          Accept
                        </button>

                        <button
                          className="reject-btn"
                          onClick={() => updateStatus(req.id, "Rejected")}
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>


          </table>
        </div>
      </div>
    </div>
  );
}

export default NgoDashboard;

