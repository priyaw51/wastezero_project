import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        users: 0,
        approvals: 0,
        pickups: 0,
    });

    const [users, setUsers] = useState([]);
    const [logs, setLogs] = useState([]);

    // Fetch Stats
    const fetchStats = async () => {
        try {
            const res = await axios.get("/api/admin/stats");
            setStats(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    // Fetch Users
    const fetchUsers = async () => {
        try {
            const res = await axios.get("/api/admin/users");
            setUsers(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    // Fetch Logs
    const fetchLogs = async () => {
        try {
            const res = await axios.get("/api/admin/logs");
            setLogs(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    // Suspend User
    const suspendUser = async (id) => {
        await axios.put(`/api/admin/suspend/${id}`);
        fetchUsers();
    };

    useEffect(() => {
        fetchStats();
        fetchUsers();
        fetchLogs();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

            {/* 🔹 Stats Cards (Same UI, Dynamic Data) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow dark:border dark:border-gray-700">
                    <h3 className="font-semibold text-lg dark:text-gray-200">Total Users</h3>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                        {stats.users}
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow dark:border dark:border-gray-700">
                    <h3 className="font-semibold text-lg dark:text-gray-200">Pending Approvals</h3>
                    <p className="text-3xl font-bold text-orange-500 dark:text-orange-400">
                        {stats.approvals}
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow dark:border dark:border-gray-700">
                    <h3 className="font-semibold text-lg dark:text-gray-200">Total Pickups</h3>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {stats.pickups}
                    </p>
                </div>
            </div>

            {/* 🔹 User Management */}
            <h2 className="text-xl font-semibold mt-8 mb-2">User Management</h2>
            <table className="w-full border">
                <thead>
                    <tr className="bg-gray-200 dark:bg-gray-700">
                        <th>Name</th>
                        <th>Email</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id} className="text-center">
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                                <button
                                    onClick={() => suspendUser(user._id)}
                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                >
                                    Suspend
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* 🔹 Activity Logs */}
            <h2 className="text-xl font-semibold mt-8 mb-2">Activity Logs</h2>
            <ul className="bg-white dark:bg-gray-800 p-4 rounded shadow">
                {logs.map((log, i) => (
                    <li key={i}>
                        {log.message} - {new Date(log.date).toLocaleString()}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminDashboard;