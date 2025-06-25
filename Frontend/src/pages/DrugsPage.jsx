import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebaradmin";

const DrugsPage = () => {
  const [drugs, setDrugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state
  const [form, setForm] = useState({ id: null, name: "", price: "" });
  const [formError, setFormError] = useState("");

  // Slider state: "list" or "form"
  const [view, setView] = useState("list");

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";
  const getAuthToken = () => localStorage.getItem("token");

  const fetchDrugs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/drugs`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      });
      if (!res.ok) throw new Error(`Failed to load drugs (${res.status})`);
      const data = await res.json();
      const normalizedData = data.map(d => ({
        ...d,
        price: Number(d.price),
      }));
      setDrugs(normalizedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrugs();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!form.name.trim() || !form.price) {
      setFormError("Please fill in all fields.");
      return;
    }

    try {
      const method = form.id ? "PUT" : "POST";
      const url = form.id ? `${API_BASE}/api/drugs/${form.id}` : `${API_BASE}/api/drugs`;
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({
          name: form.name.trim(),
          price: parseFloat(form.price),
        }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || `Failed to save drug (${res.status})`);
      }
      setForm({ id: null, name: "", price: "" });
      fetchDrugs();
      setView("list");
    } catch (err) {
      setFormError(err.message);
    }
  };

  const handleEdit = (drug) => {
    setForm({ id: drug.id, name: drug.name, price: drug.price.toString() });
    setFormError("");
    setView("form");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this drug?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/drugs/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || `Failed to delete drug (${res.status})`);
      }
      fetchDrugs();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      
<div><Sidebar className="w-64 flex-shrink-0" /></div>
      {/* Main content area */}
      <div className="flex-grow p-8 max-w-7xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">Manage Drugs</h1>

        {/* Two columns: Left = slider + form, Right = drugs list */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column: Slider + Form */}
          <div className="md:w-1/3 bg-white shadow rounded-lg p-6">
            {/* Slider buttons */}
            {/* Add Drug Button Only */}
<div className="mb-6 flex justify-center">
  <button
    className="px-4 py-2 rounded bg-teal-600 text-white hover:bg-teal-700"
    onClick={() => {
      setForm({ id: null, name: "", price: "" });
      setFormError("");
      setView("form");
    }}
  >
    Add New Drug
  </button>
</div>


            {/* Form */}
            {view === "form" && (
              <>
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-4"
                >
                  <input
                    type="text"
                    name="name"
                    placeholder="Drug Name"
                    value={form.name}
                    onChange={handleChange}
                    className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                  <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={handleChange}
                    className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700 transition"
                  >
                    {form.id ? "Update Drug" : "Add Drug"}
                  </button>
                </form>
                {formError && (
                  <p className="text-red-600 mt-4 text-center font-medium">{formError}</p>
                )}
              </>
            )}

            {/* If view is list, just a message here */}
            {view === "list" && (
              <p className="text-center text-gray-500 mt-8">
                Select "View Drugs List" on the right to see drugs.
              </p>
            )}
          </div>

          {/* Right Column: Drugs List */}
          <div className="md:w-2/3 bg-white shadow rounded-lg p-6 overflow-auto max-h-[600px]">
            {loading ? (
              <p className="text-center text-gray-500">Loading drugs...</p>
            ) : error ? (
              <p className="text-center text-red-600">{error}</p>
            ) : drugs.length === 0 ? (
              <p className="text-center text-gray-500">No drugs available.</p>
            ) : (
              <table className="w-full border border-gray-300 rounded table-auto">
                <thead className="bg-teal-100">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
                    <th className="border border-gray-300 px-4 py-2 text-right">Price ($)</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {drugs.map((drug) => (
                    <tr
                      key={drug.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onDoubleClick={() => handleEdit(drug)}
                    >
                      <td className="border border-gray-300 px-4 py-2">{drug.name}</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">
                        {drug.price != null ? drug.price.toFixed(2) : "0.00"}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center space-x-4">
                        <button
                          onClick={() => handleEdit(drug)}
                          className="text-teal-600 hover:underline"
                          type="button"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(drug.id)}
                          className="text-red-600 hover:underline"
                          type="button"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrugsPage;
