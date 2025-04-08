import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
  MenuItem,
  IconButton,
  Grid,
  Collapse,
} from '@mui/material';
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  Place,
  CalendarToday,
  Person,
} from '@mui/icons-material';
import {
  updateCollectionStatus,
  updateCollectionPrice,
  assignCollection,
} from '../store/slices/collectionSlice';

const statusColors = {
  pending: 'warning',
  assigned: 'info',
  in_progress: 'info',
  completed: 'success',
  cancelled: 'error',
};

const statusLabels = {
  pending: 'Pending',
  assigned: 'Assigned',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const wasteTypeLabels = {
  plastic: 'Plastic',
  paper: 'Paper',
  metal: 'Metal',
  glass: 'Glass',
  e_waste: 'E-Waste',
  other: 'Other',
};

const CollectionCard = ({ collection, userRole, showActions = true }) => {
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(false);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [openPriceDialog, setOpenPriceDialog] = useState(false);
  const [newPrice, setNewPrice] = useState(collection.price || 0);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleStatusChange = () => {
    dispatch(
      updateCollectionStatus({
        collectionId: collection._id,
        status: newStatus,
      })
    );
    setOpenStatusDialog(false);
  };

  const handlePriceChange = () => {
    dispatch(
      updateCollectionPrice({
        collectionId: collection._id,
        price: newPrice,
      })
    );
    setOpenPriceDialog(false);
  };

  const handleAssignCollection = () => {
    dispatch(assignCollection(collection._id));
  };

  const renderActionButtons = () => {
    if (!showActions) return null;

    if (userRole === 'mcp') {
      return (
        <>
          <Button
            size="small"
            onClick={() => {
              setOpenPriceDialog(true);
              setNewPrice(collection.price || 0);
            }}
          >
            Update Price
          </Button>
        </>
      );
    }

    if (userRole === 'pickup_partner') {
      if (collection.status === 'pending' && !collection.pickupPartner) {
        return (
          <Button size="small" variant="contained" onClick={handleAssignCollection}>
            Pickup
          </Button>
        );
      }

      if (
        collection.pickupPartner &&
        ['assigned', 'in_progress'].includes(collection.status)
      ) {
        return (
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={() => {
              setOpenStatusDialog(true);
              setNewStatus(
                collection.status === 'assigned' ? 'in_progress' : 'completed'
              );
            }}
          >
            {collection.status === 'assigned' ? 'Start Pickup' : 'Complete Pickup'}
          </Button>
        );
      }
    }

    return null;
  };

  return (
    <Card elevation={2} sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6" component="div">
              {wasteTypeLabels[collection.wasteType] || collection.wasteType}
            </Typography>
            <Chip
              label={statusLabels[collection.status] || collection.status}
              color={statusColors[collection.status] || 'default'}
              size="small"
              sx={{ ml: 2 }}
            />
          </Box>
          <Typography variant="h6" color="primary">
            ₹{collection.price || '0'}
          </Typography>
        </Box>

        <Grid container spacing={2} sx={{ mb: 1 }}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CalendarToday fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {new Date(collection.scheduledDate).toLocaleString()}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2">
                {collection.quantity} {collection.unit}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Place fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary" noWrap>
            {collection.address.street}, {collection.address.city}
          </Typography>
        </Box>

        {collection.mcp && userRole === 'pickup_partner' && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Person fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              MCP: {collection.mcp.name} ({collection.mcp.phone})
            </Typography>
          </Box>
        )}

        {collection.pickupPartner && userRole === 'mcp' && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Person fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              Partner: {collection.pickupPartner.name} ({collection.pickupPartner.phone})
            </Typography>
          </Box>
        )}
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between' }}>
        <IconButton
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
          size="small"
        >
          {expanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          <Typography variant="button" sx={{ ml: 0.5 }}>
            {expanded ? 'Less' : 'More'}
          </Typography>
        </IconButton>

        <Box>{renderActionButtons()}</Box>
      </CardActions>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Divider />
        <CardContent>
          <Typography variant="subtitle2" gutterBottom>
            Full Address
          </Typography>
          <Typography variant="body2" paragraph>
            {collection.address.street},
            <br />
            {collection.address.city}, {collection.address.state} - {collection.address.pincode}
            {collection.address.landmark && (
              <>
                <br />
                Landmark: {collection.address.landmark}
              </>
            )}
          </Typography>

          {collection.notes && (
            <>
              <Typography variant="subtitle2" gutterBottom>
                Notes
              </Typography>
              <Typography variant="body2" paragraph>
                {collection.notes}
              </Typography>
            </>
          )}

          <Typography variant="subtitle2" gutterBottom>
            Collection ID
          </Typography>
          <Typography variant="body2">{collection._id}</Typography>
        </CardContent>
      </Collapse>

      {/* Update Status Dialog */}
      <Dialog open={openStatusDialog} onClose={() => setOpenStatusDialog(false)}>
        <DialogTitle>Update Collection Status</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Status"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            fullWidth
            margin="dense"
          >
            {collection.status === 'assigned' && (
              <MenuItem value="in_progress">In Progress</MenuItem>
            )}
            {collection.status === 'in_progress' && (
              <MenuItem value="completed">Completed</MenuItem>
            )}
            {['assigned', 'in_progress'].includes(collection.status) && (
              <MenuItem value="cancelled">Cancelled</MenuItem>
            )}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenStatusDialog(false)}>Cancel</Button>
          <Button onClick={handleStatusChange} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Price Dialog */}
      <Dialog open={openPriceDialog} onClose={() => setOpenPriceDialog(false)}>
        <DialogTitle>Update Collection Price</DialogTitle>
        <DialogContent>
          <TextField
            label="Price (₹)"
            type="number"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            fullWidth
            margin="dense"
            inputProps={{ min: 0 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPriceDialog(false)}>Cancel</Button>
          <Button onClick={handlePriceChange} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default CollectionCard; 