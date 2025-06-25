import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../utils/axiosInstance";

const DrugAutocompleteInput = ({ value, onChange, allDrugs }) => {
  const [inputValue, setInputValue] = useState(value || "");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const ref = useRef();

  useEffect(() => {
    if (inputValue.trim() === "") {
      setSuggestions([]);
      return;
    }
    const filtered = allDrugs.filter((d) =>
      d.name.toLowerCase().includes(inputValue.toLowerCase())
    );
    setSuggestions(filtered);
  }, [inputValue, allDrugs]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (drug) => {
    setInputValue(drug.name);
    onChange(drug.name, Number(drug.price), drug.id);
    setShowSuggestions(false);
  };

  return (
    <div className="relative" ref={ref}>
      <input
        type="text"
        placeholder="Type drug name"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          onChange(e.target.value, 0, null);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
        className="border px-4 py-2 rounded w-full"
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 bg-white border w-full max-h-48 overflow-auto rounded shadow-md mt-1">
          {suggestions.map((drug) => (
            <li
              key={drug.id}
              className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
              onClick={() => handleSelect(drug)}
            >
              {drug.name} - ${Number(drug.price).toFixed(2)}
            </li>
          ))}
        </ul>
      )}
      {showSuggestions && suggestions.length === 0 && (
        <div className="absolute z-10 bg-white border w-full rounded mt-1 px-4 py-2 text-gray-500">
          No drugs found
        </div>
      )}
    </div>
  );
};

const AdminQuotationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [prescription, setPrescription] = useState(null);
  const [drugs, setDrugs] = useState([]);
  const [currentDrug, setCurrentDrug] = useState({
    drug_name: "",
    quantity: 1,
    unit_price: 0,
    drug_id: null,
  });
  const [allDrugs, setAllDrugs] = useState([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [presRes, drugsRes] = await Promise.all([
          api.get(`/api/admin/prescriptions/${id}`),
          api.get("/api/drugs"),
        ]);
        setPrescription(presRes.data);
        setAllDrugs(drugsRes.data);
      } catch (err) {
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAddDrug = () => {
    if (!currentDrug.drug_id || !currentDrug.drug_name) return;
    setDrugs([...drugs, { ...currentDrug }]);
    setCurrentDrug({ drug_name: "", quantity: 1, unit_price: 0, drug_id: null });
  };

  const handleSubmit = async () => {
    try {
      // Post each drug
      for (const drug of drugs) {
        await api.post("/api/prescriptionlist-items", {
          prescription_id: id,
          drug_id: drug.drug_id,
          quantity: drug.quantity,
          unit_price: drug.unit_price,
        });
      }

      // Update prescription status to quotationed
      await api.put(`/api/admin/prescriptions/${id}/status`, {
        status: "quotationed",
      });

      navigate(`/admin/orders/${id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to create quotation or update status.");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center text-red-600 mt-10">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white mt-10 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Create Quotation for Prescription #{id}
      </h1>

      {/* Image Gallery */}
      {prescription?.images?.length > 0 && (
        <div className="mb-8 border-b border-gray-200 pb-6">
          <div className="flex justify-center mb-4">
            <img
              src={`data:image/jpeg;base64,${prescription.images[mainImageIndex]?.img}`}
              alt="Main Prescription"
              className="max-h-96 rounded-xl shadow-md border object-contain"
            />
          </div>
          <div className="flex space-x-4 overflow-x-auto">
            {prescription.images.map((img, idx) => (
              <img
                key={img.id || idx}
                src={`data:image/jpeg;base64,${img.img}`}
                alt={`Thumbnail ${idx + 1}`}
                onClick={() => setMainImageIndex(idx)}
                className={`h-24 w-24 object-cover rounded-md border cursor-pointer ${
                  idx === mainImageIndex
                    ? "ring-2 ring-blue-500 scale-105"
                    : "opacity-70 hover:opacity-100"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="grid md:grid-cols-2 gap-6 mb-8 text-sm text-gray-700">
        <div className="space-y-3">
          <h2 className="font-semibold border-b pb-1">Customer Details</h2>
          <p><strong>Name:</strong> {prescription?.customer?.name || '-'}</p>
          <p><strong>Email:</strong> {prescription?.customer?.email || '-'}</p>
          <p><strong>Address:</strong> {prescription?.customer?.address || '-'}</p>
          <p><strong>Contact:</strong> {prescription?.customer?.contact_no || '-'}</p>
        </div>
        <div className="space-y-3">
          <h2 className="font-semibold border-b pb-1">Prescription Info</h2>
          <p><strong>Status:</strong> <span className="capitalize text-blue-600">{prescription?.status || '-'}</span></p>
          <p><strong>Note:</strong> {prescription?.note || "-"}</p>
          <p><strong>Delivery Time:</strong> {prescription?.delivery_time ? new Date(prescription.delivery_time).toLocaleString() : "-"}</p>
          <p><strong>Created At:</strong> {prescription?.created_at ? new Date(prescription.created_at).toLocaleString() : '-'}</p>
        </div>
      </div>

      {/* Form Input Section */}
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Add Drug</h2>
          <DrugAutocompleteInput
            value={currentDrug.drug_name}
            allDrugs={allDrugs}
            onChange={(name, price, id) => {
              setCurrentDrug({ ...currentDrug, drug_name: name, unit_price: price, drug_id: id });
            }}
          />
          <input
            type="number"
            min="1"
            value={currentDrug.quantity}
            onChange={(e) =>
              setCurrentDrug({ ...currentDrug, quantity: parseInt(e.target.value) || 1 })
            }
            placeholder="Quantity"
            className="border px-4 py-2 rounded w-full mt-2"
          />
          <input
            type="number"
            min="0"
            step="0.01"
            value={currentDrug.unit_price}
            onChange={(e) =>
              setCurrentDrug({ ...currentDrug, unit_price: parseFloat(e.target.value) || 0 })
            }
            placeholder="Unit Price"
            className="border px-4 py-2 rounded w-full mt-2"
          />
          <button
            onClick={handleAddDrug}
            className="bg-green-600 text-white px-4 py-2 rounded mt-4 hover:bg-green-700"
          >
            + Add Drug
          </button>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Added Drugs</h2>
          {drugs.length === 0 ? (
            <p className="text-gray-500">No drugs added yet.</p>
          ) : (
            <ul className="space-y-3">
              {drugs.map((d, i) => (
                <li
                  key={i}
                  className="p-4 border rounded bg-gray-50 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">{d.drug_name}</p>
                    <p className="text-sm">
                      Qty: {d.quantity}, Price: ${d.unit_price.toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setDrugs(drugs.filter((_, idx) => idx !== i))
                    }
                    className="text-red-500 hover:underline text-sm"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Submit + Back */}
      <div className="flex justify-between mt-6">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Submit Quotation
        </button>
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-600 underline hover:text-gray-900"
        >
          ← Go Back
        </button>
      </div>
    </div>
  );
};

export default AdminQuotationPage;
