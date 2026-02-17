import React from 'react';

const AdminDashboard = () => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow dark:shadow-none dark:border dark:border-gray-700">
                    <h3 className="font-semibold text-lg dark:text-gray-200">Total Users</h3>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">1,245</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow dark:shadow-none dark:border dark:border-gray-700">
                    <h3 className="font-semibold text-lg dark:text-gray-200">Pending Approvals</h3>
                    <p className="text-3xl font-bold text-orange-500 dark:text-orange-400">23</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow dark:shadow-none dark:border dark:border-gray-700">
                    <h3 className="font-semibold text-lg dark:text-gray-200">Total Pickups</h3>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">8,902</p>
                </div>
            </div>
            {/* Add more admin specific content here */}
        </div>
    );
};

export default AdminDashboard;
