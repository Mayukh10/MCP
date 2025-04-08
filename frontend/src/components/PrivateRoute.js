import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

function PrivateRoute() {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  // If auth is still loading, you might want to show a loading indicator
  if (loading) {
    return null; // Or a loading spinner
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the child routes
  return <Outlet />;
}

export default PrivateRoute; 