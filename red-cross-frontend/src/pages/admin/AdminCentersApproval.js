// AdminCentersApproval.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';

const API_BASE = 'http://localhost:4000/api/centers';

export default function AdminCentersApproval() {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState(null);
  const [error, setError] = useState('');

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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Medical Centers Overview
      </Typography>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {centers.map(center => (
              <TableRow key={center._id}>
                <TableCell>{center.name}</TableCell>
                <TableCell>{center.email}</TableCell>
                <TableCell>{center.phoneNumber}</TableCell>
                <TableCell>{center.address}</TableCell>
                <TableCell>
                  {center.isApproved ? 'Approved' : 'Pending'}
                </TableCell>
                <TableCell>
                  {!center.isApproved ? (
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={approvingId === center._id}
                      onClick={() => handleApprove(center._id)}
                    >
                      {approvingId === center._id
                        ? <CircularProgress size={20} color="inherit" />
                        : 'Approve'}
                    </Button>
                  ) : (
                    <Button variant="outlined" disabled>
                      Approved
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
