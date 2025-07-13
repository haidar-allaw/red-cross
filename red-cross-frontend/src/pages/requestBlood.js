"use client"

import { useState, useEffect, useRef } from "react"
import axios from "axios"
import "./requestBlood.css" // Custom CSS for this page

export default function RequestBloodPage() {
    const [centers, setCenters] = useState([])
    const [requestedBloodType, setRequestedBloodType] = useState("")
    const [filteredCenters, setFilteredCenters] = useState([])
    const [requestDialogOpen, setRequestDialogOpen] = useState(false)
    const [selectedHospital, setSelectedHospital] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

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

    const bloodTypes = ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"]

    useEffect(() => {
        setLoading(true)
        axios
            .get("http://localhost:4000/api/centers")
            .then(({ data }) => setCenters(data))
            .catch(() => {
                setCenters([])
                setError("Failed to load medical centers. Please try again later.")
            })
            .finally(() => setLoading(false))
    }, [])

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

    const handleRequestBlood = (center) => {
        setSelectedHospital(center)
        setRequestDialogOpen(true)
    }

    const handleCloseDialog = () => {
        setRequestDialogOpen(false)
        setSelectedHospital(null)
    }

    if (loading) {
        return (
            <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading medical centers...</p>
            </div>
        )
    }

    return (
        <div ref={pageRef} className="request-page-container">
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
                    <h1 className="page-title">Request Blood</h1>
                    <p className="page-subtitle">Select the blood type you need to see available hospitals</p>
                </div>

                {/* Request Blood Section */}
                <div className="card-section request-blood-section">
                    <div className="card-header">
                        <h2 className="card-title">Find Blood</h2>
                        <p className="card-subtitle">Choose the blood type you are looking for</p>
                    </div>
                    <div className="card-content">
                        {error && <div className="error-alert">{error}</div>}
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
