import React from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import NotificationBell from "../../components/NotificationBell";
import AdminDashboard from "./AdminDashboard";
import VolunteerDashboard from "./VolunteerDashboard";
import NgoDashboard from "./NgoDashboard";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

function Dashboard() {
    const { user } = useAuth();
    const { isDarkMode } = useTheme();

    // Loading screen
    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen text-lg font-semibold">
                Loading Dashboard...
            </div>
        );
    }

    const renderDashboardContent = () => {
        switch (user.role) {
            case "admin":
                return <AdminDashboard />;

            case "volunteer":
                return <VolunteerDashboard />;

            case "ngo":
                return <NgoDashboard />;

            case "user":
            default:
                return (
                    <div className="p-6">
                        <h1 className="text-2xl font-bold mb-4">
                            Welcome {user?.name}
                        </h1>

                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold mb-2">
                                User Dashboard
                            </h3>
                            <p className="text-gray-500">
                                You have no recent activity.
                            </p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className={`flex h-screen w-full transition-colors duration-200 ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"}`}>
            
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex flex-col flex-1 overflow-hidden">

                {/* Navbar */}
                <Navbar />

                {/* Notification Bell (Top Right) */}
                <div className="flex justify-end px-6 pt-4">
                    <NotificationBell />
                </div>

                {/* Dashboard Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    {renderDashboardContent()}
                </main>

            </div>
        </div>
    );
}

export default Dashboard;