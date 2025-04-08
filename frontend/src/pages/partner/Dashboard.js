import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  LocalShipping,
  VerifiedUser,
  PendingActions,
  Receipt,
  ArrowForward,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { getPartnerCollections, getAvailableCollections } from '../../store/slices/collectionSlice';
import { getPartnerTransactions, getTransactionSummary } from '../../store/slices/transactionSlice';
import CollectionCard from '../../components/CollectionCard';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { collections, availableCollections, loading: collectionsLoading } = useSelector(
    (state) => state.collections
  );
  const { transactions, summary, loading: transactionsLoading } = useSelector(
    (state) => state.transactions
  );

  useEffect(() => {
    dispatch(getPartnerCollections());
    dispatch(getAvailableCollections());
    dispatch(getPartnerTransactions());
    dispatch(getTransactionSummary());
  }, [dispatch]);

  // Calculate collection statistics
  const collectionStats = {
    total: collections.length,
    assigned: collections.filter((c) => c.status === 'assigned').length,
    inProgress: collections.filter((c) => c.status === 'in_progress').length,
    completed: collections.filter((c) => c.status === 'completed').length,
  };

  const isLoading = collectionsLoading || transactionsLoading;

  return (
    <Box sx={{ flexGrow: 1, py: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1" gutterBottom color="text.secondary">
        Welcome back, {user?.name}!
      </Typography>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Statistics Cards */}
          <Grid container spacing={3} sx={{ mb: 4, mt: 2 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={2}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography color="text.secondary" gutterBottom>
                      My Collections
                    </Typography>
                    <LocalShipping color="primary" />
                  </Box>
                  <Typography variant="h4" component="div">
                    {collectionStats.total}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={2}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography color="text.secondary" gutterBottom>
                      Assigned
                    </Typography>
                    <VerifiedUser color="info" />
                  </Box>
                  <Typography variant="h4" component="div">
                    {collectionStats.assigned}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={2}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography color="text.secondary" gutterBottom>
                      In Progress
                    </Typography>
                    <PendingActions color="warning" />
                  </Box>
                  <Typography variant="h4" component="div">
                    {collectionStats.inProgress}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={2}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography color="text.secondary" gutterBottom>
                      Completed
                    </Typography>
                    <Receipt color="success" />
                  </Box>
                  <Typography variant="h4" component="div">
                    {collectionStats.completed}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Available Collections */}
          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            Available Collections
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {availableCollections.length > 0 ? (
              availableCollections.slice(0, 3).map((collection) => (
                <Grid item xs={12} md={4} key={collection._id}>
                  <CollectionCard
                    collection={collection}
                    userRole={user.role}
                  />
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    No available collections at the moment.
                  </Typography>
                </Paper>
              </Grid>
            )}
            {availableCollections.length > 3 && (
              <Grid item xs={12} sx={{ textAlign: 'right' }}>
                <Button
                  component={Link}
                  to="/partner/available"
                  endIcon={<ArrowForward />}
                >
                  View All Available Collections
                </Button>
              </Grid>
            )}
          </Grid>

          {/* Recent Collections & Earnings */}
          <Grid container spacing={3}>
            {/* Recent Collections */}
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Recent Collections
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {collections.length > 0 ? (
                  <List disablePadding>
                    {collections.slice(0, 5).map((collection) => (
                      <ListItem key={collection._id} disablePadding sx={{ py: 1 }}>
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          {collection.status === 'assigned' && <VerifiedUser color="info" />}
                          {collection.status === 'in_progress' && <PendingActions color="warning" />}
                          {collection.status === 'completed' && <Receipt color="success" />}
                        </ListItemIcon>
                        <ListItemText
                          primary={`${collection.wasteType} (${collection.quantity} ${collection.unit})`}
                          secondary={`Status: ${collection.status.replace('_', ' ')}`}
                        />
                        <Typography variant="body2" color="text.secondary">
                          ₹{collection.price}
                        </Typography>
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No collections available yet.
                  </Typography>
                )}
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    component={Link}
                    to="/partner/collections"
                    size="small"
                    endIcon={<ArrowForward />}
                  >
                    View All Collections
                  </Button>
                </Box>
              </Paper>
            </Grid>

            {/* Earnings */}
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Earnings
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {summary ? (
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body1">Total Earnings</Typography>
                      <Typography variant="body1" fontWeight="bold" color="primary">
                        ₹{summary.totalAmount}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body1">Completed Transactions</Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {summary.totalTransactions}
                      </Typography>
                    </Box>
                    {summary.byPaymentMethod && Object.keys(summary.byPaymentMethod).length > 0 && (
                      <>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle2" gutterBottom>
                          By Payment Method
                        </Typography>
                        {Object.keys(summary.byPaymentMethod).map((method) => (
                          <Box
                            key={method}
                            sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
                          >
                            <Typography variant="body2" textTransform="capitalize">
                              {method.replace('_', ' ')}
                            </Typography>
                            <Typography variant="body2">
                              ₹{summary.byPaymentMethod[method]}
                            </Typography>
                          </Box>
                        ))}
                      </>
                    )}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No earnings data available yet.
                  </Typography>
                )}
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    component={Link}
                    to="/partner/transactions"
                    size="small"
                    endIcon={<ArrowForward />}
                  >
                    View All Transactions
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default Dashboard; 