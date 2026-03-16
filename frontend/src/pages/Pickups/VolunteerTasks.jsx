import React, { useState, useEffect } from 'react';
import pickupService from '../../services/pickupService';
import { useTheme } from '../../context/ThemeContext';
import { FaMapMarkerAlt, FaCalendarAlt, FaCheckCircle, FaTrashAlt } from 'react-icons/fa';

const VolunteerTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isDarkMode } = useTheme();

    // Fetch tasks assigned to the current user (acting as field agent)
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const data = await pickupService.getAssignedPickups();
                setTasks(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, []);

    const handleUpdateStatus = async (taskId, status) => {
        try {
            await pickupService.updateStatus(taskId, status);
            // Update local state
            setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status } : t));
        } catch (err) {
            alert(err);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
    );

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold dark:text-gray-100">Market Dispatch Tasks</h1>
                <p className="text-gray-600 dark:text-gray-400">View and manage pickups dispatched to you by your NGO.</p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-6">
                    {error}
                </div>
            )}

            {tasks.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 p-12 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaCheckCircle className="text-gray-400 text-2xl" />
                    </div>
                    <h3 className="text-lg font-semibold dark:text-gray-200">No active tasks</h3>
                    <p className="text-gray-500 dark:text-gray-400">You haven't been assigned any pickups yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {tasks.map((task) => (
                        <div
                            key={task._id}
                            className={`p-6 rounded-2xl border transition-all ${task.status === 'completed'
                                    ? 'opacity-60 bg-gray-50 dark:bg-gray-800/50 grayscale'
                                    : 'bg-white dark:bg-gray-800 shadow-sm hover:shadow-md border-gray-100 dark:border-gray-700'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${task.status === 'completed' ? 'bg-green-100 text-green-700' :
                                        task.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                            'bg-blue-100 text-blue-700'
                                    }`}>
                                    {task.status}
                                </span>
                                <span className="text-sm text-gray-400">
                                    {new Date(task.createdAt).toLocaleDateString()}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold mb-2 dark:text-white capitalize">{task.category} Waste</h3>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                                    <FaMapMarkerAlt className="mt-1 text-red-500 shrink-0" />
                                    <span className="text-sm">{task.address}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                    <FaCalendarAlt className="text-blue-500 shrink-0" />
                                    <span className="text-sm">
                                        {new Date(task.scheduled_time).toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mt-4">
                                <p className="text-xs text-gray-400 mb-4">
                                    Requester: <span className="font-semibold text-gray-600 dark:text-gray-300">{task.user_id?.name || 'Anonymous'}</span>
                                </p>

                                {task.status !== 'completed' && task.status !== 'cancelled' && (
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleUpdateStatus(task._id, 'completed')}
                                            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition-colors"
                                        >
                                            Mark as Complete
                                        </button>
                                        <button
                                            onClick={() => handleUpdateStatus(task._id, 'cancelled')}
                                            className="px-4 border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 py-2 rounded-lg transition-colors"
                                        >
                                            <FaTrashAlt />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default VolunteerTasks;
