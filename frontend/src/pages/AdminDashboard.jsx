


import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import DashboardCard from "../components/DashboardCard";
import AdminTable from "../components/AdminTable";
import "../styles/dashboard.css";

function AdminDashboard() {

  const [requests, setRequests] = useState([]);

  const ngos = ["Green Earth NGO", "Clean City NGO"];

  useEffect(() => {
    const storedRequests =
      JSON.parse(localStorage.getItem("pickupRequests")) || [];
    setRequests(storedRequests);
  }, []);

  const assignNgo = (id, ngoName) => {
    const updatedRequests = requests.map((req) =>
      req.id === id
        ? { ...req, status: "Assigned", assignedTo: ngoName }
        : req
    );

    setRequests(updatedRequests);

    localStorage.setItem(
      "pickupRequests",
      JSON.stringify(updatedRequests)
    );
  };




  return (
    <div className="dashboard-container">
      <Sidebar role="admin" />


      <div className="main-content">
        <Navbar />

        <div className="card-container">
          <DashboardCard title="Total Users" value="120" />
          <DashboardCard title="Total Pickups" value="45" />
          <DashboardCard title="Total NGOs" value="8" />
        </div>

        <AdminTable
          requests={requests}
          ngos={ngos}
          assignNgo={assignNgo}
        />

      </div>
    </div>
  );
}

export default AdminDashboard;

