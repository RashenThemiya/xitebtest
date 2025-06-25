import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebaradmin";
import api from "../utils/axiosInstance";

const AdminDashboard = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const res = await api.get("/api/profile");
        setAdmin(res.data.user);
      } catch (err) {
        console.error("Failed to fetch admin profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar className="w-64 flex-shrink-0" />
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-4xl font-bold text-blue-800 mb-4">🛠️ Admin Dashboard</h1>

        {!loading && admin && (
          <p className="text-lg text-gray-700 mb-6">
            Welcome back, <span className="font-semibold text-blue-700">{admin.name}</span>!
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 border border-blue-200">
            <h2 className="text-lg font-semibold text-blue-700 mb-2">👥 Manage Users</h2>
            <p className="text-sm text-gray-600">Add, edit, or remove users from the system.</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-blue-200">
            <h2 className="text-lg font-semibold text-blue-700 mb-2">📄 View Prescriptions</h2>
            <p className="text-sm text-gray-600">Monitor all prescription records and status.</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-blue-200">
            <h2 className="text-lg font-semibold text-blue-700 mb-2">⚙️ System Settings</h2>
            <p className="text-sm text-gray-600">Manage roles, permissions, and platform settings.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
