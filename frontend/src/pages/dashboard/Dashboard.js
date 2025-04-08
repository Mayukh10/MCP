import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Card,
  CardContent,
  useTheme,
  LinearProgress,
  Fade,
} from '@mui/material';
import {
  TrendingUp,
  LocalShipping,
  AccountBalanceWallet,
  People,
  Refresh,
} from '@mui/icons-material';
import { getMCPStats } from '../../store/slices/statsSlice';
import { getMCPPartners } from '../../store/slices/partnerSlice';
import { getMCPWallet } from '../../store/slices/walletSlice';

const StatCard = ({ title, value, icon, color, description = null }) => {
  const theme = useTheme();
  
  return (
    <Card 
      elevation={0} 
      sx={{ 
        height: '100%',
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: theme.shadows[4],
        },
      }}
    >
      <CardContent sx={{ height: '100%', p: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'flex-start', 
          justifyContent: 'space-between',
          mb: 2
        }}>
          <Typography 
            color="textSecondary" 
            variant="subtitle2" 
            fontWeight="medium"
            sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}
          >
            {title}
          </Typography>
          <Box
            sx={{
              backgroundColor: `${color}15`,
              borderRadius: '50%',
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
        </Box>
        <Typography variant="h4" component="div" fontWeight="bold" sx={{ mb: 1 }}>
          {value}
        </Typography>
        {description && (
          <Typography variant="body2" color="textSecondary">
            {description}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { user } = useSelector((state) => state.auth);
  
  // Using optional chaining to handle potentially undefined state slices
  const stats = useSelector((state) => state.stats?.stats) || {};
  const statsLoading = useSelector((state) => state.stats?.loading) || false;
  const statsError = useSelector((state) => state.stats?.error);
  
  const partners = useSelector((state) => state.partner?.partners) || [];
  const partnersLoading = useSelector((state) => state.partner?.loading) || false;
  const partnersError = useSelector((state) => state.partner?.error);
  
  const balance = useSelector((state) => state.wallet?.wallet?.balance) || 0;
  const totalEarnings = useSelector((state) => state.wallet?.wallet?.totalEarnings) || 0;
  const walletLoading = useSelector((state) => state.wallet?.loading) || false;
  const walletError = useSelector((state) => state.wallet?.error);

  const isLoading = statsLoading || partnersLoading || walletLoading;

  useEffect(() => {
    loadData();
  }, [dispatch, user]);

  // Combine all errors to display
  useEffect(() => {
    const newErrors = {};
    if (statsError) newErrors.stats = statsError;
    if (partnersError) newErrors.partners = partnersError;
    if (walletError) newErrors.wallet = walletError;
    setErrors(newErrors);
  }, [statsError, partnersError, walletError]);

  const loadData = () => {
    console.log('Loading dashboard data...');
    setIsRefreshing(true);
    
    try {
      if (user?.role === 'mcp') {
        Promise.all([
          dispatch(getMCPStats()),
          dispatch(getMCPPartners()),
          dispatch(getMCPWallet())
        ])
        .catch(err => console.error('Dashboard data loading error:', err))
        .finally(() => setIsRefreshing(false));
      } else {
        setIsRefreshing(false);
      }
    } catch (err) {
      console.error('Dashboard data loading error:', err);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadData();
  };

  if (isLoading && !isRefreshing) {
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
          Loading dashboard data...
        </Typography>
      </Box>
    );
  }

  // Format the amount with the Indian Rupee symbol and thousands separator
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

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
          Dashboard
        </Typography>
        <Button 
          startIcon={<Refresh />} 
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
      </Box>
      
      {/* Error displays */}
      <Fade in={Object.keys(errors).length > 0}>
        <Box sx={{ mb: 3 }}>
          {Object.entries(errors).map(([key, message]) => (
            <Alert 
              key={key} 
              severity="error" 
              sx={{ 
                mb: 1,
                borderRadius: 2,
              }}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}: {message}
            </Alert>
          ))}
        </Box>
      </Fade>

      <Grid container spacing={3}>
        {/* Statistics Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Collections"
            value={stats?.totalCollections || 0}
            description="All collection requests"
            icon={<TrendingUp sx={{ color: '#1976d2' }} />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Pickups"
            value={stats?.activePickups || 0}
            description="Currently in progress"
            icon={<LocalShipping sx={{ color: '#2e7d32' }} />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Wallet Balance"
            value={formatCurrency(balance)}
            description={`Total earnings: ${formatCurrency(totalEarnings)}`}
            icon={<AccountBalanceWallet sx={{ color: '#ed6c02' }} />}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Partners"
            value={partners?.length || 0}
            description="Pickup partners"
            icon={<People sx={{ color: '#9c27b0' }} />}
            color="#9c27b0"
          />
        </Grid>

        {/* Collection Data Table */}
        <Grid item xs={12}>
          <Card 
            elevation={0} 
            sx={{ 
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Typography 
                variant="h6" 
                fontWeight="medium" 
                color="textPrimary" 
                gutterBottom
                sx={{ mb: 2 }}
              >
                Daily Collections
              </Typography>
              
              <TableContainer sx={{ 
                maxHeight: 350,
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
                      <TableCell sx={{ 
                        fontWeight: 600, 
                        backgroundColor: theme.palette.background.paper 
                      }}>
                        Date
                      </TableCell>
                      <TableCell 
                        align="right" 
                        sx={{ 
                          fontWeight: 600, 
                          backgroundColor: theme.palette.background.paper 
                        }}
                      >
                        Amount
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats?.dailyCollections?.map((collection) => (
                      <TableRow 
                        key={collection.date}
                        hover
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                          transition: 'background-color 0.2s',
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {new Date(collection.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </TableCell>
                        <TableCell align="right">
                          {formatCurrency(collection.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!stats?.dailyCollections || stats.dailyCollections.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={2} align="center" sx={{ py: 4 }}>
                          <Typography color="textSecondary">
                            No collection data available
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 