// AdminCentersApproval.jsx
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
  Check as CheckIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import axios from 'axios';

const API_BASE = 'http://localhost:4000/api/centers';

export default function AdminCentersApproval() {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState(null);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [centerToDelete, setCenterToDelete] = useState(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_BASE}/all`);
      setCenters(data);
    } catch (err) {
      setError('Failed to load centers');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setApprovingId(id);
    try {
      await axios.patch(`${API_BASE}/${id}/approve`);
      setCenters(centers.map(c =>
        c._id === id ? { ...c, isApproved: true } : c
      ));
    } catch (err) {
      setError('Approval failed');
    } finally {
      setApprovingId(null);
    }
  };

  const requestDelete = (center) => {
    setCenterToDelete(center);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!centerToDelete) return;
    setDeletingId(centerToDelete._id);
    try {
      await axios.delete(`${API_BASE}/${centerToDelete._id}`);
      setCenters(centers.filter(c => c._id !== centerToDelete._id));
      if (selectedCenter && selectedCenter._id === centerToDelete._id) setViewDialogOpen(false);
      setDeleteDialogOpen(false);
      setCenterToDelete(null);
    } catch (err) {
      setError('Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  const handleView = (center) => {
    setSelectedCenter(center);
    setViewDialogOpen(true);
  };

  const filteredCenters = centers.filter(center =>
    center.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    center.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    center.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedCenters = filteredCenters.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#B71C1C' }}>
          Medical Centers Overview
        </Typography>
        <Button
          variant="outlined"
          onClick={fetchAll}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search centers by name, email, or address..."
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
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Center</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : paginatedCenters.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body1" color="text.secondary">
                      No centers found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedCenters.map(center => (
                  <TableRow key={center._id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: '#B71C1C' }}>{center.name?.charAt(0)}</Avatar>
                        <Box>
                          <Typography variant="subtitle2">{center.name}</Typography>
                          <Typography variant="caption" color="text.secondary">ID: {center._id}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{center.email}</TableCell>
                    <TableCell>{center.phoneNumber}</TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>{center.address || 'N/A'}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={center.isApproved ? 'Approved' : 'Pending'}
                        color={center.isApproved ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="View Details">
                          <IconButton size="small" onClick={() => handleView(center)} color="primary">
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        {!center.isApproved && (
                          <Tooltip title="Approve Center">
                            <span>
                              <IconButton
                                size="small"
                                color="success"
                                disabled={approvingId === center._id}
                                onClick={() => handleApprove(center._id)}
                              >
                                {approvingId === center._id ? <CircularProgress size={20} color="inherit" /> : <CheckIcon />}
                              </IconButton>
                            </span>
                          </Tooltip>
                        )}
                        <Tooltip title="Delete Center">
                          <span>
                            <IconButton
                              size="small"
                              color="error"
                              disabled={deletingId === center._id}
                              onClick={() => requestDelete(center)}
                            >
                              {deletingId === center._id ? <CircularProgress size={20} color="inherit" /> : <DeleteIcon />}
                            </IconButton>
                          </span>
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
          count={filteredCenters.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>
      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Center Details</DialogTitle>
        <DialogContent>
          {selectedCenter && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar sx={{ bgcolor: '#B71C1C', width: 60, height: 60 }}>{selectedCenter.name?.charAt(0)}</Avatar>
                <Box>
                  <Typography variant="h6">{selectedCenter.name}</Typography>
                  <Typography variant="body2" color="text.secondary">Center ID: {selectedCenter._id}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                  <Typography variant="body1">{selectedCenter.email}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Phone</Typography>
                  <Typography variant="body1">{selectedCenter.phoneNumber}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Address</Typography>
                  <Typography variant="body1">{selectedCenter.address}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                  <Chip
                    label={selectedCenter.isApproved ? 'Approved' : 'Pending'}
                    color={selectedCenter.isApproved ? 'success' : 'warning'}
                    size="small"
                  />
                </Box>
              </Box>
              {/* Hospital Card Image */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Hospital Card Image
                </Typography>
                {selectedCenter.hospitalCardImage ? (
                  <img
                    src={`http://localhost:4000/${selectedCenter.hospitalCardImage.replace(/\\/g, '/')}`}
                    alt="Hospital Card"
                    style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 8, border: '1px solid #eee' }}
                  />
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No hospital card image uploaded.
                  </Typography>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          {selectedCenter && (
            <Button
              color="error"
              onClick={() => requestDelete(selectedCenter)}
              disabled={deletingId === selectedCenter._id}
              startIcon={deletingId === selectedCenter._id ? <CircularProgress size={16} color="inherit" /> : <DeleteIcon />}
            >
              Delete
            </Button>
          )}
        </DialogActions>
      </Dialog>
      {/* Confirm Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete the medical center <b>{centerToDelete?.name}</b>? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={deletingId === centerToDelete?._id}>Cancel</Button>
          <Button onClick={handleDelete} color="error" disabled={deletingId === centerToDelete?._id} startIcon={deletingId === centerToDelete?._id ? <CircularProgress size={16} color="inherit" /> : <DeleteIcon />}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
