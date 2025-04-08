import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
} from '@mui/material';
import { getMCPCollections } from '../../store/slices/collectionSlice';
import { getMCPPartners } from '../../store/slices/partnerSlice';
import { getMCPOrders } from '../../store/slices/orderSlice';
import { getMCPAnalytics } from '../../store/slices/analyticsSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const collections = useSelector((state) => state.collections.collections);
  const partners = useSelector((state) => state.partners.partners);
  const orders = useSelector((state) => state.orders.orders);
  const analytics = useSelector((state) => state.analytics.analytics);
  const loading = useSelector((state) => 
    state.collections.loading || 
    state.partners.loading || 
    state.orders.loading || 
    state.analytics.loading
  );

  useEffect(() => {
    dispatch(getMCPCollections());
    dispatch(getMCPPartners());
    dispatch(getMCPOrders());
    dispatch(getMCPAnalytics());
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
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Total Collections
            </Typography>
            <Typography variant="h4" color="primary">
              {analytics.totalCollections}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Active Partners
            </Typography>
            <Typography variant="h4" color="primary">
              {analytics.activePartners}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Pending Orders
            </Typography>
            <Typography variant="h4" color="primary">
              {orders.filter((order) => order.status === 'pending').length}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Monthly Revenue
            </Typography>
            <Typography variant="h4" color="primary">
              ₹{analytics.monthlyRevenue}
            </Typography>
          </Paper>
        </Grid>

        {/* Recent Collections */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Collections
            </Typography>
            {collections.slice(0, 5).map((collection) => (
              <Box key={collection._id} sx={{ mb: 2 }}>
                <Typography variant="subtitle1">{collection.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Status: {collection.status}
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Recent Orders */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Orders
            </Typography>
            {orders.slice(0, 5).map((order) => (
              <Box key={order._id} sx={{ mb: 2 }}>
                <Typography variant="subtitle1">Order #{order.orderNumber}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Status: {order.status}
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 