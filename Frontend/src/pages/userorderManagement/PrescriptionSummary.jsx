import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../utils/axiosInstance";

const PrescriptionSummary = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchData = async () => {
    try {
      const res = await api.get(`/api/prescriptions/${id}/summary`);
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load summary");
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      await api.put(`/api/prescriptions/${id}`, { status: "approved" });
      await fetchData(); // Refresh data
    } catch (err) {
      setError(err.response?.data?.message || "Failed to approve");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!window.confirm("Are you sure you want to reject (delete) this prescription?")) return;
    setActionLoading(true);
    try {
      await api.delete(`/api/prescriptions/${id}`);
      navigate("/view-orders");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete");
    } finally {
      setActionLoading(false);
    }
  };

  if (error) return <div className="text-red-600 text-center mt-10">{error}</div>;
  if (!data) return <div className="text-center mt-10">Loading summary...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-10">

      <div className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className="text-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
        >
          ← Back
        </button>
      </div>

      {/* User Details */}
      <div className="mb-6 bg-green-50 p-4 rounded shadow-sm">
        <h3 className="text-xl font-semibold mb-2">User Details</h3>
        <p><strong>Name:</strong> {data.user?.name || "-"}</p>
        <p><strong>Email:</strong> {data.user?.email || "-"}</p>
        <p><strong>Address:</strong> {data.user?.address || "-"}</p>
        <p><strong>Contact No:</strong> {data.user?.contact_no || "-"}</p>
        <p><strong>Date of Birth:</strong> {data.user?.dob ? new Date(data.user.dob).toLocaleDateString() : "-"}</p>
      </div>

      {/* Prescription Info */}
      <h2 className="text-2xl font-bold mb-4">Prescription #{data.id}</h2>
      <div className="space-y-2 text-gray-700">
        <p><strong>Status:</strong> {data.status}</p>
        <p><strong>Note:</strong> {data.note}</p>
        <p><strong>Delivery Address:</strong> {data.delivery_address}</p>
        <p><strong>Delivery Time:</strong> {new Date(data.delivery_time).toLocaleString()}</p>
      </div>

      {/* Drugs List */}
      <h3 className="text-xl font-semibold mt-6 mb-2">Drugs List</h3>
      <ul className="bg-gray-50 p-4 rounded space-y-2 text-sm">
        {data.prescription_list.map((item, i) => (
          <li key={i} className="flex justify-between border-b pb-1">
            <span>{item.drug_name} ({item.quantity} × ${item.unit_price})</span>
            <span className="font-semibold">${item.total}</span>
          </li>
        ))}
      </ul>

      <p className="mt-4 font-bold text-right text-lg">Total Price: ${data.total_price}</p>

      {/* Approve / Reject Buttons */}
      {data.status === "quotationed" && (
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={handleApprove}
            disabled={actionLoading}
            className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            Approve
          </button>
          <button
            onClick={handleReject}
            disabled={actionLoading}
            className="px-5 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
};

export default PrescriptionSummary;
