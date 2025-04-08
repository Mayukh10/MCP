import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Chip,
} from '@mui/material';
import { getMCPPartners } from '../../store/slices/partnerSlice';

const PickupPartners = () => {
  const dispatch = useDispatch();
  const { partners, loading } = useSelector((state) => state.partners);

  useEffect(() => {
    dispatch(getMCPPartners());
  }, [dispatch]);

  const handleStatusChange = (partnerId, newStatus) => {
    // TODO: Implement status change
    console.log('Change status for partner:', partnerId, 'to:', newStatus);
  };

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
        Pickup Partners
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Collections Completed</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {partners.map((partner) => (
              <TableRow key={partner._id}>
                <TableCell>{partner.name}</TableCell>
                <TableCell>{partner.email}</TableCell>
                <TableCell>{partner.phone}</TableCell>
                <TableCell>
                  <Chip
                    label={partner.status}
                    color={
                      partner.status === 'active'
                        ? 'success'
                        : partner.status === 'inactive'
                        ? 'error'
                        : 'warning'
                    }
                  />
                </TableCell>
                <TableCell>{partner.collectionsCompleted}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => handleStatusChange(partner._id, 'active')}
                  >
                    {partner.status === 'active' ? 'Deactivate' : 'Activate'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PickupPartners; 