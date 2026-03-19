import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import MapPicker from "../components/MapPicker";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
<<<<<<< HEAD
import { useParams, useNavigate } from 'react-router-dom';
=======
import { FaMapMarkerAlt, FaKeyboard } from "react-icons/fa";
>>>>>>> eaa806068fdff2f2c8b837cf0a8f99347969326a

const Profile = () => {
    const { user, setUser } = useAuth();
    const { isDarkMode } = useTheme();
<<<<<<< HEAD
    const { id: paramId } = useParams();
    const navigate = useNavigate();

    // Profile being viewed (current user vs other user)
    const [profileUser, setProfileUser] = useState(user);
=======
>>>>>>> eaa806068fdff2f2c8b837cf0a8f99347969326a

    const [activeTab, setActiveTab] = useState("profile");
    const [locationMode, setLocationMode] = useState("manual");
    const [skillInput, setSkillInput] = useState("");
    const [saveStatus, setSaveStatus] = useState(null); // 'success' | 'error' | null

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        location: { type: "Point", coordinates: [0, 0] },
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
<<<<<<< HEAD
                name: profileUser.name || "",
                email: profileUser.email || "",
                location: profileUser.location || { coordinates: [0, 0] },
                skills: profileUser.skills || [],
                bio: profileUser.bio || "",
                address: profileUser.address || "",
=======
                name: user.name || "",
                email: user.email || "",
                location: user.location || { type: "Point", coordinates: [0, 0] },
                skills: user.skills || [],
                bio: user.bio || "",
                address: user.address || "",
>>>>>>> eaa806068fdff2f2c8b837cf0a8f99347969326a
            });
        }
    }, [profileUser]);

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData((prev) => ({ ...prev, [name]: value }));
    };

    // Map pick → reverse geocode → fill address + store coordinates
    const handleLocationSelect = async (lat, lng) => {
        setFormData((prev) => ({
            ...prev,
            location: { type: "Point", coordinates: [lng, lat] },
        }));
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );
            const data = await res.json();
            if (data?.display_name) {
                setFormData((prev) => ({ ...prev, address: data.display_name }));
            }
        } catch (err) {
            console.error("Reverse geocode failed:", err);
        }
    };

    // Skills tag-input
    const handleAddSkill = (e) => {
        if (e.key === "Enter" && skillInput.trim()) {
            e.preventDefault();
            const trimmed = skillInput.trim();
            if (!formData.skills.includes(trimmed)) {
                setFormData((prev) => ({ ...prev, skills: [...prev.skills, trimmed] }));
            }
            setSkillInput("");
        }
    };

    const removeSkill = (skill) => {
        setFormData((prev) => ({
            ...prev,
            skills: prev.skills.filter((s) => s !== skill),
        }));
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setSaveStatus(null);
        try {
            const token = localStorage.getItem("token");
            if (!user || !user._id) return;

            const updateData = {
                bio: formData.bio,
                address: formData.address,
                skills: formData.skills,
                location: formData.location,
            };

            const response = await axios.put(
                `http://localhost:3000/api/users/${user._id}`,
                updateData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const updatedUser = { ...user, ...response.data };
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setSaveStatus("success");
            setTimeout(() => setSaveStatus(null), 3000);
        } catch (error) {
            console.error("Error updating profile:", error);
            setSaveStatus("error");
        }
    };

    const handleSavePassword = async (e) => {
        e.preventDefault();
        setSaveStatus(null);
        try {
            if (passwordData.newPassword !== passwordData.confirmPassword) {
                setSaveStatus("mismatch");
                return;
            }
            const token = localStorage.getItem("token");
            if (!user || !user._id) return;

            await axios.put(
                `http://localhost:3000/api/users/${user._id}/password`,
                {
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setSaveStatus("success");
            setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
            setTimeout(() => setSaveStatus(null), 3000);
        } catch (error) {
            console.error("Error changing password:", error);
            setSaveStatus("error");
        }
    };

    const inputClass = `w-full p-3 rounded-lg border focus:ring-2 focus:ring-green-500 outline-none transition-all ${isDarkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-200 text-gray-800"
        }`;
    const readOnlyClass = `w-full p-3 rounded-lg border outline-none cursor-not-allowed ${isDarkMode ? "bg-gray-700/50 border-gray-600 text-gray-400" : "bg-gray-100 border-gray-200 text-gray-500"
        }`;

    if (!user) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    return (
        <div className={`flex h-screen w-full transition-colors duration-200 ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"}`}>
            <Sidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar />

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

<<<<<<< HEAD
                        {/* Tabs - Only show for own profile */}
                        {!paramId || (user && paramId === user._id) ? (
                            <>
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
=======
                        {/* Tabs */}
                        <div className={`flex mb-6 rounded-lg p-1 w-64 ${isDarkMode ? "bg-gray-800" : "bg-gray-200"}`}>
                            <button
                                onClick={() => { setActiveTab("profile"); setSaveStatus(null); }}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${activeTab === "profile" ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                Profile
                            </button>
                            <button
                                onClick={() => { setActiveTab("password"); setSaveStatus(null); }}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${activeTab === "password" ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                Password
                            </button>
                        </div>

                        <div className={`rounded-xl shadow-sm border p-6 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
>>>>>>> eaa806068fdff2f2c8b837cf0a8f99347969326a

                            {/* ── PROFILE TAB ── */}
                            {activeTab === "profile" && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-1">Personal Information</h3>
                                    <p className="text-sm text-gray-500 mb-6">Update your personal information and profile details</p>

                                    {/* Status banner */}
                                    {saveStatus === "success" && (
                                        <div className="mb-4 p-3 rounded-lg bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm font-medium">
                                            ✅ Profile updated successfully!
                                        </div>
                                    )}
                                    {saveStatus === "error" && (
                                        <div className="mb-4 p-3 rounded-lg bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm font-medium">
                                            ❌ Failed to update profile. Please try again.
                                        </div>
                                    )}

                                    <form onSubmit={handleSaveProfile} className="space-y-6">

                                        {/* Name — read-only */}
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Full Name</label>
                                            <input type="text" value={formData.name} readOnly className={readOnlyClass} />
                                        </div>

                                        {/* Email — read-only */}
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Email</label>
                                            <input type="email" value={formData.email} readOnly className={readOnlyClass} />
                                            <p className="text-xs text-gray-500 mt-1">This is the email address used for account notifications.</p>
                                        </div>

                                        {/* Role — read-only */}
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Role</label>
                                            <input type="text" value={user.role} readOnly className={`${readOnlyClass} capitalize`} />
                                        </div>

                                        {/* Bio — editable */}
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Bio</label>
                                            <textarea
                                                name="bio"
                                                value={formData.bio}
                                                onChange={handleProfileChange}
                                                rows="3"
                                                className={inputClass}
                                                placeholder="Tell us a little about yourself..."
                                            />
                                        </div>

                                        {/* Skills — editable tag input */}
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Skills</label>
                                            <div className={`w-full rounded-lg border p-3 min-h-[48px] flex flex-wrap gap-2 items-center focus-within:ring-2 focus-within:ring-green-500 transition-all ${isDarkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"
                                                }`}>
                                                {formData.skills.map((skill) => (
                                                    <span
                                                        key={skill}
                                                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800"
                                                    >
                                                        {skill}
                                                        <button
                                                            type="button"
                                                            onClick={() => removeSkill(skill)}
                                                            className="hover:text-red-500 transition-colors font-bold leading-none"
                                                        >
                                                            &times;
                                                        </button>
                                                    </span>
                                                ))}
                                                <input
                                                    type="text"
                                                    value={skillInput}
                                                    onChange={(e) => setSkillInput(e.target.value)}
                                                    onKeyDown={handleAddSkill}
                                                    placeholder={formData.skills.length === 0 ? "Type a skill and press Enter..." : "Add more..."}
                                                    className="flex-1 min-w-[140px] bg-transparent outline-none text-sm placeholder-gray-400"
                                                />
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">Press <kbd className="px-1 py-0.5 rounded bg-gray-200 dark:bg-gray-600 text-xs">Enter</kbd> to add a skill. Click &times; to remove.</p>
                                        </div>

                                        {/* Address + Map — editable with MapPicker */}
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <label className="block text-sm font-medium">Address / Location</label>
                                                <div className={`flex rounded-lg overflow-hidden border text-xs font-medium ${isDarkMode ? "border-gray-600" : "border-gray-200"}`}>
                                                    <button
                                                        type="button"
                                                        onClick={() => setLocationMode("manual")}
                                                        className={`flex items-center gap-1.5 px-3 py-1.5 transition-colors ${locationMode === "manual"
                                                                ? "bg-green-600 text-white"
                                                                : isDarkMode ? "bg-gray-700 text-gray-400 hover:bg-gray-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                            }`}
                                                    >
                                                        <FaKeyboard size={11} /> Manual
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setLocationMode("map")}
                                                        className={`flex items-center gap-1.5 px-3 py-1.5 transition-colors ${locationMode === "map"
                                                                ? "bg-green-600 text-white"
                                                                : isDarkMode ? "bg-gray-700 text-gray-400 hover:bg-gray-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                            }`}
                                                    >
                                                        <FaMapMarkerAlt size={11} /> Pick on Map
                                                    </button>
                                                </div>
                                            </div>

                                            {locationMode === "manual" ? (
                                                <input
                                                    type="text"
                                                    name="address"
                                                    value={formData.address}
                                                    onChange={handleProfileChange}
                                                    className={inputClass}
                                                    placeholder="Enter your full address..."
                                                />
                                            ) : (
                                                <div className="space-y-3">
                                                    <MapPicker
                                                        onLocationSelect={handleLocationSelect}
                                                        initialCoordinates={
                                                            formData.location?.coordinates?.[0] !== 0
                                                                ? [formData.location.coordinates[1], formData.location.coordinates[0]]
                                                                : null
                                                        }
                                                    />
                                                    {formData.address && (
                                                        <div className={`flex items-start gap-2 p-3 rounded-lg border text-sm ${isDarkMode ? "bg-gray-700 border-gray-600 text-gray-300" : "bg-green-50 border-green-100 text-gray-700"}`}>
                                                            <FaMapMarkerAlt className="text-green-500 mt-0.5 shrink-0" />
                                                            <span>{formData.address}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            <p className="text-xs text-gray-500 mt-1">This helps match you with nearby opportunities.</p>
                                        </div>

                                        <div className="flex justify-end">
                                            <button
                                                type="submit"
                                                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-7 rounded-lg transition-colors shadow-sm"
                                            >
                                                Save Changes
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* ── PASSWORD TAB ── */}
                            {activeTab === "password" && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-1">Change Password</h3>
                                    <p className="text-sm text-gray-500 mb-6">Update your password to secure your account</p>

                                    {saveStatus === "success" && (
                                        <div className="mb-4 p-3 rounded-lg bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm font-medium">
                                            ✅ Password changed successfully!
                                        </div>
                                    )}
                                    {saveStatus === "mismatch" && (
                                        <div className="mb-4 p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400 text-sm font-medium">
                                            ⚠️ New passwords do not match.
                                        </div>
                                    )}
                                    {saveStatus === "error" && (
                                        <div className="mb-4 p-3 rounded-lg bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm font-medium">
                                            ❌ Failed to change password. Check your current password.
                                        </div>
                                    )}

                                    <form onSubmit={handleSavePassword} className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Current Password</label>
                                            <input
                                                type="password"
                                                name="currentPassword"
                                                value={passwordData.currentPassword}
                                                onChange={handlePasswordChange}
                                                className={inputClass}
                                                placeholder="Enter current password"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">New Password</label>
                                            <input
                                                type="password"
                                                name="newPassword"
                                                value={passwordData.newPassword}
                                                onChange={handlePasswordChange}
                                                className={inputClass}
                                                placeholder="Enter new password"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                value={passwordData.confirmPassword}
                                                onChange={handlePasswordChange}
                                                className={inputClass}
                                                placeholder="Confirm new password"
                                            />
                                        </div>

                                        <div className="flex justify-end">
                                            <button
                                                type="submit"
                                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-7 rounded-lg transition-colors shadow-sm"
                                            >
                                                Change Password
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                                </div>
                            </>
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
