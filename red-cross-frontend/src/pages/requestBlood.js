"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function RequestBloodPage() {
  const [centers, setCenters] = useState([]);
  const [requestedBloodType, setRequestedBloodType] = useState("");
  const [filteredCenters, setFilteredCenters] = useState([]);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    patientName: "",
    contactPhone: "",
    unitsNeeded: "",
    urgency: "",
    reason: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");

  const urgencyOptions = ['Normal', 'Urgent', 'Emergency'];
  const bloodTypes = ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"];

  const pageRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Track mouse for background gradient
  useEffect(() => {
    const handleMouseMove = (e) => {
      const rect = pageRef.current?.getBoundingClientRect();
      if (rect) {
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Load centers
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:4000/api/centers")
      .then(({ data }) => setCenters(data))
      .catch(() => setError("Failed to load medical centers."))
      .finally(() => setLoading(false));
  }, []);

  // Filter centers by chosen blood type
  useEffect(() => {
    if (requestedBloodType) {
      setFilteredCenters(
        centers.filter(
          (c) =>
            Array.isArray(c.availableBloodTypes) &&
            c.availableBloodTypes.includes(requestedBloodType)
        )
      );
    } else {
      setFilteredCenters([]);
    }
  }, [requestedBloodType, centers]);

  const handleRequestBlood = (center) => {
    setSelectedHospital(center);
    setRequestDialogOpen(true);
    setError("");
    setSuccess("");
    setForm({
      patientName: "",
      contactPhone: "",
      unitsNeeded: "",
      urgency: "",
      reason: "",
    });
  };

  const handleCloseDialog = () => {
    setRequestDialogOpen(false);
    setSelectedHospital(null);
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Please login to request blood");
        setSubmitting(false);
        return;
      }

      const payload = {
        requestType: 'Individual',
        patientName: form.patientName,
        hospitalName: selectedHospital?.name,
        bloodType: requestedBloodType,
        unitsNeeded: Number(form.unitsNeeded),
        urgency: form.urgency,
        contactPhone: form.contactPhone,
        reason: form.reason,
      };

      await axios.post(
        "http://localhost:4000/api/bloodRequests/create",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("Your blood request has been submitted successfully and is waiting for medical center approval. You will be notified once a decision is made.");
      setForm({
        patientName: "",
        contactPhone: "",
        unitsNeeded: "",
        urgency: "",
        reason: "",
      });

      setTimeout(handleCloseDialog, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-blue-100 text-red-700">
        <div className="w-12 h-12 border-4 border-red-200 border-t-red-700 rounded-full animate-spin mb-4"></div>
        <p className="text-lg font-semibold">Loading medical centers...</p>
      </div>
    );
  }

  return (
    <div ref={pageRef} className="relative min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 overflow-hidden">
      {/* Animated Background (optional) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-radial from-red-100 to-transparent opacity-50"></div>
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-red-200 rounded-full animate-[float_6s_ease-in-out_infinite]"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-3xl mx-auto py-16 px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-600 shadow-lg mb-4 animate-scale-in">
            <span className="text-4xl text-white">🩸</span>
          </div>
          <h1 className="text-4xl font-extrabold text-red-600 mb-2">Request Blood</h1>
          <p className="text-gray-600">Select the blood type you need to see available hospitals</p>
        </div>

        {/* Find Blood Section */}
        <div className="bg-white bg-opacity-90 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden mb-12 animate-fade-in-up">
          <div className="bg-red-600 p-6">
            <h2 className="text-2xl font-bold text-white mb-1">Find Blood</h2>
            <p className="text-red-100">Choose the blood type you are looking for</p>
          </div>
          <div className="p-6">
            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blood Type Needed
              </label>
              <select
                value={requestedBloodType}
                onChange={(e) => setRequestedBloodType(e.target.value)}
                className="w-full border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-300"
              >
                <option value="">-- Select Blood Type --</option>
                {bloodTypes.map((bt) => (
                  <option key={bt} value={bt}>
                    {bt}
                  </option>
                ))}
              </select>
            </div>

            {requestedBloodType && (
              <div>
                <p className="text-red-600 font-medium mb-4">
                  Hospitals with {requestedBloodType} available:
                </p>

                {filteredCenters.length > 0 ? (
                  <div className="grid gap-6 sm:grid-cols-2">
                    {filteredCenters.map((center) => (
                      <div
                        key={center._id}
                        className="flex items-center justify-between bg-white rounded-xl p-4 shadow hover:shadow-lg transition"
                      >
                        <div className="flex items-center space-x-4">
                          <span className="text-2xl">🏥</span>
                          <div>
                            <h3 className="text-lg font-semibold">{center.name}</h3>
                            <p className="text-gray-500 text-sm">{center.address}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRequestBlood(center)}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition"
                        >
                          Request
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-blue-50 text-blue-700 rounded-lg">
                    No hospitals currently have this blood type available.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Request Dialog */}
        {requestDialogOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" >
            <div className="bg-white rounded-2xl w-[90%] max-w-md flex flex-col max-h-[80vh] mt-24 overflow-hidden animate-slide-in">
              {/* Header */}
              <div className="relative bg-red-50 p-6">
                <button
                  onClick={handleCloseDialog}
                  className="absolute top-4 left-4 text-gray-600 hover:text-gray-800 text-2xl"
                >
                  ×
                </button>
                <div className="text-center mb-2">
                  <h3 className="text-xl font-bold text-red-700">
                    {selectedHospital.name}
                  </h3>
                  <p className="text-sm text-gray-700">
                    📍 {selectedHospital.address}
                  </p>
                </div>
                <div className="text-center text-sm text-gray-800">
                  Requesting:{" "}
                  <span className="inline-block bg-red-600 text-white px-2 py-0.5 rounded-full font-semibold">
                    {requestedBloodType}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6 pr-4">
                <form onSubmit={handleSubmit}>
                  {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                      {error}
                    </div>
                  )}
                  {success && (
                    <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
                      {success}
                    </div>
                  )}

                  {[
                    {
                      id: "patientName",
                      icon: "👤",
                      label: "Patient Name",
                      type: "text",
                      placeholder: "Enter patient’s full name",
                    },
                    {
                      id: "contactPhone",
                      icon: "📞",
                      label: "Contact Phone",
                      type: "tel",
                      placeholder: "Enter contact number",
                    },
                    {
                      id: "unitsNeeded",
                      icon: "💧",
                      label: "Units Needed",
                      type: "number",
                      placeholder: "Number of units",
                    },
                  ].map(({ id, icon, label, type, placeholder }) => (
                    <div key={id} className="mb-4">
                      <label
                        htmlFor={id}
                        className="flex items-center gap-2 text-sm text-gray-700 mb-1"
                      >
                        <span className="text-lg">{icon}</span> {label}
                      </label>
                      <input
                        id={id}
                        name={id}
                        type={type}
                        placeholder={placeholder}
                        value={form[id]}
                        onChange={handleFormChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
                      />
                    </div>
                  ))}

                  <div className="mb-4">
                    <label
                      htmlFor="urgency"
                      className="flex items-center gap-2 text-sm text-gray-700 mb-1"
                    >
                      <span className="text-lg">⚠️</span> Urgency Level
                    </label>
                    <select
                      id="urgency"
                      name="urgency"
                      value={form.urgency}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
                    >
                      <option value="">Select urgency level</option>
                      {urgencyOptions.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="reason"
                      className="flex items-center gap-2 text-sm text-gray-700 mb-1"
                    >
                      <span className="text-lg">📋</span> Medical Reason
                    </label>
                    <textarea
                      id="reason"
                      name="reason"
                      placeholder="Brief description of medical condition or reason"
                      value={form.reason}
                      onChange={handleFormChange}
                      rows={3}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
                    />
                  </div>
                </form>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-4 bg-gray-50 p-4 border-t border-gray-200">
                <button
                  onClick={handleCloseDialog}
                  className="px-4 py-2 rounded-lg font-semibold text-gray-700 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg font-semibold bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {submitting ? "Submitting…" : "Submit Request"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
