import React from 'react';

const VolunteerDashboard = () => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Volunteer Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow dark:shadow-none dark:border dark:border-gray-700">
                    <h3 className="font-semibold text-lg dark:text-gray-200">My Pickups</h3>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">45</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow dark:shadow-none dark:border dark:border-gray-700">
                    <h3 className="font-semibold text-lg dark:text-gray-200">Hours Contributed</h3>
                    <p className="text-3xl font-bold text-blue-500 dark:text-blue-400">120</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow dark:shadow-none dark:border dark:border-gray-700">
                    <h3 className="font-semibold text-lg dark:text-gray-200">Impact Score</h3>
                    <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">850</p>
                </div>
            </div>

            <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow dark:shadow-none dark:border dark:border-gray-700">
                <h2 className="text-xl font-bold mb-4 dark:text-gray-100">Available Opportunities</h2>
                <p className="text-gray-600 dark:text-gray-400">No new opportunities nearby at the moment.</p>
            </div>
        </div>
    );
};

export default VolunteerDashboard;
