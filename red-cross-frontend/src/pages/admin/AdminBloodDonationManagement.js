"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import "./adminBloodDonation.css" // Custom CSS for this page

// MUI Table Components
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import TablePagination from "@mui/material/TablePagination"

// Google Material Icons
import RefreshIcon from "@mui/icons-material/Refresh"
import SearchIcon from "@mui/icons-material/Search"
import PersonIcon from "@mui/icons-material/Person"
import LocalHospitalIcon from "@mui/icons-material/LocalHospital"
import VisibilityIcon from "@mui/icons-material/Visibility"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import CloseIcon from "@mui/icons-material/Close"
import CheckIcon from "@mui/icons-material/Check"
import ErrorIcon from "@mui/icons-material/Error"
import InfoIcon from "@mui/icons-material/Info"
import WarningIcon from "@mui/icons-material/Warning" // For expired status

const API = "http://localhost:4000/api"

export default function AdminBloodDonationManagement() {
    const [donations, setDonations] = useState([])
    const [loading, setLoading] = useState(true)
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [viewDialogOpen, setViewDialogOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [selectedDonation, setSelectedDonation] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" })
    // Removed stats state as cards are removed, but keeping fetchStats for potential future use
    // const [stats, setStats] = useState({
    //   totalDonations: 0,
    //   activeDonations: 0,
    //   expiredDonations: 0,
    //   recentDonations: 0,
    // })

    // Form state for editing
    const [editForm, setEditForm] = useState({
        bloodtype: "",
        units: "",
        status: "",
        note: "",
    })

    const bloodTypes = ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"]
    const statuses = ["scheduled", "completed", "cancelled", "expired"]

    useEffect(() => {
        fetchDonations()
        // fetchStats() // No longer needed if stats cards are removed
    }, [])

    const fetchDonations = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`${API}/blood`)
            setDonations(response.data || [])
        } catch (error) {
            console.error("Error fetching donations:", error)
            showSnackbar("Failed to fetch donations", "error")
        } finally {
            setLoading(false)
        }
    }

    // Keeping fetchStats function in case it's needed elsewhere later, but not calling it
    const fetchStats = async () => {
        try {
            const response = await axios.get(`${API}/blood/stats`)
            // setStats(response.data)
        } catch (error) {
            console.error("Error fetching stats:", error)
        }
    }

    const handleEdit = (donation) => {
        setSelectedDonation(donation)
        setEditForm({
            bloodtype: donation.bloodtype,
            units: donation.units,
            status: donation.status,
            note: donation.note || "",
        })
        setEditDialogOpen(true)
    }

    const handleView = (donation) => {
        setSelectedDonation(donation)
        setViewDialogOpen(true)
    }

    const handleDelete = (donation) => {
        setSelectedDonation(donation)
        setDeleteDialogOpen(true)
    }

    const handleEditSubmit = async () => {
        try {
            await axios.put(`${API}/blood/${selectedDonation._id}`, editForm)
            showSnackbar("Blood donation updated successfully", "success")
            setEditDialogOpen(false)
            fetchDonations()
            // fetchStats()
        } catch (error) {
            console.error("Error updating donation:", error)
            showSnackbar("Failed to update donation", "error")
        }
    }

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`${API}/blood/${selectedDonation._id}`)
            showSnackbar("Blood donation deleted successfully", "success")
            setDeleteDialogOpen(false)
            fetchDonations()
            // fetchStats()
        } catch (error) {
            console.error("Error deleting donation:", error)
            showSnackbar("Failed to delete donation", "error")
        }
    }

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity })
    }

    const filteredDonations = donations.filter(
        (donation) =>
            donation.bloodtype?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            donation.medicalCenter?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            donation.user?.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            donation.user?.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            donation.status?.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const paginatedDonations = filteredDonations.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

    const getStatusColor = (status) => {
        const colors = {
            scheduled: "status-warning",
            completed: "status-success",
            cancelled: "status-error",
            expired: "status-default",
        }
        return colors[status] || "status-default"
    }

    const getBloodTypeColor = (bloodtype) => {
        const colors = {
            "O-": "blood-error",
            "O+": "blood-warning",
            "A-": "blood-info",
            "A+": "blood-success",
            "B-": "blood-secondary",
            "B+": "blood-primary",
            "AB-": "blood-default",
            "AB+": "blood-error",
        }
        return colors[bloodtype] || "blood-default"
    }

    const isExpired = (expiryDate) => {
        return new Date(expiryDate) < new Date()
    }

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    // Removed statCards array as cards are removed

    return (
        <div className="admin-page-container">
            <div className="content-wrapper">
                {/* Header */}
                <div className="admin-header">
                    <h1 className="admin-title">Blood Donation Management</h1>
                    <button
                        className="refresh-button"
                        onClick={() => {
                            fetchDonations()
                            // fetchStats()
                        }}
                        disabled={loading}
                    >
                        <RefreshIcon className="refresh-icon" />
                        Refresh
                    </button>
                </div>

                {/* Removed Stats Cards */}

                {/* Search Bar */}
                <div className="search-bar-container">
                    <SearchIcon className="search-icon" />
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search donations by blood type, hospital, donor name, or status..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Donations Table */}
                <Paper className="table-container">
                    {loading ? (
                        <div className="loading-table-data">
                            <div className="spinner"></div>
                            <p>Loading donations...</p>
                        </div>
                    ) : paginatedDonations.length === 0 ? (
                        <div className="no-data-alert">No donations found.</div>
                    ) : (
                        <Table className="data-table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Donor</TableCell>
                                    <TableCell>Blood Type</TableCell>
                                    <TableCell>Units</TableCell>
                                    <TableCell>Hospital</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Donation Date</TableCell>
                                    <TableCell>Expiry Date</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedDonations.map((donation) => (
                                    <TableRow key={donation._id}>
                                        <TableCell>
                                            <div className="donor-info">
                                                <div className="donor-avatar">
                                                    <PersonIcon />
                                                </div>
                                                <div>
                                                    <div className="donor-name">
                                                        {donation.user?.firstname} {donation.user?.lastname}
                                                    </div>
                                                    <div className="donor-email">{donation.user?.email}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`blood-type-chip ${getBloodTypeColor(donation.bloodtype)}`}>
                                                {donation.bloodtype}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="units-text">{donation.units} units</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="hospital-cell">
                                                <LocalHospitalIcon className="hospital-icon-small" />
                                                <span className="hospital-name-small">{donation.medicalCenter?.name || "N/A"}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`status-chip ${getStatusColor(donation.status)}`}>
                                                {donation.status === "expired" && <WarningIcon className="status-icon" />}
                                                {donation.status}
                                            </span>
                                        </TableCell>
                                        <TableCell>{formatDate(donation.timestamp)}</TableCell>
                                        <TableCell>
                                            <span className={`expiry-date-text ${isExpired(donation.expirydate) ? "expired" : ""}`}>
                                                {formatDate(donation.expirydate)}
                                                {isExpired(donation.expirydate) && <span className="expiry-tag">EXPIRED</span>}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="action-buttons">
                                                <button className="action-btn view-btn" onClick={() => handleView(donation)}>
                                                    <VisibilityIcon fontSize="small" />
                                                </button>
                                                <button className="action-btn edit-btn" onClick={() => handleEdit(donation)}>
                                                    <EditIcon fontSize="small" />
                                                </button>
                                                <button className="action-btn delete-btn" onClick={() => handleDelete(donation)}>
                                                    <DeleteIcon fontSize="small" />
                                                </button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                    <TablePagination
                        component="div"
                        count={filteredDonations.length}
                        page={page}
                        onPageChange={(event, newPage) => setPage(newPage)}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={(event) => {
                            setRowsPerPage(Number.parseInt(event.target.value, 10))
                            setPage(0)
                        }}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="pagination-controls"
                    />
                </Paper>

                {/* Edit Dialog */}
                {editDialogOpen && selectedDonation && (
                    <div className="dialog-overlay">
                        <div className="dialog-content">
                            <div className="dialog-header">
                                <h3>Edit Blood Donation</h3>
                                <button className="dialog-close-btn" onClick={() => setEditDialogOpen(false)}>
                                    <CloseIcon />
                                </button>
                            </div>
                            <div className="dialog-body">
                                <div className="form-group">
                                    <label htmlFor="edit-bloodtype" className="input-label">
                                        Blood Type
                                    </label>
                                    <div className="select-wrapper">
                                        <select
                                            id="edit-bloodtype"
                                            value={editForm.bloodtype}
                                            onChange={(e) => setEditForm({ ...editForm, bloodtype: e.target.value })}
                                            className="custom-select"
                                        >
                                            {bloodTypes.map((type) => (
                                                <option key={type} value={type}>
                                                    {type}
                                                </option>
                                            ))}
                                        </select>
                                        <span className="select-arrow">▼</span>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="edit-units" className="input-label">
                                        Units
                                    </label>
                                    <input
                                        id="edit-units"
                                        type="number"
                                        value={editForm.units}
                                        onChange={(e) => setEditForm({ ...editForm, units: e.target.value })}
                                        className="custom-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="edit-status" className="input-label">
                                        Status
                                    </label>
                                    <div className="select-wrapper">
                                        <select
                                            id="edit-status"
                                            value={editForm.status}
                                            onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                                            className="custom-select"
                                        >
                                            {statuses.map((status) => (
                                                <option key={status} value={status}>
                                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                        <span className="select-arrow">▼</span>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="edit-note" className="input-label">
                                        Note
                                    </label>
                                    <textarea
                                        id="edit-note"
                                        value={editForm.note}
                                        onChange={(e) => setEditForm({ ...editForm, note: e.target.value })}
                                        className="custom-textarea"
                                        rows="3"
                                    ></textarea>
                                </div>
                            </div>
                            <div className="dialog-actions">
                                <button className="dialog-cancel-btn" onClick={() => setEditDialogOpen(false)}>
                                    Cancel
                                </button>
                                <button className="dialog-confirm-btn" onClick={handleEditSubmit}>
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* View Dialog */}
                {viewDialogOpen && selectedDonation && (
                    <div className="dialog-overlay">
                        <div className="dialog-content view-dialog">
                            <div className="dialog-header">
                                <h3>Blood Donation Details</h3>
                                <button className="dialog-close-btn" onClick={() => setViewDialogOpen(false)}>
                                    <CloseIcon />
                                </button>
                            </div>
                            <div className="dialog-body">
                                <div className="detail-section">
                                    <h4 className="section-title">Donor Information</h4>
                                    <div className="donor-detail-card">
                                        <div className="donor-avatar-large">
                                            <PersonIcon />
                                        </div>
                                        <div className="donor-text-details">
                                            <div className="detail-item">
                                                <strong>Name:</strong> {selectedDonation.user?.firstname} {selectedDonation.user?.lastname}
                                            </div>
                                            <div className="detail-item">
                                                <strong>Email:</strong> {selectedDonation.user?.email}
                                            </div>
                                            <div className="detail-item">
                                                <strong>Phone:</strong> {selectedDonation.user?.phoneNumber || "N/A"}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="detail-section">
                                    <h4 className="section-title">Donation Details</h4>
                                    <div className="details-grid">
                                        <div className="detail-item">
                                            <strong>Blood Type:</strong>{" "}
                                            <span className={`blood-type-chip ${getBloodTypeColor(selectedDonation.bloodtype)}`}>
                                                {selectedDonation.bloodtype}
                                            </span>
                                        </div>
                                        <div className="detail-item">
                                            <strong>Units:</strong> {selectedDonation.units} units
                                        </div>
                                        <div className="detail-item">
                                            <strong>Status:</strong>{" "}
                                            <span className={`status-chip ${getStatusColor(selectedDonation.status)}`}>
                                                {selectedDonation.status === "expired" && <WarningIcon className="status-icon" />}
                                                {selectedDonation.status}
                                            </span>
                                        </div>
                                        <div className="detail-item">
                                            <strong>Donation ID:</strong> <span className="monospace-text">{selectedDonation._id}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="detail-section">
                                    <h4 className="section-title">Hospital Information</h4>
                                    <div className="hospital-detail-card">
                                        <LocalHospitalIcon className="hospital-icon-large" />
                                        <div className="hospital-text-details">
                                            <div className="detail-item">
                                                <strong>Name:</strong> {selectedDonation.medicalCenter?.name || "N/A"}
                                            </div>
                                            <div className="detail-item">
                                                <strong>Address:</strong> {selectedDonation.medicalCenter?.address || "N/A"}
                                            </div>
                                            <div className="detail-item">
                                                <strong>Phone:</strong> {selectedDonation.medicalCenter?.phoneNumber || "N/A"}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="detail-section">
                                    <h4 className="section-title">Important Dates</h4>
                                    <div className="details-grid">
                                        <div className="detail-item">
                                            <strong>Donation Date:</strong> {formatDate(selectedDonation.timestamp)}
                                        </div>
                                        <div className="detail-item">
                                            <strong>Expiry Date:</strong>{" "}
                                            <span className={`expiry-date-text ${isExpired(selectedDonation.expirydate) ? "expired" : ""}`}>
                                                {formatDate(selectedDonation.expirydate)}
                                                {isExpired(selectedDonation.expirydate) && <span className="expiry-tag">EXPIRED</span>}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {selectedDonation.note && (
                                    <div className="detail-section">
                                        <h4 className="section-title">Notes</h4>
                                        <div className="note-box">{selectedDonation.note}</div>
                                    </div>
                                )}
                            </div>
                            <div className="dialog-actions">
                                <button className="dialog-cancel-btn" onClick={() => setViewDialogOpen(false)}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Dialog */}
                {deleteDialogOpen && selectedDonation && (
                    <div className="dialog-overlay">
                        <div className="dialog-content">
                            <div className="dialog-header">
                                <h3>Confirm Delete</h3>
                                <button className="dialog-close-btn" onClick={() => setDeleteDialogOpen(false)}>
                                    <CloseIcon />
                                </button>
                            </div>
                            <div className="dialog-body">
                                <p className="delete-warning-text">
                                    Are you sure you want to delete this blood donation record? This action cannot be undone.
                                </p>
                                <div className="delete-summary-box">
                                    <p>
                                        <strong>Donor:</strong> {selectedDonation.user?.firstname} {selectedDonation.user?.lastname}
                                    </p>
                                    <p>
                                        <strong>Blood Type:</strong> {selectedDonation.bloodtype} ({selectedDonation.units} units)
                                    </p>
                                    <p>
                                        <strong>Hospital:</strong> {selectedDonation.medicalCenter?.name}
                                    </p>
                                </div>
                            </div>
                            <div className="dialog-actions">
                                <button className="dialog-cancel-btn" onClick={() => setDeleteDialogOpen(false)}>
                                    Cancel
                                </button>
                                <button className="dialog-delete-btn" onClick={handleDeleteConfirm}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Snackbar */}
                {snackbar.open && (
                    <div className={`snackbar ${snackbar.severity}`}>
                        <div className="snackbar-content">
                            {snackbar.severity === "success" && <CheckIcon />}
                            {snackbar.severity === "error" && <ErrorIcon />}
                            {snackbar.severity === "info" && <InfoIcon />}
                            {snackbar.message}
                        </div>
                        <button className="snackbar-close-btn" onClick={() => setSnackbar({ ...snackbar, open: false })}>
                            <CloseIcon />
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
