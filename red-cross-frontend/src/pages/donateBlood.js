"use client"

import { useState, useEffect, useRef } from "react"
import axios from "axios"
import "./donateBlood.css" // Custom CSS for this page

export default function DonateBloodPage() {
  const [centers, setCenters] = useState([])
  const [loadingCenters, setLoadingCenters] = useState(true)
  const [form, setForm] = useState({
    medicalCenter: "",
    bloodtype: "",
    units: "",
    date: "",
    time: "", // Add time field
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const bloodTypes = ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"]
  const [requestedBloodType, setRequestedBloodType] = useState("")
  const [filteredCenters, setFilteredCenters] = useState([])
  const [requestDialogOpen, setRequestDialogOpen] = useState(false)
  const [selectedHospital, setSelectedHospital] = useState(null)

  const pageRef = useRef(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      const rect = pageRef.current?.getBoundingClientRect()
      if (rect) {
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        })
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // fetch list of approved centers
  useEffect(() => {
    setLoadingCenters(true)
    axios
      .get("http://localhost:4000/api/centers")
      .then(({ data }) => setCenters(data))
      .catch(() => setCenters([]))
      .finally(() => setLoadingCenters(false))
  }, [])

  // Filter centers when requestedBloodType changes
  useEffect(() => {
    if (requestedBloodType) {
      setFilteredCenters(
        centers.filter(
          (c) => Array.isArray(c.availableBloodTypes) && c.availableBloodTypes.includes(requestedBloodType),
        ),
      )
    } else {
      setFilteredCenters([])
    }
  }, [requestedBloodType, centers])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setSubmitting(true)
    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        setError("Please login to donate blood")
        return
      }
      console.log("Submitting donation with token:", token)
      const response = await axios.post(
        "http://localhost:4000/api/blood/donate",
        {
          medicalCenter: form.medicalCenter,
          bloodtype: form.bloodtype,
          unit: Number(form.units),
          timestamp: form.date + "T" + form.time, // Combine date and time for backend
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      console.log("Donation response:", response.data)
      setSuccess("Thank you for your donation! Your appointment has been scheduled.")
      setForm({ medicalCenter: "", bloodtype: "", units: "", date: "", time: "" })
    } catch (err) {
      setError(err.response?.data?.message || "Submission failed")
    } finally {
      setSubmitting(false)
    }
  }

  const handleRequestBlood = (center) => {
    setSelectedHospital(center)
    setRequestDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setRequestDialogOpen(false)
    setSelectedHospital(null)
  }

  if (loadingCenters) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Loading medical centers...</p>
      </div>
    )
  }

  return (
    <div ref={pageRef} className="donate-page-container">
      {/* Animated Background */}
      <div className="page-background">
        <div className="gradient-overlay"></div>
        <div
          className="mouse-gradient"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(211,47,47,0.1) 0%, transparent 50%)`,
          }}
        ></div>
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="floating-shape"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="content-wrapper">
        {/* Page Header */}
        <div className="page-header">
          <div className="icon-circle">
            <span className="blood-drop-icon">🩸</span>
          </div>
          <h1 className="page-title">Donate Blood</h1>
          <p className="page-subtitle">Your donation can save up to three lives. Every drop counts.</p>
        </div>

        {/* Request Blood Section */}
        <div className="card-section request-blood-section">
          <div className="card-header">
            <h2 className="card-title">Request Blood</h2>
            <p className="card-subtitle">Select the blood type you need to see available hospitals</p>
          </div>
          <div className="card-content">
            <div className="input-group">
              <label htmlFor="requestedBloodType" className="input-label">
                Blood Type Needed
              </label>
              <div className="select-wrapper">
                <select
                  id="requestedBloodType"
                  value={requestedBloodType}
                  onChange={(e) => setRequestedBloodType(e.target.value)}
                  className="custom-select"
                >
                  <option value="">-- Select Blood Type --</option>
                  {bloodTypes.map((bt) => (
                    <option key={bt} value={bt}>
                      {bt}
                    </option>
                  ))}
                </select>
                <span className="select-arrow">▼</span>
              </div>
            </div>

            {requestedBloodType && (
              <div className="hospital-list-container">
                <p className="hospital-list-title">Hospitals with {requestedBloodType} available:</p>
                {filteredCenters.length > 0 ? (
                  <div className="hospital-grid">
                    {filteredCenters.map((center) => (
                      <div key={center._id} className="hospital-card">
                        <div className="hospital-info">
                          <span className="hospital-icon">🏥</span>
                          <div>
                            <h3 className="hospital-name">{center.name}</h3>
                            <p className="hospital-address">{center.address}</p>
                          </div>
                        </div>
                        <button className="request-btn" onClick={() => handleRequestBlood(center)}>
                          Request Blood
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="info-alert">No hospitals currently have this blood type available.</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Donation Form Section */}
        <div className="card-section donation-form-section">
          <div className="card-header">
            <h2 className="card-title">Donation Form</h2>
            <p className="card-subtitle">Please fill in the details below to schedule your blood donation</p>
          </div>
          <div className="card-content">
            {error && <div className="error-alert">{error}</div>}
            {success && <div className="success-alert">{success}</div>}

            <form onSubmit={handleSubmit} className="donation-form">
              <div className="form-grid">
                <div className="input-group">
                  <label htmlFor="medicalCenter" className="input-label">
                    Medical Center
                  </label>
                  <div className="select-wrapper">
                    <select
                      id="medicalCenter"
                      name="medicalCenter"
                      value={form.medicalCenter}
                      onChange={handleChange}
                      required
                      className="custom-select"
                    >
                      <option value="">-- Select Medical Center --</option>
                      {centers.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <span className="select-arrow">▼</span>
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="bloodtype" className="input-label">
                    Blood Type
                  </label>
                  <div className="select-wrapper">
                    <select
                      id="bloodtype"
                      name="bloodtype"
                      value={form.bloodtype}
                      onChange={handleChange}
                      required
                      className="custom-select"
                    >
                      <option value="">-- Select Blood Type --</option>
                      {bloodTypes.map((bt) => (
                        <option key={bt} value={bt}>
                          {bt}
                        </option>
                      ))}
                    </select>
                    <span className="select-arrow">▼</span>
                  </div>
                </div>

                <div className="input-group full-width">
                  <label htmlFor="units" className="input-label">
                    Units (ml)
                  </label>
                  <input
                    type="number"
                    id="units"
                    name="units"
                    value={form.units}
                    onChange={handleChange}
                    required
                    className="custom-input"
                    placeholder="e.g., 450"
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="date" className="input-label">
                    Date of Donation
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                    className="custom-input"
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="time" className="input-label">
                    Time of Donation
                  </label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                    required
                    className="custom-input"
                  />
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={submitting}>
                {submitting ? (
                  <span className="button-spinner"></span>
                ) : (
                  <>
                    <span className="btn-icon">✅</span>
                    Submit Donation
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Request Blood Dialog */}
        {requestDialogOpen && (
          <div className="dialog-overlay">
            <div className="dialog-content">
              <div className="dialog-header">
                <h3>Request Blood</h3>
                <button className="dialog-close-btn" onClick={handleCloseDialog}>
                  &times;
                </button>
              </div>
              <div className="dialog-body">
                {selectedHospital && (
                  <>
                    <h4 className="dialog-hospital-name">{selectedHospital.name}</h4>
                    <p className="dialog-hospital-address">{selectedHospital.address}</p>
                    <p className="dialog-message">
                      You are requesting <b>{requestedBloodType}</b> blood from this hospital.
                    </p>
                    <p className="dialog-note">Please contact the hospital directly or visit for urgent needs.</p>
                  </>
                )}
              </div>
              <div className="dialog-actions">
                <button className="dialog-close-action-btn" onClick={handleCloseDialog}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="page-footer-text">
          <p>Thank you for making a difference in someone's life</p>
        </div>
      </div>
    </div>
  )
}
