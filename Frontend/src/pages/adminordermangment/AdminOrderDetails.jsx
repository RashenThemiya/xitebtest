import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../utils/axiosInstance";

const AdminOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/api/admin/prescriptions/${id}`);
        setOrder(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch order.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleStatusChange = async () => {
    // If pending, go to quotation creation page
    if (order.status === "pending") {
      navigate(`/admin/prescriptions/${order.id}/quotation`);
      return;
    }

    // Otherwise, update status
    let nextStatus = null;
    if (order.status === "approved") {
      nextStatus = "delivery";
    } else if (order.status === "delivery") {
      nextStatus = "delivered";
    } else {
      return;
    }

    try {
      await api.put(`/api/admin/prescriptions/${order.id}/status`, {
        status: nextStatus,
      });
      setOrder({ ...order, status: nextStatus });
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center text-red-600 mt-10">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white rounded-2xl shadow-lg mt-10 transition-all duration-300">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-900">
        Order Summary <span className="text-blue-600">#{order.id}</span>
      </h1>

      <div className="grid md:grid-cols-2 gap-8 mb-10">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">Customer Details</h2>
          <ul className="text-gray-600 space-y-1 text-sm">
            <li><strong>Name:</strong> {order.customer?.name}</li>
            <li><strong>Email:</strong> {order.customer?.email}</li>
            <li><strong>Address:</strong> {order.customer?.address}</li>
            <li><strong>Contact:</strong> {order.customer?.contact_no}</li>
          </ul>
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">Prescription Info</h2>
          <p><strong>Status:</strong> <span className="capitalize text-blue-600">{order.status}</span></p>
          <p><strong>Note:</strong> {order.note || '-'}</p>
          <p><strong>Delivery Time:</strong> {order.delivery_time ? new Date(order.delivery_time).toLocaleString() : '-'}</p>
          <p><strong>Created At:</strong> {new Date(order.created_at).toLocaleString()}</p>
        </div>
      </div>

      {order.images?.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-4">Prescription Images</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {order.images.map((img) => (
              <img
                key={img.id}
                src={`data:image/jpeg;base64,${img.img}`}
                alt="Prescription"
                className="rounded-xl shadow-md border object-cover h-52 w-full hover:scale-105 transition-transform duration-300"
              />
            ))}
          </div>
        </div>
      )}

      <div className="mb-10 overflow-x-auto">
        <h2 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-4">Prescription List</h2>
        <table className="w-full text-sm text-left border border-gray-300 rounded-xl overflow-hidden shadow">
          <thead className="bg-blue-100 text-gray-700">
            <tr>
              <th className="px-4 py-3">Drug</th>
              <th className="px-4 py-3">Quantity</th>
              <th className="px-4 py-3">Unit Price</th>
              <th className="px-4 py-3">Total</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {order.prescription_list.map((item, idx) => (
              <tr key={idx} className="border-t hover:bg-gray-50 transition-colors">
                <td className="px-4 py-2">{item.drug_name}</td>
                <td className="px-4 py-2">{item.quantity}</td>
                <td className="px-4 py-2">LKR {item.unit_price}</td>
                <td className="px-4 py-2 font-medium">LKR {item.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-right text-2xl font-bold text-gray-900 mb-8">
        Total: <span className="text-green-600">LKR {order.total_price}</span>
      </div>

      {['pending', 'approved', 'delivery'].includes(order.status) && (
        <div className="flex justify-end mb-6">
          <button
            onClick={handleStatusChange}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors duration-300"
          >
            {order.status === 'pending' && 'Create Quotation'}
            {order.status === 'approved' && 'Mark as Delivery'}
            {order.status === 'delivery' && 'Mark as Delivered'}
          </button>
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-xl transition-colors duration-300"
        >
          ← Back
        </button>
      </div>
    </div>
  );
};

export default AdminOrderDetails;
