import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

function RoleRoute({ allowedRoles }) {
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  // Show loading or nothing while authentication is being checked
  if (loading) {
    return null;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If user is null, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user role is in the allowed roles
  if (!allowedRoles.includes(user.role)) {
    // Redirect to dashboard if role doesn't match
    if (user.role === 'mcp') {
      return <Navigate to="/mcp/dashboard" replace />;
    } else if (user.role === 'partner') {
      return <Navigate to="/partner/dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // If user has allowed role, render the child routes
  return <Outlet />;
}

RoleRoute.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default RoleRoute;