import { useEffect, useState } from "react";
import { FaBirthdayCake, FaEnvelope, FaMapMarkerAlt, FaPhone, FaUser, FaUserTag } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import api from "../utils/axiosInstance";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/api/profile");
        setUser(res.data.user);
      } catch (err) {
        setError("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-100 to-white overflow-hidden">
      <Sidebar className="w-64 flex-shrink-0" />
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-4xl font-bold text-blue-800 mb-8">👤 User Dashboard</h1>

        {loading ? (
          <p className="text-gray-600 text-lg">Loading profile...</p>
        ) : error ? (
          <p className="text-red-600 font-semibold">{error}</p>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-3xl mx-auto border border-blue-200">
            <h2 className="text-2xl font-semibold text-blue-700 mb-6">📋 Profile Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700 text-md">
              <div className="flex items-center gap-3">
                <FaUser className="text-blue-600 text-xl" />
                <span><strong>Name:</strong> {user.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-blue-600 text-xl" />
                <span><strong>Email:</strong> {user.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-blue-600 text-xl" />
                <span><strong>Address:</strong> {user.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <FaPhone className="text-blue-600 text-xl" />
                <span><strong>Contact:</strong> {user.contact_no}</span>
              </div>
              <div className="flex items-center gap-3">
                <FaBirthdayCake className="text-blue-600 text-xl" />
                <span><strong>DOB:</strong> {user.dob}</span>
              </div>
              <div className="flex items-center gap-3">
                <FaUserTag className="text-blue-600 text-xl" />
                <span><strong>Role:</strong> {user.role}</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;
