import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaCheckCircle, FaMapMarkerAlt, FaStar } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';

const VolunteerDashboard = () => {
    const { isDarkMode } = useTheme();
    const [matches, setMatches] = useState([]);
    const [matchLoading, setMatchLoading] = useState(true);
    const [matchError, setMatchError] = useState(null);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:3000/api/matches', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.success) {
                    setMatches(res.data.data);
                }
            } catch (err) {
                console.error('Failed to load matches:', err);
                setMatchError('Could not load match suggestions.');
            } finally {
                setMatchLoading(false);
            }
        };
        fetchMatches();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Volunteer Dashboard</h1>

            {/* Stats */}
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

            {/* Top Match Suggestions */}
            <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow dark:shadow-none dark:border dark:border-gray-700">
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-xl font-bold dark:text-gray-100">Top Match Suggestions</h2>
                    {matches.length > 3 && (
                        <button
                            onClick={() => setShowAll(prev => !prev)}
                            className="text-sm text-green-600 hover:text-green-700 font-semibold"
                        >
                            {showAll ? 'Show Less ↑' : `View All (${matches.length}) →`}
                        </button>
                    )}
                </div>

                {matchLoading && (
                    <div className="flex items-center gap-3 py-4">
                        <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-green-600" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">Finding your best matches...</span>
                    </div>
                )}

                {matchError && !matchLoading && (
                    <p className="text-red-500 text-sm">{matchError}</p>
                )}

                {!matchLoading && !matchError && matches.length === 0 && (
                    <div className="flex items-center gap-3 border-l-4 border-yellow-400 pl-4 py-2 bg-yellow-50/50 dark:bg-gray-700/50 rounded-r-md">
                        <FaStar className="text-yellow-400 shrink-0" />
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            No matches found yet. Update your profile with skills to get personalized matches!
                        </p>
                    </div>
                )}

                {!matchLoading && matches.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {(showAll ? matches : matches.slice(0, 3)).map(({ opportunity, skillScore, matchedSkills, distanceKm }) => (
                            <div
                                key={opportunity._id}
                                className={`flex flex-col rounded-xl border transition-all hover:-translate-y-0.5 hover:shadow-md ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                                    }`}
                            >
                                {/* Score Header */}
                                <div className="px-4 py-3 flex justify-between items-center bg-green-50 dark:bg-green-900/10 rounded-t-xl border-b border-gray-200 dark:border-gray-600">
                                    <div className="flex items-center gap-1.5">
                                        <FaCheckCircle className="text-green-600 dark:text-green-400 text-sm" />
                                        <span className="font-bold text-green-700 dark:text-green-400 text-sm">
                                            {skillScore}% Match
                                        </span>
                                    </div>
                                    {distanceKm !== null && (
                                        <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                            <FaMapMarkerAlt className="text-red-400" />
                                            {distanceKm} km
                                        </span>
                                    )}
                                </div>

                                {/* Body */}
                                <div className="p-4 flex-1 flex flex-col">
                                    <h3 className="font-semibold text-base mb-1 dark:text-gray-100 line-clamp-1" title={opportunity.title}>
                                        {opportunity.title}
                                    </h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                                        {opportunity.ngo_id?.name || 'Unknown NGO'}
                                    </p>

                                    {matchedSkills.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mb-4">
                                            {matchedSkills.map(skill => (
                                                <span
                                                    key={skill}
                                                    className="px-2 py-0.5 rounded text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <Link
                                        to={`/opportunities/${opportunity._id}`}
                                        className="mt-auto w-full text-center text-sm px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VolunteerDashboard;
