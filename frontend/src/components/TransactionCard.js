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
  MenuItem,
  IconButton,
  Collapse,
  Divider,
  Grid,
} from '@mui/material';
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  Receipt,
  Person,
  CalendarToday,
} from '@mui/icons-material';
import { updateTransactionPayment } from '../store/slices/transactionSlice';

const statusColors = {
  pending: 'warning',
  completed: 'success',
  failed: 'error',
};

const statusLabels = {
  pending: 'Pending',
  completed: 'Completed',
  failed: 'Failed',
};

const paymentMethods = [
  { value: 'cash', label: 'Cash' },
  { value: 'upi', label: 'UPI' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
];

const TransactionCard = ({ transaction, userRole }) => {
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(false);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(transaction.paymentMethod || 'cash');
  const [paymentDetails, setPaymentDetails] = useState({
    transactionId: '',
    paymentDate: new Date(),
    ...(transaction.paymentDetails || {}),
  });

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handlePaymentUpdate = () => {
    dispatch(
      updateTransactionPayment({
        transactionId: transaction._id,
        paymentMethod,
        paymentDetails,
      })
    );
    setOpenPaymentDialog(false);
  };

  const renderPaymentMethodDetails = () => {
    switch (paymentMethod) {
      case 'upi':
        return (
          <TextField
            fullWidth
            margin="dense"
            label="UPI ID"
            value={paymentDetails.upiId || ''}
            onChange={(e) =>
              setPaymentDetails({ ...paymentDetails, upiId: e.target.value })
            }
          />
        );
      case 'bank_transfer':
        return (
          <>
            <TextField
              fullWidth
              margin="dense"
              label="Bank Name"
              value={paymentDetails.bankName || ''}
              onChange={(e) =>
                setPaymentDetails({ ...paymentDetails, bankName: e.target.value })
              }
            />
            <TextField
              fullWidth
              margin="dense"
              label="Account Number"
              value={paymentDetails.accountNumber || ''}
              onChange={(e) =>
                setPaymentDetails({ ...paymentDetails, accountNumber: e.target.value })
              }
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Card elevation={2} sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6" component="div">
              {transaction.type === 'payment' ? 'Payment' : transaction.type === 'refund' ? 'Refund' : 'Commission'}
            </Typography>
            <Chip
              label={statusLabels[transaction.status] || transaction.status}
              color={statusColors[transaction.status] || 'default'}
              size="small"
              sx={{ ml: 2 }}
            />
          </Box>
          <Typography variant="h6" color="primary">
            ₹{transaction.amount}
          </Typography>
        </Box>

        <Grid container spacing={2} sx={{ mb: 1 }}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CalendarToday fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {new Date(transaction.createdAt).toLocaleString()}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Receipt fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                Method: {transaction.paymentMethod ? transaction.paymentMethod.replace('_', ' ') : 'Not specified'}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {transaction.collection && (
          <Typography variant="body2" color="text.secondary">
            Collection: {transaction.collection.wasteType} ({transaction.collection.quantity} {transaction.collection.unit})
          </Typography>
        )}

        {transaction.mcp && userRole === 'pickup_partner' && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Person fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              MCP: {transaction.mcp.name} ({transaction.mcp.phone})
            </Typography>
          </Box>
        )}

        {transaction.pickupPartner && userRole === 'mcp' && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Person fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              Partner: {transaction.pickupPartner.name} ({transaction.pickupPartner.phone})
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

        {transaction.status === 'pending' && (
          <Button
            size="small"
            variant="contained"
            onClick={() => setOpenPaymentDialog(true)}
          >
            Update Payment
          </Button>
        )}
      </CardActions>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Divider />
        <CardContent>
          <Typography variant="subtitle2" gutterBottom>
            Payment Details
          </Typography>
          {transaction.paymentDetails?.transactionId ? (
            <>
              <Typography variant="body2">
                Transaction ID: {transaction.paymentDetails.transactionId}
              </Typography>
              {transaction.paymentDetails.paymentDate && (
                <Typography variant="body2">
                  Payment Date: {new Date(transaction.paymentDetails.paymentDate).toLocaleString()}
                </Typography>
              )}
              {transaction.paymentDetails.upiId && (
                <Typography variant="body2">UPI ID: {transaction.paymentDetails.upiId}</Typography>
              )}
              {transaction.paymentDetails.bankName && (
                <Typography variant="body2">Bank: {transaction.paymentDetails.bankName}</Typography>
              )}
              {transaction.paymentDetails.accountNumber && (
                <Typography variant="body2">
                  Account: {transaction.paymentDetails.accountNumber}
                </Typography>
              )}
            </>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No payment details available
            </Typography>
          )}

          <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
            Transaction ID
          </Typography>
          <Typography variant="body2">{transaction._id}</Typography>
        </CardContent>
      </Collapse>

      {/* Update Payment Dialog */}
      <Dialog open={openPaymentDialog} onClose={() => setOpenPaymentDialog(false)}>
        <DialogTitle>Update Payment Details</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Payment Method"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            fullWidth
            margin="dense"
          >
            {paymentMethods.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            margin="dense"
            label="Transaction ID"
            value={paymentDetails.transactionId || ''}
            onChange={(e) =>
              setPaymentDetails({ ...paymentDetails, transactionId: e.target.value })
            }
          />

          {renderPaymentMethodDetails()}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPaymentDialog(false)}>Cancel</Button>
          <Button onClick={handlePaymentUpdate} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default TransactionCard; 