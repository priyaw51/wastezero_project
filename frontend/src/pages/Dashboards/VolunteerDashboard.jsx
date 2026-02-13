import React from 'react';

const VolunteerDashboard = () => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Volunteer Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="font-semibold text-lg">My Pickups</h3>
                    <p className="text-3xl font-bold text-green-600">45</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="font-semibold text-lg">Hours Contributed</h3>
                    <p className="text-3xl font-bold text-blue-500">120</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="font-semibold text-lg">Impact Score</h3>
                    <p className="text-3xl font-bold text-purple-600">850</p>
                </div>
            </div>

            <div className="mt-8 bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">Available Opportunities</h2>
                <p className="text-gray-600">No new opportunities nearby at the moment.</p>
            </div>
        </div>
    );
};

export default VolunteerDashboard;
