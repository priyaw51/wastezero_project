import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import opportunityService from '../../services/opportunityService';

const OpportunityList = () => {
    const { user } = useAuth();
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [appliedOpportunities, setAppliedOpportunities] = useState(new Set());
    const [applyingId, setApplyingId] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');

    // Fetch opportunities on mount
    useEffect(() => {
        const fetchOpportunities = async () => {
            try {
                setLoading(true);
                const data = await opportunityService.getAllOpportunities();
                setOpportunities(data);
                
                // Load applied opportunities if user is volunteer
                if (user?.role === 'volunteer') {
                    const applied = await opportunityService.getAppliedOpportunities();
                    setAppliedOpportunities(new Set(applied.map(opp => opp._id)));
                }
            } catch (err) {
                setError(err.message || 'Failed to load opportunities');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchOpportunities();
    }, [user]);

    const handleApply = async (opportunityId) => {
        if (!user) {
            alert('Please log in to apply for opportunities');
            return;
        }

        if (user.role !== 'volunteer') {
            alert('Only volunteers can apply for opportunities');
            return;
        }

        try {
            setApplyingId(opportunityId);
            await opportunityService.applyForOpportunity(opportunityId);
            setAppliedOpportunities(prev => new Set([...prev, opportunityId]));
            alert('Successfully applied for the opportunity!');
        } catch (err) {
            alert(err.message || 'Failed to apply for opportunity');
            console.error(err);
        } finally {
            setApplyingId(null);
        }
    };

    const filteredOpportunities = opportunities.filter(opp => {
        if (filterStatus === 'all') return true;
        return opp.status === filterStatus;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                    <p className="mt-4 text-gray-600">Loading opportunities...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Opportunities</h1>
                    <p className="text-gray-600">Find and apply for volunteering opportunities</p>
                </div>

                {/* Filter Section */}
                <div className="mb-8">
                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={() => setFilterStatus('all')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                filterStatus === 'all'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-white text-gray-700 border border-gray-300 hover:border-green-600'
                            }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilterStatus('open')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                filterStatus === 'open'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-white text-gray-700 border border-gray-300 hover:border-green-600'
                            }`}
                        >
                            Open
                        </button>
                        <button
                            onClick={() => setFilterStatus('in-progress')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                filterStatus === 'in-progress'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-white text-gray-700 border border-gray-300 hover:border-green-600'
                            }`}
                        >
                            In Progress
                        </button>
                        <button
                            onClick={() => setFilterStatus('closed')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                filterStatus === 'closed'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-white text-gray-700 border border-gray-300 hover:border-green-600'
                            }`}
                        >
                            Closed
                        </button>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                {/* Opportunities Grid */}
                {filteredOpportunities.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No opportunities found</p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredOpportunities.map(opportunity => (
                            <div
                                key={opportunity._id}
                                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden flex flex-col"
                            >
                                {/* Card Header */}
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-start justify-between mb-3">
                                        <h2 className="text-xl font-bold text-gray-900 flex-1">
                                            {opportunity.title}
                                        </h2>
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ml-2 ${
                                                opportunity.status === 'open'
                                                    ? 'bg-green-100 text-green-800'
                                                    : opportunity.status === 'in-progress'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}
                                        >
                                            {opportunity.status}
                                        </span>
                                    </div>

                                    {/* Description */}
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                        {opportunity.description}
                                    </p>

                                    {/* Location */}
                                    <div className="flex items-center text-gray-500 text-sm mb-4">
                                        <svg
                                            className="w-4 h-4 mr-1"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.3A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
                                        </svg>
                                        {opportunity.address}
                                    </div>

                                    {/* Duration */}
                                    {opportunity.duration && (
                                        <div className="flex items-center text-gray-500 text-sm mb-4">
                                            <svg
                                                className="w-4 h-4 mr-1"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            {opportunity.duration}
                                        </div>
                                    )}

                                    {/* Skills */}
                                    {opportunity.required_skills?.length > 0 && (
                                        <div className="mb-4">
                                            <p className="text-xs font-semibold text-gray-700 mb-2">
                                                Required Skills
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {opportunity.required_skills.map((skill, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Footer - Apply Button */}
                                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                                    {user?.role === 'volunteer' ? (
                                        <button
                                            onClick={() => handleApply(opportunity._id)}
                                            disabled={
                                                applyingId === opportunity._id ||
                                                appliedOpportunities.has(opportunity._id) ||
                                                opportunity.status !== 'open'
                                            }
                                            className={`w-full py-2.5 px-4 rounded-lg font-semibold transition-all duration-200 text-sm ${
                                                appliedOpportunities.has(opportunity._id)
                                                    ? 'bg-green-100 text-green-700 cursor-not-allowed border border-green-300'
                                                    : opportunity.status !== 'open'
                                                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                                    : applyingId === opportunity._id
                                                    ? 'bg-green-600 text-white cursor-wait opacity-90'
                                                    : 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800'
                                            }`}
                                        >
                                            {applyingId === opportunity._id ? (
                                                <span className="flex items-center justify-center">
                                                    <svg
                                                        className="animate-spin h-4 w-4 mr-2"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                        ></circle>
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                        ></path>
                                                    </svg>
                                                    Applying...
                                                </span>
                                            ) : appliedOpportunities.has(opportunity._id) ? (
                                                <span className="flex items-center justify-center">
                                                    <svg
                                                        className="w-4 h-4 mr-2"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                    Applied
                                                </span>
                                            ) : opportunity.status !== 'open' ? (
                                                'Opportunity Closed'
                                            ) : (
                                                'Apply Now'
                                            )}
                                        </button>
                                    ) : user?.role === 'ngo' ? (
                                        <div className="text-center text-gray-500 text-sm py-2">
                                            <p>NGOs cannot apply for opportunities</p>
                                        </div>
                                    ) : (
                                        <a
                                            href="/login"
                                            className="block w-full py-2.5 px-4 rounded-lg font-semibold bg-green-600 text-white hover:bg-green-700 text-center transition-colors text-sm"
                                        >
                                            Login to Apply
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OpportunityList;
