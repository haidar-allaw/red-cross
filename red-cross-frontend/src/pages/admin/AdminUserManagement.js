import React, { useState, useEffect } from 'react';
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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Avatar,
    Tooltip,
    Alert,
    Snackbar,
    CircularProgress,
    TablePagination,
    InputAdornment
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
    Search as SearchIcon,
    Refresh as RefreshIcon,
    Person as PersonIcon
} from '@mui/icons-material';
import axios from 'axios';

const API = 'http://localhost:4000/api';

export default function AdminUserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Form state for editing
    const [editForm, setEditForm] = useState({
        firstname: '',
        lastname: '',
        email: '',
        phoneNumber: '',
        role: '',
        bloodtype: '',
        address: ''
    });

    const bloodTypes = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
    const roles = ['user', 'admin'];

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API}/users/getAll`);
            setUsers(response.data.users || []);
        } catch (error) {
            console.error('Error fetching users:', error);
            showSnackbar('Failed to fetch users', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setEditForm({
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            bloodtype: user.bloodtype || '',
            address: user.address || ''
        });
        setEditDialogOpen(true);
    };

    const handleView = (user) => {
        setSelectedUser(user);
        setViewDialogOpen(true);
    };

    const handleDelete = (user) => {
        setSelectedUser(user);
        setDeleteDialogOpen(true);
    };

    const handleEditSubmit = async () => {
        try {
            await axios.put(`${API}/users/${selectedUser._id}`, editForm);
            showSnackbar('User updated successfully', 'success');
            setEditDialogOpen(false);
            fetchUsers();
        } catch (error) {
            console.error('Error updating user:', error);
            showSnackbar('Failed to update user', 'error');
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`${API}/users/${selectedUser._id}`);
            showSnackbar('User deleted successfully', 'success');
            setDeleteDialogOpen(false);
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            showSnackbar('Failed to delete user', 'error');
        }
    };

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const filteredUsers = users.filter(user =>
        user.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phoneNumber?.includes(searchTerm)
    );

    const paginatedUsers = filteredUsers.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    const getRoleColor = (role) => {
        return role === 'admin' ? 'error' : 'primary';
    };

    const getBloodTypeColor = (bloodtype) => {
        const colors = {
            'O-': 'error',
            'O+': 'warning',
            'A-': 'info',
            'A+': 'success',
            'B-': 'secondary',
            'B+': 'primary',
            'AB-': 'default',
            'AB+': 'error'
        };
        return colors[bloodtype] || 'default';
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#B71C1C' }}>
                    User Management
                </Typography>
                <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={fetchUsers}
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
                    placeholder="Search users by name, email, or phone..."
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

            {/* Users Table */}
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>User</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Phone</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell>Blood Type</TableCell>
                                <TableCell>Address</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : paginatedUsers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">
                                        <Typography variant="body1" color="text.secondary">
                                            No users found
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedUsers.map((user) => (
                                    <TableRow key={user._id} hover>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Avatar sx={{ bgcolor: '#B71C1C' }}>
                                                    <PersonIcon />
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="subtitle2">
                                                        {user.firstname} {user.lastname}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        ID: {user._id}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.phoneNumber}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={user.role}
                                                color={getRoleColor(user.role)}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {user.bloodtype && (
                                                <Chip
                                                    label={user.bloodtype}
                                                    color={getBloodTypeColor(user.bloodtype)}
                                                    size="small"
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                                                {user.address || 'N/A'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Tooltip title="View Details">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleView(user)}
                                                        color="primary"
                                                    >
                                                        <ViewIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Edit User">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleEdit(user)}
                                                        color="warning"
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete User">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleDelete(user)}
                                                        color="error"
                                                    >
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
                    count={filteredUsers.length}
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
                <DialogTitle>Edit User</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                        <TextField
                            label="First Name"
                            value={editForm.firstname}
                            onChange={(e) => setEditForm({ ...editForm, firstname: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Last Name"
                            value={editForm.lastname}
                            onChange={(e) => setEditForm({ ...editForm, lastname: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Email"
                            type="email"
                            value={editForm.email}
                            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Phone Number"
                            value={editForm.phoneNumber}
                            onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                            fullWidth
                        />
                        <FormControl fullWidth>
                            <InputLabel>Role</InputLabel>
                            <Select
                                value={editForm.role}
                                onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                                label="Role"
                            >
                                {roles.map((role) => (
                                    <MenuItem key={role} value={role}>
                                        {role.charAt(0).toUpperCase() + role.slice(1)}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel>Blood Type</InputLabel>
                            <Select
                                value={editForm.bloodtype}
                                onChange={(e) => setEditForm({ ...editForm, bloodtype: e.target.value })}
                                label="Blood Type"
                            >
                                <MenuItem value="">None</MenuItem>
                                {bloodTypes.map((type) => (
                                    <MenuItem key={type} value={type}>
                                        {type}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            label="Address"
                            value={editForm.address}
                            onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
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
                <DialogTitle>User Details</DialogTitle>
                <DialogContent>
                    {selectedUser && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <Avatar sx={{ bgcolor: '#B71C1C', width: 60, height: 60 }}>
                                    <PersonIcon />
                                </Avatar>
                                <Box>
                                    <Typography variant="h6">
                                        {selectedUser.firstname} {selectedUser.lastname}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        User ID: {selectedUser._id}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                                    <Typography variant="body1">{selectedUser.email}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">Phone</Typography>
                                    <Typography variant="body1">{selectedUser.phoneNumber}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">Role</Typography>
                                    <Chip
                                        label={selectedUser.role}
                                        color={getRoleColor(selectedUser.role)}
                                        size="small"
                                    />
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">Blood Type</Typography>
                                    {selectedUser.bloodtype ? (
                                        <Chip
                                            label={selectedUser.bloodtype}
                                            color={getBloodTypeColor(selectedUser.bloodtype)}
                                            size="small"
                                        />
                                    ) : (
                                        <Typography variant="body1">Not specified</Typography>
                                    )}
                                </Box>
                                <Box sx={{ gridColumn: '1 / -1' }}>
                                    <Typography variant="subtitle2" color="text.secondary">Address</Typography>
                                    <Typography variant="body1">
                                        {selectedUser.address || 'Not specified'}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">Created</Typography>
                                    <Typography variant="body1">
                                        {new Date(selectedUser.createdAt).toLocaleDateString()}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">Last Updated</Typography>
                                    <Typography variant="body1">
                                        {new Date(selectedUser.updatedAt).toLocaleDateString()}
                                    </Typography>
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
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete user "{selectedUser?.firstname} {selectedUser?.lastname}"?
                        This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
} 