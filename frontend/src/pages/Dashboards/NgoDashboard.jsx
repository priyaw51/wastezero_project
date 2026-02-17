import React from 'react';

const NgoDashboard = () => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">NGO Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow dark:shadow-none dark:border dark:border-gray-700">
                    <h3 className="font-semibold text-lg dark:text-gray-200">Donations Received</h3>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">₹ 50,000</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow dark:shadow-none dark:border dark:border-gray-700">
                    <h3 className="font-semibold text-lg dark:text-gray-200">Active Drives</h3>
                    <p className="text-3xl font-bold text-orange-500 dark:text-orange-400">3</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow dark:shadow-none dark:border dark:border-gray-700">
                    <h3 className="font-semibold text-lg dark:text-gray-200">Volunteers Engaged</h3>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">150</p>
                </div>
            </div>

            <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow dark:shadow-none dark:border dark:border-gray-700">
                <h2 className="text-xl font-bold mb-4 dark:text-gray-100">Recent Activities</h2>
                <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                    <li>Community Cleanup Drive - Sector 45</li>
                    <li>Waste Segregation Workshop</li>
                    <li>Food Donation Distribution</li>
                </ul>
            </div>
        </div>
    );
};

export default NgoDashboard;
