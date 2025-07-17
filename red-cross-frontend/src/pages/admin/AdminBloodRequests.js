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
  Visibility as ViewIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Bloodtype as BloodtypeIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import axios from 'axios';

const API = 'http://localhost:4000/api';

export default function AdminBloodRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/bloodRequests/getAll`);
      setRequests(data || []);
    } catch (err) {
      console.error(err);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (req) => {
    setSelectedRequest(req);
    setViewDialogOpen(true);
  };

  // filter by patientName, bloodType, urgency or reason
  const filtered = requests.filter((r) =>
    r.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.bloodType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.urgency.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.reason || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#B71C1C' }}>
          Blood Requests Management
        </Typography>
        <Button
          variant="outlined"
          onClick={fetchRequests}
          disabled={loading}
          startIcon={<RefreshIcon />}
        >
          Refresh
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by patient, blood type, urgency or reason..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />
      </Paper>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Patient</TableCell>
                <TableCell>Blood Type</TableCell>
                <TableCell>Units</TableCell>
                <TableCell>Urgency</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Requested At</TableCell>
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
              ) : paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body1" color="text.secondary">
                      No blood requests found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((req) => (
                  <TableRow key={req._id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ bgcolor: '#B71C1C' }}>
                          <PersonIcon />
                        </Avatar>
                        <Typography variant="subtitle2">{req.patientName}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={req.bloodType}
                        size="small"
                        icon={<BloodtypeIcon fontSize="small" />}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{req.unitsNeeded}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={req.urgency} size="small" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{req.reason}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(req.createdAt).toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="View Details">
                        <IconButton size="small" onClick={() => handleView(req)}>
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
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
          count={filtered.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>

      {/* View Details Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Request Details</DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <Box sx={{ display: 'grid', gap: 2, mt: 1 }}>
              <Typography variant="h6">{selectedRequest.patientName}</Typography>
              <Typography><strong>Blood Type:</strong> {selectedRequest.bloodType}</Typography>
              <Typography><strong>Units Needed:</strong> {selectedRequest.unitsNeeded}</Typography>
              <Typography><strong>Urgency:</strong> {selectedRequest.urgency}</Typography>
              <Typography><strong>Contact Phone:</strong> {selectedRequest.contactPhone}</Typography>
              <Typography><strong>Reason:</strong> {selectedRequest.reason}</Typography>
              <Typography>
                <strong>Requested At:</strong>{' '}
                {new Date(selectedRequest.createdAt).toLocaleString()}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
  