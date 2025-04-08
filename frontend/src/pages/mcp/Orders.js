import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  CircularProgress,
  Alert,
  Tooltip,
  useTheme,
  LinearProgress,
  Fade,
} from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { getMCPOrders, createOrder, updateOrderStatus, resetSuccess } from '../../store/slices/orderSlice';

const statusColors = {
  pending: 'warning',
  processing: 'info',
  completed: 'success',
  cancelled: 'error',
};

const wasteTypes = [
  { value: 'Plastic', rate: 15 },
  { value: 'Paper', rate: 10 },
  { value: 'Cardboard', rate: 8 },
  { value: 'Metal', rate: 30 },
  { value: 'E-waste', rate: 50 },
  { value: 'Glass', rate: 12 },
  { value: 'Organic', rate: 5 },
];

const OrdersPage = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { orders, loading, error, createSuccess, updateSuccess } = useSelector((state) => state.orders);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [orderFormData, setOrderFormData] = useState({
    customerName: '',
    pickupDate: '',
    items: [{ type: 'Plastic', weight: 0, rate: 15, amount: 0 }],
  });

  useEffect(() => {
    loadOrders();
  }, [dispatch]);

  useEffect(() => {
    if (createSuccess) {
      setOpenCreateDialog(false);
      resetOrderForm();
      dispatch(resetSuccess());
    }
    if (updateSuccess) {
      setOpenStatusDialog(false);
      dispatch(resetSuccess());
    }
  }, [createSuccess, updateSuccess, dispatch]);

  const loadOrders = () => {
    setIsRefreshing(true);
    dispatch(getMCPOrders())
      .finally(() => setIsRefreshing(false));
  };

  const handleRefresh = () => {
    loadOrders();
  };

  const handleCreateDialogOpen = () => {
    resetOrderForm();
    setOpenCreateDialog(true);
  };

  const handleCreateDialogClose = () => {
    setOpenCreateDialog(false);
  };

  const resetOrderForm = () => {
    setOrderFormData({
      customerName: '',
      pickupDate: new Date().toISOString().split('T')[0],
      items: [{ type: 'Plastic', weight: 0, rate: 15, amount: 0 }],
    });
  };

  const handleOrderFormChange = (e) => {
    const { name, value } = e.target;
    setOrderFormData({
      ...orderFormData,
      [name]: value,
    });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...orderFormData.items];
    
    if (field === 'type') {
      const selectedType = wasteTypes.find(type => type.value === value);
      newItems[index] = {
        ...newItems[index],
        type: value,
        rate: selectedType.rate,
      };
    } else {
      newItems[index][field] = value;
    }
    
    // Recalculate amount if weight or rate changed
    if (field === 'weight' || field === 'rate') {
      newItems[index].amount = newItems[index].weight * newItems[index].rate;
    }
    
    setOrderFormData({
      ...orderFormData,
      items: newItems,
    });
  };

  const addItem = () => {
    setOrderFormData({
      ...orderFormData,
      items: [
        ...orderFormData.items,
        { type: 'Plastic', weight: 0, rate: 15, amount: 0 },
      ],
    });
  };

  const removeItem = (index) => {
    if (orderFormData.items.length === 1) return;
    
    const newItems = [...orderFormData.items];
    newItems.splice(index, 1);
    
    setOrderFormData({
      ...orderFormData,
      items: newItems,
    });
  };

  const calculateTotals = () => {
    return orderFormData.items.reduce(
      (totals, item) => {
        return {
          weight: totals.weight + Number(item.weight || 0),
          amount: totals.amount + Number(item.amount || 0),
        };
      },
      { weight: 0, amount: 0 }
    );
  };

  const handleCreateOrder = () => {
    const totals = calculateTotals();
    
    const orderData = {
      ...orderFormData,
      totalWeight: totals.weight,
      totalAmount: totals.amount,
      pickupDate: new Date(orderFormData.pickupDate).toISOString(),
    };
    
    dispatch(createOrder(orderData));
  };

  const handleStatusDialogOpen = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setOpenStatusDialog(true);
  };

  const handleStatusDialogClose = () => {
    setOpenStatusDialog(false);
  };

  const handleStatusChange = (e) => {
    setNewStatus(e.target.value);
  };

  const handleUpdateStatus = () => {
    if (selectedOrder && newStatus) {
      dispatch(updateOrderStatus({ orderId: selectedOrder._id, status: newStatus }));
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading && !isRefreshing) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
        }}
      >
        <CircularProgress size={40} thickness={4} sx={{ mb: 2 }} />
        <Typography variant="body1" color="textSecondary">
          Loading orders...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      flexGrow: 1, 
      p: { xs: 2, md: 3 },
      backgroundColor: theme.palette.background.default,
    }}>
      {isRefreshing && (
        <LinearProgress 
          sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            height: 3,
            borderRadius: 0
          }} 
        />
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 600,
            color: theme.palette.text.primary,
          }}
        >
          Orders
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            startIcon={<RefreshIcon />} 
            variant="outlined"
            color="primary"
            onClick={handleRefresh}
            disabled={isRefreshing}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            Refresh
          </Button>
          <Button 
            startIcon={<AddIcon />} 
            variant="contained"
            color="primary"
            onClick={handleCreateDialogOpen}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            Create Order
          </Button>
        </Box>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <Card 
        elevation={0} 
        sx={{ 
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <TableContainer sx={{ 
            overflow: 'auto',
            maxHeight: 'calc(100vh - 220px)',
            '&::-webkit-scrollbar': {
              width: '8px',
              height: '8px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: theme.palette.divider,
              borderRadius: '8px',
            },
          }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: theme.palette.background.paper }}>Order #</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: theme.palette.background.paper }}>Customer</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: theme.palette.background.paper }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: theme.palette.background.paper }}>Total Weight</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: theme.palette.background.paper }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: theme.palette.background.paper }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: theme.palette.background.paper }} align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography color="textSecondary">
                        No orders found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <TableRow 
                      key={order._id}
                      hover
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                        transition: 'background-color 0.2s',
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {order.orderNumber}
                        </Typography>
                      </TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell>
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </TableCell>
                      <TableCell>{order.totalWeight} kg</TableCell>
                      <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
                      <TableCell>
                        <Chip 
                          label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          color={statusColors[order.status]}
                          size="small"
                          sx={{ fontWeight: 500 }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Update Status">
                          <IconButton 
                            size="small"
                            onClick={() => handleStatusDialogOpen(order)}
                            color="primary"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Create Order Dialog */}
      <Dialog 
        open={openCreateDialog} 
        onClose={handleCreateDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="medium">Create New Order</Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                name="customerName"
                label="Customer Name"
                value={orderFormData.customerName}
                onChange={handleOrderFormChange}
                fullWidth
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="pickupDate"
                label="Pickup Date"
                type="date"
                value={orderFormData.pickupDate || new Date().toISOString().split('T')[0]}
                onChange={handleOrderFormChange}
                fullWidth
                required
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>

          <Typography variant="subtitle1" fontWeight="medium" sx={{ mt: 3, mb: 2 }}>
            Order Items
          </Typography>

          {orderFormData.items.map((item, index) => (
            <Box key={index} sx={{ mb: 2, p: 2, borderRadius: 1, bgcolor: 'background.default' }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={3}>
                  <TextField
                    select
                    label="Waste Type"
                    value={item.type}
                    onChange={(e) => handleItemChange(index, 'type', e.target.value)}
                    fullWidth
                    required
                  >
                    {wasteTypes.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.value}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    label="Weight (kg)"
                    type="number"
                    value={item.weight}
                    onChange={(e) => handleItemChange(index, 'weight', Number(e.target.value))}
                    fullWidth
                    required
                    inputProps={{ min: 0, step: 0.1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    label="Rate (₹/kg)"
                    value={item.rate}
                    onChange={(e) => handleItemChange(index, 'rate', Number(e.target.value))}
                    fullWidth
                    required
                    inputProps={{ min: 0 }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="Amount (₹)"
                    value={(item.weight * item.rate).toFixed(2)}
                    fullWidth
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => removeItem(index)}
                    disabled={orderFormData.items.length === 1}
                    fullWidth
                  >
                    Remove
                  </Button>
                </Grid>
              </Grid>
            </Box>
          ))}

          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={addItem}
            sx={{ mt: 1 }}
          >
            Add Item
          </Button>

          <Box sx={{ mt: 3, p: 2, borderRadius: 1, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">
                  Total Weight: {calculateTotals().weight.toFixed(2)} kg
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">
                  Total Amount: {formatCurrency(calculateTotals().amount)}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleCreateDialogClose} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleCreateOrder} 
            variant="contained" 
            color="primary"
            disabled={loading || orderFormData.customerName === '' || calculateTotals().weight <= 0}
          >
            {loading ? 'Creating...' : 'Create Order'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog 
        open={openStatusDialog} 
        onClose={handleStatusDialogClose}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="medium">Update Order Status</Typography>
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            select
            label="Status"
            value={newStatus}
            onChange={handleStatusChange}
            fullWidth
            margin="normal"
          >
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="processing">Processing</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleStatusDialogClose} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleUpdateStatus} 
            variant="contained" 
            color="primary"
            disabled={loading || !newStatus}
          >
            {loading ? 'Updating...' : 'Update Status'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrdersPage; 