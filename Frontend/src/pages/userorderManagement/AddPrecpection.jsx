import { useState } from "react";
import { FiPlusCircle, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import ConfirmWrapper from "../../components/ConfirmWrapper";
import { useAuth } from "../../context/AuthContext";

const AddPrescription = () => {
  const navigate = useNavigate();
  const { name, role } = useAuth();

  const [formData, setFormData] = useState({
    note: "",
    delivery_address: "",
    delivery_date: "",
    delivery_time: "",
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const tooLarge = newFiles.filter((file) => file.size > 50 * 1024);

    if (tooLarge.length > 0) {
      setError("❌ One or more images exceed 50KB. Please choose smaller images.");
      return;
    }

    setImages((prev) => [...prev, ...newFiles]);
    setError(null);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (loading) return;

    const { delivery_address, delivery_date, delivery_time } = formData;

    if (!delivery_address || !delivery_date || !delivery_time) {
      setError("❌ Please fill in all required fields.");
      return;
    }

    if (images.length === 0) {
      setError("❌ Please upload at least one image.");
      return;
    }

    const oversized = images.filter((img) => img.size > 50 * 1024);
    if (oversized.length > 0) {
      setError("❌ All images must be smaller than 50KB.");
      return;
    }

    setError(null);
    setShowConfirm(true);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    const fullDateTime = `${formData.delivery_date} ${formData.delivery_time}`;

    const body = new FormData();
    body.append("note", formData.note);
    body.append("delivery_address", formData.delivery_address);
    body.append("delivery_time", fullDateTime);
    images.forEach((img, i) => {
      body.append(`images[${i}]`, img);
    });

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/prescriptions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body,
      });

      if (res.ok) {
        setShowSuccess(true);
        setFormData({
          note: "",
          delivery_address: "",
          delivery_date: "",
          delivery_time: "",
        });
        setImages([]);
      } else {
        let message = "Something went wrong.";
        try {
          const errorData = await res.json();
          message = errorData.message || message;
        } catch {
          const text = await res.text();
          message = text || message;
        }
        setError(message);
      }
    } catch (err) {
      console.error("Error:", err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          📄 Add New Prescription
        </h2>

        {showSuccess && (
          <div className="bg-green-100 text-green-700 px-4 py-3 rounded mb-4 text-center border border-green-400">
            ✅ Prescription submitted successfully!
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4 text-center border border-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="space-y-5">
          {/* Delivery Address */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Delivery Address<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="delivery_address"
              placeholder="Enter delivery address"
              value={formData.delivery_address}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Delivery Date */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Delivery Date<span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="delivery_date"
              value={formData.delivery_date}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Delivery Time */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Delivery Time<span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              name="delivery_time"
              value={formData.delivery_time}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Notes (optional)</label>
            <textarea
              name="note"
              placeholder="Write any additional notes here..."
              value={formData.note}
              onChange={handleChange}
              rows="3"
              className="w-full p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Upload Prescription Images<span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              name="images"
              multiple
              accept="image/png, image/jpeg"
              onChange={handleImageChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required={images.length === 0}
            />
            <p className="text-sm text-gray-500 mt-1">
              Upload JPG/PNG images under 50KB each. You can upload multiple files.
            </p>

            {images.length > 0 && (
              <ul className="mt-3 space-y-2">
                {images.map((file, idx) => (
                  <li
                    key={idx}
                    className="flex justify-between items-center text-sm bg-gray-100 p-2 rounded"
                  >
                    <span className="truncate max-w-[70%]">
                      {file.name} — {(file.size / 1024).toFixed(1)}KB
                    </span>
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="text-red-500 hover:text-red-700"
                      title="Remove"
                    >
                      <FiTrash2 />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Confirm and Submit */}
          <ConfirmWrapper
            open={showConfirm}
            message="Confirm Prescription Submission"
            additionalInfo="Double-check delivery date, time, address and uploaded images."
            confirmText="Yes, Submit"
            cancelText="Cancel"
            icon={<FiPlusCircle />}
            buttonBackgroundColor="bg-blue-600"
            buttonTextColor="text-white"
            onConfirm={() => {
              setShowConfirm(false);
              handleSubmit();
            }}
            onCancel={() => setShowConfirm(false)}
          >
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Prescription"}
            </button>
          </ConfirmWrapper>

          <button
            type="button"
            onClick={() => navigate("/order-management")}
            className="w-full mt-2 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPrescription;
