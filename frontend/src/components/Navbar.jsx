import React from 'react';
import { FaSearch, FaBell, FaUserCircle, FaChevronDown, FaSignOutAlt } from 'react-icons/fa';

const Navbar = ({ user, isDarkMode }) => {
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
    // We need to use window.location or pass useNavigate from parent if allowed, 
    // but better to just use window.location.href or imported hook if we convert to proper component.
    // Since this is a .jsx file, we can import useNavigate.

    // Note: I will add the import in a separate edit or assume I can rewrite the whole file for cleaner imports.
    // Let's rewrite the imports and the component to be safe.
    return (
        <div className={`h-16 flex items-center justify-between px-6 shadow-sm ${isDarkMode ? 'bg-gray-800 border-b border-gray-700 text-white' : 'bg-white text-gray-800'}`}>

            {/* Search Bar */}
            <div className={`flex items-center rounded-md px-3 py-2 w-96 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <FaSearch className="text-gray-400 mr-3" />
                <input
                    type="text"
                    placeholder="Search pickups, opportunities..."
                    className="bg-transparent border-none outline-none w-full text-sm placeholder-gray-500"
                />
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center gap-6">
                {/* Notifications */}
                <button className="relative text-gray-500 hover:text-gray-700 transition-colors">
                    <FaBell className="text-xl" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">3</span>
                </button>

                {/* User Profile */}
                <div className="relative">
                    <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-sm">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <FaChevronDown className="text-gray-400 text-xs" />
                    </div>

                    {isDropdownOpen && (
                        <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-50 ${isDarkMode ? 'bg-gray-700' : 'bg-white border border-gray-100'}`}>
                            <button
                                onClick={() => {
                                    localStorage.removeItem("token");
                                    localStorage.removeItem("user");
                                    window.location.href = "/";
                                }}
                                className={`block w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${isDarkMode ? 'text-gray-200 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'}`}
                            >
                                <FaSignOutAlt />
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
