import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
} from '@mui/material';
import { getMCPAnalytics } from '../../store/slices/analyticsSlice';

const Analytics = () => {
  const dispatch = useDispatch();
  const { analytics, loading } = useSelector((state) => state.analytics);

  useEffect(() => {
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
        Analytics
      </Typography>

      <Grid container spacing={3}>
        {/* Collection Statistics */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Collection Statistics
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1">
                Total Collections: {analytics.totalCollections}
              </Typography>
              <Typography variant="body1">
                Active Collections: {analytics.activeCollections}
              </Typography>
              <Typography variant="body1">
                Completed Collections: {analytics.completedCollections}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Revenue Statistics */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Revenue Statistics
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1">
                Total Revenue: ₹{analytics.totalRevenue}
              </Typography>
              <Typography variant="body1">
                Monthly Revenue: ₹{analytics.monthlyRevenue}
              </Typography>
              <Typography variant="body1">
                Last Month Revenue: ₹{analytics.lastMonthRevenue}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Partner Statistics */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Partner Statistics
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1">
                Active Partners: {analytics.activePartners}
              </Typography>
              <Typography variant="body1">
                Total Partners: {analytics.totalPartners}
              </Typography>
              <Typography variant="body1">
                Avg Collections/Partner: {analytics.avgCollectionsPerPartner}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics; 