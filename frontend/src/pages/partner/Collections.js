import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Check as CheckIcon,
  Clear as ClearIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { getPartnerCollections, updateCollectionStatus } from '../../store/slices/collectionSlice';

const Collections = () => {
  const dispatch = useDispatch();
  const { collections, loading, error } = useSelector((state) => state.collections);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [updateNotes, setUpdateNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    dispatch(getPartnerCollections());
  }, [dispatch]);

  const handleStatusChange = async (collectionId, status) => {
    if (status === 'completed') {
      // For completion, we need notes
      setSelectedCollection(collections.find(col => col._id === collectionId));
      setOpenDialog(true);
    } else {
      // For other status changes, just update
      try {
        await dispatch(updateCollectionStatus({ collectionId, status })).unwrap();
      } catch (err) {
        setErrorMessage(err.message || 'Failed to update status');
      }
    }
  };

  const handleCompleteCollection = async () => {
    if (!updateNotes.trim()) {
      setErrorMessage('Please provide completion notes');
      return;
    }

    try {
      await dispatch(updateCollectionStatus({
        collectionId: selectedCollection._id,
        status: 'completed',
        notes: updateNotes
      })).unwrap();
      setOpenDialog(false);
      setUpdateNotes('');
      setErrorMessage('');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'assigned':
        return 'primary';
      case 'in_progress':
        return 'warning';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
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
        My Collections
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      {collections.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="subtitle1">
            No collections assigned to you yet.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {collections.map((collection) => (
            <Grid item xs={12} key={collection._id}>
              <Paper sx={{ p: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="h6">{collection.name}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <LocationIcon fontSize="small" color="action" />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        {collection.location}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <TimeIcon fontSize="small" color="action" />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        {new Date(collection.scheduledDate).toLocaleDateString()} at{' '}
                        {collection.preferredTime || 'Any time'}
                      </Typography>
                    </Box>
                    {collection.notes && (
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mt: 1 }}>
                        <InfoIcon fontSize="small" color="action" sx={{ mt: 0.5 }} />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {collection.notes}
                        </Typography>
                      </Box>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                      <Chip
                        label={collection.status.replace('_', ' ')}
                        color={getStatusColor(collection.status)}
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                      {collection.status === 'assigned' && (
                        <>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            startIcon={<ClearIcon />}
                            onClick={() => handleStatusChange(collection._id, 'cancelled')}
                            sx={{ mr: 1 }}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            startIcon={<CheckIcon />}
                            onClick={() => handleStatusChange(collection._id, 'in_progress')}
                          >
                            Start Collection
                          </Button>
                        </>
                      )}
                      {collection.status === 'in_progress' && (
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          startIcon={<CheckIcon />}
                          onClick={() => handleStatusChange(collection._id, 'completed')}
                        >
                          Complete Collection
                        </Button>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Complete Collection</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Please provide notes about the collection completion:
          </Typography>
          <TextField
            autoFocus
            label="Completion Notes"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            value={updateNotes}
            onChange={(e) => setUpdateNotes(e.target.value)}
            margin="dense"
          />
          {errorMessage && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {errorMessage}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCompleteCollection} color="primary" variant="contained">
            Complete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Collections; 