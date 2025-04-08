import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { getPartnerEarnings } from '../../store/slices/earningsSlice';

const Earnings = () => {
  const dispatch = useDispatch();
  const { earnings, loading } = useSelector((state) => state.earnings);

  useEffect(() => {
    dispatch(getPartnerEarnings());
  }, [dispatch]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Earnings
      </Typography>
      
      {/* Earnings Summary */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Total Earnings
            </Typography>
            <Typography variant="h4" color="primary">
              ₹{earnings.totalEarnings}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              This Month
            </Typography>
            <Typography variant="h4" color="primary">
              ₹{earnings.monthlyEarnings}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Collections Completed
            </Typography>
            <Typography variant="h4" color="primary">
              {earnings.collectionsCompleted}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Earnings History */}
      <Typography variant="h5" gutterBottom>
        Earnings History
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Collection</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {earnings.history.map((earning) => (
              <TableRow key={earning._id}>
                <TableCell>{new Date(earning.date).toLocaleDateString()}</TableCell>
                <TableCell>{earning.collection.name}</TableCell>
                <TableCell>₹{earning.amount}</TableCell>
                <TableCell>{earning.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Earnings; 