import { Routes, Route } from "react-router-dom";
import UserDashboard from "../pages/UserDashboard";
import NgoDashboard from "../pages/NgoDashboard";
import AdminDashboard from "../pages/AdminDashboard";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/user-dashboard" element={<UserDashboard />} />
      <Route path="/ngo-dashboard" element={<NgoDashboard />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
    </Routes>
  );
};

export default AppRoutes;
