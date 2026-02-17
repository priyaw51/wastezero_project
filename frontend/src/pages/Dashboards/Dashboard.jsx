import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import AdminDashboard from "./AdminDashboard";
import VolunteerDashboard from "./VolunteerDashboard";
import NgoDashboard from "./NgoDashboard";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

function Dashboard() {
    const { user } = useAuth();
    const { isDarkMode } = useTheme();

    const renderDashboardContent = () => {
        if (!user) return <div>Loading...</div>;

        switch (user?.role) {
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
                        <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
                        <p className="text-lg">Welcome, <span className="font-semibold">{user?.name}</span>!</p>
                        <div className="mt-6 bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold mb-2">My Activity</h3>
                            <p className="text-gray-500">You have no recent activity to show.</p>
                        </div>
                    </div>
                );
        }
    };

    // Wait until user is loaded to render layout properly
    if (!user) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    return (
        <div className={`flex h-screen w-full transition-colors duration-200 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
            {/* Sidebar - Fixed width */}
            <Sidebar />

            {/* Main Content Area - Takes remaining width and scrolls */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Navbar */}
                <Navbar />

                {/* Scrollable Content */}
                <main className="flex-1 overflow-y-auto p-4">
                    {renderDashboardContent()}
                </main>
            </div>
        </div>
    );
}

export default Dashboard;
