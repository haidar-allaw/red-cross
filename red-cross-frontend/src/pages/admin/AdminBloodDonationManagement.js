"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import "./adminBloodDonation.css" // Custom CSS for this page

// MUI Table Components
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Chip,
  Tooltip,
  Avatar,
  CircularProgress,
  TablePagination,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  LocalHospital as LocalHospitalIcon,
  Person as PersonIcon,
  Warning as WarningIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
  Check as CheckIcon,
  Error as ErrorIcon,
  Info as InfoIcon
} from '@mui/icons-material';

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
            scheduled: "warning",
            completed: "success",
            cancelled: "error",
            expired: "default",
        }
        return colors[status] || "default"
    }

    const getBloodTypeColor = (bloodtype) => {
        const colors = {
            "O-": "error",
            "O+": "warning",
            "A-": "info",
            "A+": "success",
            "B-": "secondary",
            "B+": "primary",
            "AB-": "default",
            "AB+": "error",
        }
        return colors[bloodtype] || "default"
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
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#B71C1C' }}>
                    Blood Donation Management
                </Typography>
                <Button
                    variant="outlined"
                    onClick={fetchDonations}
                    disabled={loading}
                >
                    Refresh
                </Button>
            </Box>

            {/* Search Bar */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search donations by blood type, hospital, donor name, or status..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </Paper>

            {/* Donations Table */}
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer>
                    <Table stickyHeader>
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
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={8} align="center">
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : paginatedDonations.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} align="center">
                                        <Typography variant="body1" color="text.secondary">
                                            No donations found
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedDonations.map((donation) => (
                                    <TableRow key={donation._id} hover>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Avatar sx={{ bgcolor: '#B71C1C' }}>
                                                    <PersonIcon />
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="subtitle2">
                                                        {donation.user?.firstname} {donation.user?.lastname}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {donation.user?.email}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={donation.bloodtype}
                                                color={getBloodTypeColor(donation.bloodtype)}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">{donation.units} units</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <LocalHospitalIcon fontSize="small" color="primary" />
                                                <Typography variant="body2">
                                                    {donation.medicalCenter?.name || "N/A"}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={donation.status}
                                                color={getStatusColor(donation.status)}
                                                size="small"
                                                icon={donation.status === "expired" ? <WarningIcon fontSize="small" /> : null}
                                            />
                                        </TableCell>
                                        <TableCell>{formatDate(donation.timestamp)}</TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color={isExpired(donation.expirydate) ? 'error' : 'inherit'}>
                                                {formatDate(donation.expirydate)}
                                                {isExpired(donation.expirydate) && (
                                                    <Chip label="EXPIRED" color="error" size="small" sx={{ ml: 1 }} />
                                                )}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Tooltip title="View Details">
                                                    <IconButton size="small" onClick={() => handleView(donation)} color="primary">
                                                        <ViewIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Edit Donation">
                                                    <IconButton size="small" onClick={() => handleEdit(donation)} color="warning">
                                                        <EditIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete Donation">
                                                    <IconButton size="small" onClick={() => handleDelete(donation)} color="error">
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredDonations.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(event, newPage) => setPage(newPage)}
                    onRowsPerPageChange={(event) => {
                        setRowsPerPage(parseInt(event.target.value, 10));
                        setPage(0);
                    }}
                />
            </Paper>

            {/* Edit Dialog */}
            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Edit Blood Donation</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                        <TextField
                            label="Blood Type"
                            select
                            value={editForm.bloodtype}
                            onChange={(e) => setEditForm({ ...editForm, bloodtype: e.target.value })}
                            fullWidth
                            SelectProps={{ native: true }}
                        >
                            {bloodTypes.map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </TextField>
                        <TextField
                            label="Units"
                            type="number"
                            value={editForm.units}
                            onChange={(e) => setEditForm({ ...editForm, units: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Status"
                            select
                            value={editForm.status}
                            onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                            fullWidth
                            SelectProps={{ native: true }}
                        >
                            {statuses.map((status) => (
                                <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                            ))}
                        </TextField>
                        <TextField
                            label="Note"
                            value={editForm.note}
                            onChange={(e) => setEditForm({ ...editForm, note: e.target.value })}
                            fullWidth
                            multiline
                            rows={3}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleEditSubmit} variant="contained" color="primary">
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>

            {/* View Dialog */}
            <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Blood Donation Details</DialogTitle>
                <DialogContent>
                    {selectedDonation && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <Avatar sx={{ bgcolor: '#B71C1C', width: 60, height: 60 }}>
                                    <PersonIcon />
                                </Avatar>
                                <Box>
                                    <Typography variant="h6">
                                        {selectedDonation.user?.firstname} {selectedDonation.user?.lastname}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Donor ID: {selectedDonation.user?._id}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                                    <Typography variant="body1">{selectedDonation.user?.email}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">Phone</Typography>
                                    <Typography variant="body1">{selectedDonation.user?.phoneNumber || 'N/A'}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">Blood Type</Typography>
                                    <Chip
                                        label={selectedDonation.bloodtype}
                                        color={getBloodTypeColor(selectedDonation.bloodtype)}
                                        size="small"
                                    />
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">Units</Typography>
                                    <Typography variant="body1">{selectedDonation.units}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                                    <Chip
                                        label={selectedDonation.status}
                                        color={getStatusColor(selectedDonation.status)}
                                        size="small"
                                        icon={selectedDonation.status === "expired" ? <WarningIcon fontSize="small" /> : null}
                                    />
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">Donation Date</Typography>
                                    <Typography variant="body1">{formatDate(selectedDonation.timestamp)}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">Expiry Date</Typography>
                                    <Typography variant="body1" color={isExpired(selectedDonation.expirydate) ? 'error' : 'inherit'}>
                                        {formatDate(selectedDonation.expirydate)}
                                        {isExpired(selectedDonation.expirydate) && (
                                            <Chip label="EXPIRED" color="error" size="small" sx={{ ml: 1 }} />
                                        )}
                                    </Typography>
                                </Box>
                                <Box sx={{ gridColumn: '1 / -1' }}>
                                    <Typography variant="subtitle2" color="text.secondary">Note</Typography>
                                    <Typography variant="body1">{selectedDonation.note || 'N/A'}</Typography>
                                </Box>
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>

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
        </Box>
    );
}
