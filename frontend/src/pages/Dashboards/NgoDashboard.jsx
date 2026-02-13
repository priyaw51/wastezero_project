import React from 'react';

const NgoDashboard = () => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">NGO Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="font-semibold text-lg">Donations Received</h3>
                    <p className="text-3xl font-bold text-green-600">₹ 50,000</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="font-semibold text-lg">Active Drives</h3>
                    <p className="text-3xl font-bold text-orange-500">3</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="font-semibold text-lg">Volunteers Engaged</h3>
                    <p className="text-3xl font-bold text-blue-600">150</p>
                </div>
            </div>

            <div className="mt-8 bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">Recent Activities</h2>
                <ul className="list-disc pl-5 text-gray-700">
                    <li>Community Cleanup Drive - Sector 45</li>
                    <li>Waste Segregation Workshop</li>
                    <li>Food Donation Distribution</li>
                </ul>
            </div>
        </div>
    );
};

export default NgoDashboard;
