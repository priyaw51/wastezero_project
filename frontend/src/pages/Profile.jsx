import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useParams, useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, setUser } = useAuth();
    const { isDarkMode } = useTheme();
    const { id: paramId } = useParams();
    const navigate = useNavigate();

    // Profile being viewed (current user vs other user)
    const [profileUser, setProfileUser] = useState(user);

    const [activeTab, setActiveTab] = useState("profile");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        location: { coordinates: [0, 0] },
        skills: [],
        bio: "",
        address: "",
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    useEffect(() => {
        // If viewing another user's profile, fetch it
        const load = async () => {
            if (paramId && user && paramId !== user._id) {
                try {
                    const token = localStorage.getItem('token');
                    const res = await axios.get(`http://localhost:3000/api/users/${paramId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setProfileUser(res.data.data || res.data);
                } catch (err) {
                    console.error('Failed to load profile', err);
                }
            } else {
                setProfileUser(user);
            }
        };
        load();
    }, [paramId, user]);

    useEffect(() => {
        if (profileUser) {
            setFormData({
                name: profileUser.name || "",
                email: profileUser.email || "",
                location: profileUser.location || { coordinates: [0, 0] },
                skills: profileUser.skills || [],
                bio: profileUser.bio || "",
                address: profileUser.address || "",
            });
        }
    }, [profileUser]);

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({ ...passwordData, [name]: value });
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            if (!user || !user._id) return;

            // Only send fields that are editable
            const updateData = {
                bio: formData.bio,
                address: formData.address,
                skills: formData.skills,
            };

            const response = await axios.put(
                `http://localhost:3000/api/users/${user._id}`,
                updateData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Update local storage and state
            const updatedUser = { ...user, ...response.data };
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));

            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile: " + (error.response?.data?.message || "An error occurred"));
        }
    };

    const handleSavePassword = async (e) => {
        e.preventDefault();
        try {
            if (passwordData.newPassword !== passwordData.confirmPassword) {
                alert("New passwords do not match!");
                return;
            }

            const token = localStorage.getItem("token");
            if (!user || !user._id) return;

            const response = await axios.put(
                `http://localhost:3000/api/users/${user._id}/password`,
                {
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("Password updated successfully!");
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch (error) {
            console.error("Error changing password:", error);
            alert("Failed to change password: " + (error.response?.data?.message || "An error occurred"));
        }
    };

    if (!user) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    return (
        <div className={`flex h-screen w-full transition-colors duration-200 ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"}`}>
            <Sidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Navbar */}
                <Navbar />

                {/* Scrollable Main Content */}
                <main className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold">
                                {paramId && profileUser && paramId !== user._id
                                    ? `${profileUser.name || 'User'}'s Profile`
                                    : 'My Profile'}
                            </h1>
                            {paramId && profileUser && paramId !== user._id && (
                                <button
                                    onClick={() => {
                                        const rid = [user._id, profileUser._id].sort().join('_');
                                        navigate(`/chat/${rid}`);
                                    }}
                                    className={`mt-2 px-4 py-2 rounded-lg font-medium transition-colors ${isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                                >
                                    Chat
                                </button>
                            )}
                            <p className="text-gray-500">
                                {paramId && profileUser && paramId !== user._id
                                    ? `View ${profileUser.name || 'user'}'s profile`
                                    : 'Manage your account information and settings'}
                            </p>
                        </div>

                        {/* Tabs - Only show for own profile */}
                        {!paramId || (user && paramId === user._id) ? (
                        <div className={`flex mb-6 rounded-lg p-1 w-64 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                            <button
                                onClick={() => setActiveTab("profile")}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${activeTab === "profile"
                                    ? "bg-white text-gray-800 shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                Profile
                            </button>
                            <button
                                onClick={() => setActiveTab("password")}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${activeTab === "password"
                                    ? "bg-white text-gray-800 shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                Password
                            </button>
                        </div>

                        <div className={`rounded-xl shadow-sm border p-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>

                            {activeTab === "profile" && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-1">Personal Information</h3>
                                    <p className="text-sm text-gray-500 mb-6">Update your personal information and profile details</p>

                                    <form onSubmit={handleSaveProfile} className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Full Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                readOnly
                                                className={`w-full p-3 rounded-lg border outline-none cursor-not-allowed ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-400' : 'bg-gray-100 border-gray-200 text-gray-500'}`}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                readOnly
                                                className={`w-full p-3 rounded-lg border outline-none cursor-not-allowed ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-400' : 'bg-gray-100 border-gray-200 text-gray-500'}`}
                                            />
                                            <p className="text-xs text-gray-500 mt-1">This is the email address used for account notifications.</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">Address</label>
                                            <input
                                                type="text"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleProfileChange}
                                                className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-green-500 outline-none transition-all ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'}`}
                                                placeholder="Your Full Address"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">Location Coordinates</label>
                                            <div className="flex gap-3">
                                                <input
                                                    type="text"
                                                    value={`Lat: ${formData.location?.coordinates?.[1] || 0}`}
                                                    readOnly
                                                    className={`flex-1 p-3 rounded-lg border outline-none cursor-not-allowed ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-400' : 'bg-gray-100 border-gray-200 text-gray-500'}`}
                                                />
                                                <input
                                                    type="text"
                                                    value={`Lng: ${formData.location?.coordinates?.[0] || 0}`}
                                                    readOnly
                                                    className={`flex-1 p-3 rounded-lg border outline-none cursor-not-allowed ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-400' : 'bg-gray-100 border-gray-200 text-gray-500'}`}
                                                />
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">This helps match you with nearby opportunities.</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">Role</label>
                                            <input
                                                type="text"
                                                value={user.role}
                                                readOnly
                                                className={`w-full p-3 rounded-lg border outline-none cursor-not-allowed capitalize ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-400' : 'bg-gray-100 border-gray-200 text-gray-500'}`}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">Bio</label>
                                            <textarea
                                                name="bio"
                                                value={formData.bio}
                                                onChange={handleProfileChange}
                                                rows="3"
                                                className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-green-500 outline-none transition-all ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'}`}
                                                placeholder="Tell us a little about yourself..."
                                            ></textarea>
                                        </div>

                                        <div className="flex justify-end">
                                            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
                                                Save Changes
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {activeTab === "password" && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-1">Change Password</h3>
                                    <p className="text-sm text-gray-500 mb-6">Update your password to secure your account</p>

                                    <form onSubmit={handleSavePassword} className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Current Password</label>
                                            <input
                                                type="password"
                                                name="currentPassword"
                                                value={passwordData.currentPassword}
                                                onChange={handlePasswordChange}
                                                className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-green-500 outline-none transition-all ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'}`}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">New Password</label>
                                            <input
                                                type="password"
                                                name="newPassword"
                                                value={passwordData.newPassword}
                                                onChange={handlePasswordChange}
                                                className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-green-500 outline-none transition-all ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'}`}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                value={passwordData.confirmPassword}
                                                onChange={handlePasswordChange}
                                                className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-green-500 outline-none transition-all ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'}`}
                                            />
                                        </div>

                                        <div className="flex justify-end">
                                            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
                                                Change Password
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                        </div>
                        ) : (
                            <div className={`rounded-xl shadow-sm border p-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">User Information</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Full Name</label>
                                            <p className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'}`}>{profileUser?.name}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Email</label>
                                            <p className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'}`}>{profileUser?.email}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Bio</label>
                                            <p className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'}`}>{profileUser?.bio || 'No bio provided'}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Address</label>
                                            <p className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'}`}>{profileUser?.address}</p>
                                        </div>
                                        {profileUser?.skills?.length > 0 && (
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Skills</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {profileUser.skills.map((skill, idx) => (
                                                        <span key={idx} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Profile;
