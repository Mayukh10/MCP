import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { store } from './store/store';
import { getUserProfile } from './store/slices/authSlice';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Dashboard Pages
import Dashboard from './pages/dashboard/Dashboard';

// MCP Pages
import Collections from './pages/mcp/Collections';
import Partners from './pages/mcp/Partners';
import Orders from './pages/mcp/Orders';
import Analytics from './pages/mcp/Analytics';
import Wallet from './pages/mcp/Wallet';

// Partner Pages
import PartnerDashboard from './pages/partner/Dashboard';
import PartnerCollections from './pages/partner/Collections';
import PartnerOrders from './pages/partner/Orders';
import PartnerEarnings from './pages/partner/Earnings';
import PartnerProfile from './pages/partner/Profile';

// Common Pages
import Profile from './pages/common/Profile';
import Notifications from './pages/common/Notifications';

// Components
import PrivateRoute from './components/PrivateRoute';
import RoleRoute from './components/RoleRoute';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Root redirect component based on user role
const RootRedirect = () => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (user?.role === 'mcp') {
    return <Navigate to="/mcp/dashboard" replace />;
  } else if (user?.role === 'partner') {
    return <Navigate to="/partner/dashboard" replace />;
  }
  
  return <Navigate to="/dashboard" replace />;
};

// App initializer to load user profile
const AppInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const { token, user } = useSelector(state => state.auth);
  
  useEffect(() => {
    if (token && !user) {
      dispatch(getUserProfile());
    }
  }, [dispatch, token, user]);
  
  return <>{children}</>;
};

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AppInitializer>
            <Routes>
              {/* Auth Routes */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
              </Route>

              {/* MCP Routes */}
              <Route element={<PrivateRoute />}>
                <Route element={<RoleRoute allowedRoles={['mcp']} />}>
                  <Route element={<MainLayout />}>
                    <Route path="/mcp/dashboard" element={<Dashboard />} />
                    <Route path="/mcp/collections" element={<Collections />} />
                    <Route path="/mcp/partners" element={<Partners />} />
                    <Route path="/mcp/orders" element={<Orders />} />
                    <Route path="/mcp/analytics" element={<Analytics />} />
                    <Route path="/mcp/wallet" element={<Wallet />} />
                  </Route>
                </Route>
              </Route>

              {/* Partner Routes */}
              <Route element={<PrivateRoute />}>
                <Route element={<RoleRoute allowedRoles={['partner']} />}>
                  <Route element={<MainLayout />}>
                    <Route path="/partner/dashboard" element={<PartnerDashboard />} />
                    <Route path="/partner/collections" element={<PartnerCollections />} />
                    <Route path="/partner/orders" element={<PartnerOrders />} />
                    <Route path="/partner/earnings" element={<PartnerEarnings />} />
                    <Route path="/partner/profile" element={<PartnerProfile />} />
                  </Route>
                </Route>
              </Route>

              {/* Common Routes */}
              <Route element={<PrivateRoute />}>
                <Route element={<MainLayout />}>
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                </Route>
              </Route>

              {/* Root redirect */}
              <Route path="/" element={<RootRedirect />} />
              
              {/* Catch all - redirect to root */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AppInitializer>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App; 