// // const UserDashboard = () => {
// //   return <h2>User Dashboard Working </h2>;
// // };
// // export default UserDashboard;




// import { useState } from "react";
// import Sidebar from "../components/Sidebar";
// import Navbar from "../components/Navbar";
// import DashboardCard from "../components/DashboardCard";
// import "../styles/dashboard.css";

// function UserDashboard() {
//   // const [showForm, setShowForm] = useState(false);
//   const [showModal, setShowModal] = useState(false);

//   return (
//     <div className="dashboard-container">
//       <Sidebar />

//       <div className="main-content">
//         <Navbar />

//         <div className="card-container">
//           <DashboardCard title="Total Requests" value="8" />
//           <DashboardCard title="Completed Pickups" value="5" />
//           <DashboardCard title="Pending Requests" value="3" />
//         </div>

//         <div style={{ padding: "20px" }}>
//           <button
//             className="create-btn"
//             onClick={() => setShowModal(true)}
//           >
//             Create Pickup Request
//           </button>
//         </div>

//         {showModal && (
//           <div className="modal-overlay">
//             <div className="modal">
//               <h3>Create Pickup Request</h3>

//               <select className="input-field">
//                 <option value="">Select Waste Type</option>
//                 <option value="Plastic">Plastic</option>
//                 <option value="Organic">Organic</option>
//                 <option value="Metal">Metal</option>
//                 <option value="E-Waste">E-Waste</option>
//               </select>

//               <input
//                 type="text"
//                 placeholder="Pickup Address"
//                 className="input-field"
//               />

//               <div className="modal-buttons">
//                 <button
//                   className="submit-btn"
//                   onClick={() => setShowModal(false)}
//                 >
//                   Submit
//                 </button>

//                 <button
//                   className="cancel-btn"
//                   onClick={() => setShowModal(false)}
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default UserDashboard;
















import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import DashboardCard from "../components/DashboardCard";
import "../styles/dashboard.css";

function UserDashboard() {
  const [showModal, setShowModal] = useState(false);
  const [wasteType, setWasteType] = useState("");
  const [address, setAddress] = useState("");
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const loadRequests = () => {
      const storedRequests =
        JSON.parse(localStorage.getItem("pickupRequests")) || [];
      setRequests(storedRequests);
    };

    loadRequests();

    window.addEventListener("storage", loadRequests);

    return () => {
      window.removeEventListener("storage", loadRequests);
    };
  }, []);







  // const handleSubmit = () => {
  //   if (!wasteType || !address) {
  //     alert("Please fill all fields");
  //     return;
  //   }

  //   const newRequest = {
  //     id: requests.length + 1,
  //     wasteType,
  //     address,
  //     status: "Pending",
  //   };

  //   setRequests([...requests, newRequest]);

  //   setWasteType("");
  //   setAddress("");
  //   setShowModal(false);
  // };









  const handleSubmit = () => {
    if (!wasteType || !address) {
      alert("Please fill all fields");
      return;
    }

    const newRequest = {
      id: Date.now(),
      wasteType,
      address,
      status: "Pending",
    };

    const existingRequests =
      JSON.parse(localStorage.getItem("pickupRequests")) || [];

    const updatedRequests = [...existingRequests, newRequest];

    localStorage.setItem("pickupRequests", JSON.stringify(updatedRequests));

    setRequests(updatedRequests);

    setWasteType("");
    setAddress("");
    setShowModal(false);
  };












  return (
    <div className="dashboard-container">
      <Sidebar role="user" />

      <div className="main-content">
        <Navbar />

        <div className="card-container">
          <DashboardCard title="Total Requests" value={requests.length} />
          <DashboardCard
            title="Pending Requests"
            value={requests.filter(r => r.status === "Pending").length}
          />
        </div>

        <div style={{ padding: "20px" }}>
          <button
            className="create-btn"
            onClick={() => setShowModal(true)}
          >
            Create Pickup Request
          </button>
        </div>

        {/* Request Table */}
        <div className="table-container">
          <h3>My Requests</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Waste Type</th>
                <th>Address</th>
                <th>Status</th>
              </tr>
            </thead>
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

                </tr>
              ))}

              {requests.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    No requests yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Create Pickup Request</h3>

              <select
                className="input-field"
                value={wasteType}
                onChange={(e) => setWasteType(e.target.value)}
              >
                <option value="">Select Waste Type</option>
                <option value="Plastic">Plastic</option>
                <option value="Organic">Organic</option>
                <option value="Metal">Metal</option>
                <option value="E-Waste">E-Waste</option>
                <option value="Other">Other (Type Manually)</option>
              </select>

              {wasteType === "Other" && (
                <input
                  type="text"
                  placeholder="Enter Waste Type"
                  className="input-field"
                  onChange={(e) => setWasteType(e.target.value)}
                />
              )}

              <input
                type="number"
                placeholder="Approx Weight (kg)"
                className="input-field"
              />

              <input
                type="text"
                placeholder="Full Pickup Address"
                className="input-field"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />

              <textarea
                placeholder="Additional Description (optional)"
                className="input-field"
              />

              <div className="modal-buttons">
                <button className="submit-btn" onClick={handleSubmit}>
                  Submit
                </button>

                <button
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default UserDashboard;
