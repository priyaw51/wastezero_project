import React from 'react';

const AdminDashboard = () => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="font-semibold text-lg">Total Users</h3>
                    <p className="text-3xl font-bold text-green-600">1,245</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="font-semibold text-lg">Pending Approvals</h3>
                    <p className="text-3xl font-bold text-orange-500">23</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="font-semibold text-lg">Total Pickups</h3>
                    <p className="text-3xl font-bold text-blue-600">8,902</p>
                </div>
            </div>
            {/* Add more admin specific content here */}
        </div>
    );
};

export default AdminDashboard;
