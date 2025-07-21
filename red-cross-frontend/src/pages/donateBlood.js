'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './donateBlood.css'; // Custom CSS for this page

export default function DonateBloodPage() {
  const [centers, setCenters] = useState([]);
  const [loadingCenters, setLoadingCenters] = useState(true);
  const [form, setForm] = useState({
    medicalCenter: '',
    bloodtype: '',
    units: '',
    date: '',
    time: '', // Add time field
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const bloodTypes = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
  const [neededBloodData, setNeededBloodData] = useState([]);


  const pageRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // fetch list of approved centers
  useEffect(() => {
    setLoadingCenters(true);
    axios
      .get('http://localhost:4000/api/centers')
      .then(({ data }) => {
        setCenters(data);
        const needed = data
          .filter(center => center.neededBloodTypes && center.neededBloodTypes.length > 0)
          .map(center => ({
            _id: center._id,
            name: center.name,
            neededBloodTypes: center.neededBloodTypes
          }));
        setNeededBloodData(needed);
      })
      .catch(() => setCenters([]))
      .finally(() => setLoadingCenters(false));
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Please login to donate blood');
        return;
      }
      console.log('Submitting donation with token:', token);
      const response = await axios.post(
        'http://localhost:4000/api/blood/donate',
        {
          medicalCenter: form.medicalCenter,
          bloodtype: form.bloodtype,
          units: Number(form.units), // Corrected from `unit`
          timestamp: form.date + 'T' + form.time, // Combine date and time for backend
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Donation response:', response.data);
      setSuccess(
        'Thank you for your donation! Your appointment has been scheduled.'
      );
      setForm({
        medicalCenter: '',
        bloodtype: '',
        units: '',
        date: '',
        time: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingCenters) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Loading medical centers...</p>
      </div>
    );
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
          <p className="page-subtitle">
            Your donation can save up to three lives. Every drop counts.
          </p>
        </div>

        {/* Donation Form Section */}
        <div className="card-section donation-form-section">
          <div className="card-header">
            <h2 className="card-title">Donation Form</h2>
            <p className="card-subtitle">
              Please fill in the details below to schedule your blood donation
            </p>
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

              <button
                type="submit"
                className="submit-btn"
                disabled={submitting}
              >
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

        {neededBloodData.length > 0 && (
          <div className="card-section needed-blood-section">
            <div className="card-header">
              <h2 className="card-title">Hospitals in Need</h2>
              <p className="card-subtitle">
                These centers have an urgent need for the following blood types:
              </p>
            </div>
            <div className="card-content">
              <div className="needed-blood-grid">
                {neededBloodData.slice(0, 3).map((center) => (
                  <div key={center._id} className="needed-blood-card">
                    <h3 className="hospital-name">{center.name}</h3>
                    <ul className="blood-type-list">
                      {center.neededBloodTypes.map((blood) => (
                        <li key={blood.type} className="blood-type-item">
                          <span className="blood-type-tag">{blood.type}</span>
                          <span className="quantity-needed">{blood.quantity} units</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              {neededBloodData.length > 3 && (
                <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                  <a href="/all-needed-blood" className="submit-btn" style={{ textDecoration: 'none', display: 'inline-block', width: 'auto', padding: '0.8rem 1.5rem' }}>
                    View More Hospitals
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="page-footer-text">
          <p>Thank you for making a difference in someone's life</p>
        </div>
      </div>
    </div>
  );
}
