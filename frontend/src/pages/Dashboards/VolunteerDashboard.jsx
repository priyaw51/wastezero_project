import React from 'react';
import { Link } from 'react-router-dom';

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
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold dark:text-gray-100">Top Match Suggestions</h2>
                    <Link to="/matches" className="text-sm text-green-600 hover:text-green-700 font-semibold">
                        View Match Dashboard &rarr;
                    </Link>
                </div>
                <p className="text-gray-600 dark:text-gray-400 border-l-4 border-green-500 pl-4 py-2 bg-green-50/50 dark:bg-gray-700/50 rounded-r-md">
                    Check out your personalized Match Dashboard to see which NGOs are looking for your exact skills!
                </p>
            </div>
        </div>
    );
};

export default VolunteerDashboard;
