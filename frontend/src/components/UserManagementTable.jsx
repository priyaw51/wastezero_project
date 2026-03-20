import React, { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import api from "../services/api";

const UserManagementTable = ({ setStats, searchTerm }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isDarkMode } = useTheme();

    // Fetch users from backend on mount
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get("/admin/users");
                setUsers(res.data);
            } catch (err) {
                console.error("Failed to fetch users:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    // Recalculate stats whenever users change
    useEffect(() => {
        const total = users.length;
        const suspended = users.filter((u) => u.isSuspended).length;
        const active = total - suspended;
        setStats({ total, active, suspended });
    }, [users, setStats]);

    // Toggle suspend / unsuspend
    const toggleStatus = async (userId) => {
        try {
            const user = users.find((u) => u._id === userId);
            const endpoint = user.isSuspended
                ? `/admin/unsuspend/${userId}`
                : `/admin/suspend/${userId}`;
            await api.put(endpoint);
            setUsers((prev) =>
                prev.map((u) =>
                    u._id === userId ? { ...u, isSuspended: !u.isSuspended } : u
                )
            );
        } catch (err) {
            console.error("Failed to toggle user status:", err);
        }
    };

    // Filter users by searchTerm (name or email)
    const filteredUsers = users.filter((u) => {
        const term = (searchTerm || "").toLowerCase();
        return (
            u.name?.toLowerCase().includes(term) ||
            u.email?.toLowerCase().includes(term)
        );
    });

    if (loading) {
        return (
            <p className="text-gray-400 text-sm text-center py-4">
                Loading users...
            </p>
        );
    }

    if (filteredUsers.length === 0) {
        return (
            <p className="text-gray-400 text-sm text-center py-4">
                No users found.
            </p>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className={`text-left border-b ${isDarkMode ? "border-gray-700 text-gray-400" : "border-gray-200 text-gray-500"}`}>
                        <th className="pb-3 pr-4 font-semibold">Name</th>
                        <th className="pb-3 pr-4 font-semibold">Email</th>
                        <th className="pb-3 pr-4 font-semibold">Role</th>
                        <th className="pb-3 pr-4 font-semibold">Status</th>
                        <th className="pb-3 font-semibold">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map((user) => (
                        <tr
                            key={user._id}
                            className={`border-b ${isDarkMode ? "border-gray-700" : "border-gray-100"}`}
                        >
                            <td className="py-3 pr-4">{user.name}</td>
                            <td className="py-3 pr-4 text-gray-400">{user.email}</td>
                            <td className="py-3 pr-4 capitalize">{user.role}</td>
                            <td className="py-3 pr-4">
                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${user.isSuspended
                                            ? "bg-red-100 text-red-600"
                                            : "bg-green-100 text-green-600"
                                        }`}
                                >
                                    {user.isSuspended ? "Suspended" : "Active"}
                                </span>
                            </td>
                            <td className="py-3">
                                <button
                                    onClick={() => toggleStatus(user._id)}
                                    className={`px-3 py-1 rounded text-sm font-medium text-white transition-colors ${user.isSuspended
                                            ? "bg-green-500 hover:bg-green-600"
                                            : "bg-red-500 hover:bg-red-600"
                                        }`}
                                >
                                    {user.isSuspended ? "Unsuspend" : "Suspend"}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserManagementTable;