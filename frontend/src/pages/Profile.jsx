import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import MapPicker from "../components/MapPicker";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useParams, useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaKeyboard } from "react-icons/fa";

const Profile = () => {
    const { user, setUser } = useAuth();
    const { isDarkMode } = useTheme();

    const { id: paramId } = useParams();
    const navigate = useNavigate();

    const [profileUser, setProfileUser] = useState(user);
    const [activeTab, setActiveTab] = useState("profile");
    const [locationMode, setLocationMode] = useState("manual");
    const [skillInput, setSkillInput] = useState("");
    const [saveStatus, setSaveStatus] = useState(null);

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
        const load = async () => {
            if (paramId && user && paramId !== user._id) {
                try {
                    const token = localStorage.getItem("token");
                    const res = await axios.get(`http://localhost:3000/api/users/${paramId}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setProfileUser(res.data.data || res.data);
                } catch (err) {
                    console.error("Failed to load profile", err);
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
                location: profileUser.location || { type: "Point", coordinates: [0, 0] },
                skills: profileUser.skills || [],
                bio: profileUser.bio || "",
                address: profileUser.address || "",
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

    const handleAddSkill = (e) => {
        if (e.key === "Enter" && skillInput.trim()) {
            e.preventDefault();
            const trimmed = skillInput.trim();
            if (!formData.skills.includes(trimmed)) {
                setFormData((prev) => ({
                    ...prev,
                    skills: [...prev.skills, trimmed],
                }));
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

            const response = await axios.put(
                `http://localhost:3000/api/users/${user._id}`,
                {
                    bio: formData.bio,
                    address: formData.address,
                    skills: formData.skills,
                    location: formData.location,
                },
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
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch (error) {
            console.error("Error changing password:", error);
            setSaveStatus("error");
        }
    };

    const inputClass = `w-full p-3 rounded-lg border focus:ring-2 focus:ring-green-500 outline-none ${
        isDarkMode
            ? "bg-gray-700 border-gray-600 text-white"
            : "bg-gray-50 border-gray-200 text-gray-800"
    }`;

    if (!user) return <div>Loading...</div>;

    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1">
                <Navbar />

                <div className="p-6">
                    <h1 className="text-2xl font-bold mb-4">
                        {paramId && paramId !== user._id
                            ? `${profileUser?.name}'s Profile`
                            : "My Profile"}
                    </h1>

                    {/* Tabs */}
                    {!paramId || paramId === user._id ? (
                        <>
                            <div className="flex mb-4">
                                <button onClick={() => setActiveTab("profile")}>
                                    Profile
                                </button>
                                <button onClick={() => setActiveTab("password")}>
                                    Password
                                </button>
                            </div>

                            {activeTab === "profile" && (
                                <form onSubmit={handleSaveProfile}>
                                    <input value={formData.name} readOnly />
                                    <textarea
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleProfileChange}
                                    />
                                    <button type="submit">Save</button>
                                </form>
                            )}

                            {activeTab === "password" && (
                                <form onSubmit={handleSavePassword}>
                                    <input
                                        type="password"
                                        name="currentPassword"
                                        onChange={handlePasswordChange}
                                    />
                                    <button type="submit">Change Password</button>
                                </form>
                            )}
                        </>
                    ) : (
                        <div>
                            <p>{profileUser?.name}</p>
                            <p>{profileUser?.email}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;