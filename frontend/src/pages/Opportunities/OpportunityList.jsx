import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCommentDots } from 'react-icons/fa';

import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import opportunityService from '../../services/opportunityService';

import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';

const OpportunityList = () => {
    const { user } = useAuth();
    const { isDarkMode } = useTheme();
    const navigate = useNavigate();

    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [appliedOpportunities, setAppliedOpportunities] = useState(new Set());
    const [applyingId, setApplyingId] = useState(null);

    useEffect(() => {
        const fetchOpportunities = async () => {
            const data = await opportunityService.getAllOpportunities();
            setOpportunities(data);
            setLoading(false);
        };
        fetchOpportunities();
    }, []);

    const handleApply = async (id) => {
        setApplyingId(id);
        await opportunityService.applyForOpportunity(id);
        setAppliedOpportunities(prev => new Set([...prev, id]));
        setApplyingId(null);
    };

    const handleChat = (ngoId) => {
        const roomId = [user._id, ngoId].sort().join('_');
        navigate(`/chat/${roomId}`);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className={`flex h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
            <Sidebar />

            <div className="flex-1 flex flex-col">
                <Navbar />

                <main className="p-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {opportunities.map(opp => (
                        <div key={opp._id} className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow">

                            <h2 className="text-lg font-bold">{opp.title}</h2>
                            <p className="text-sm mb-3">{opp.description}</p>

                            {/* Buttons */}
                            <div className="space-y-2 mt-4">

                                {/* Apply */}
                                <button
                                    onClick={() => handleApply(opp._id)}
                                    disabled={appliedOpportunities.has(opp._id)}
                                    className="w-full bg-green-600 text-white py-2 rounded"
                                >
                                    {appliedOpportunities.has(opp._id) ? 'Applied' : 'Apply'}
                                </button>

                                {/* Chat */}
                                <button
                                    onClick={() => handleChat(opp.ngo_id)}
                                    className="w-full bg-blue-600 text-white py-2 rounded flex items-center justify-center gap-2"
                                >
                                    <FaCommentDots />
                                    Chat
                                </button>

                                {/* View Details */}
                                <Link
                                    to={`/opportunities/${opp._id}`}
                                    className="block text-center bg-gray-700 text-white py-2 rounded"
                                >
                                    View Details
                                </Link>

                            </div>
                        </div>
                    ))}
                </main>
            </div>
        </div>
    );
};

export default OpportunityList;