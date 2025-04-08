import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { getMCPTransactions, getTransactionSummary } from '../../store/slices/transactionSlice';
import TransactionCard from '../../components/TransactionCard';

const Transactions = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { transactions, summary, loading, error } = useSelector(
    (state) => state.transactions
  );
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(getMCPTransactions());
    dispatch(getTransactionSummary());
  }, [dispatch]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const filterTransactions = () => {
    let filtered = [...transactions];

    // Filter by tab
    if (activeTab !== 'all') {
      filtered = filtered.filter((t) => t.status === activeTab);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          (t.collection && t.collection.wasteType.toLowerCase().includes(query)) ||
          (t.paymentMethod && t.paymentMethod.toLowerCase().includes(query)) ||
          (t.pickupPartner && t.pickupPartner.name.toLowerCase().includes(query)) ||
          (t.paymentDetails &&
            t.paymentDetails.transactionId &&
            t.paymentDetails.transactionId.toLowerCase().includes(query))
      );
    }

    // Sort by date (most recent first)
    return filtered.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  };

  const filteredTransactions = filterTransactions();

  return (
    <Box sx={{ flexGrow: 1, py: 3 }}>
      <Typography variant="h4" gutterBottom>
        Transactions
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {summary && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Transaction Summary
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">Total Transactions</Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {summary.totalTransactions}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">Total Amount</Typography>
                  <Typography variant="body1" fontWeight="bold" color="primary">
                    ₹{summary.totalAmount}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Payment Methods
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {summary.byPaymentMethod && Object.keys(summary.byPaymentMethod).length > 0 ? (
                  Object.keys(summary.byPaymentMethod).map((method) => (
                    <Box
                      key={method}
                      sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
                    >
                      <Typography variant="body1" textTransform="capitalize">
                        {method.replace('_', ' ')}
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        ₹{summary.byPaymentMethod[method]}
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No payment method data available
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="All" value="all" />
          <Tab label="Pending" value="pending" />
          <Tab label="Completed" value="completed" />
          <Tab label="Failed" value="failed" />
        </Tabs>
      </Paper>

      <TextField
        fullWidth
        placeholder="Search transactions..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredTransactions.length > 0 ? (
        filteredTransactions.map((transaction) => (
          <TransactionCard
            key={transaction._id}
            transaction={transaction}
            userRole={user.role}
          />
        ))
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No transactions found.
            {activeTab !== 'all'
              ? ` There are no transactions with status '${activeTab}'.`
              : ' Complete some collections to see transactions here.'}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default Transactions; 