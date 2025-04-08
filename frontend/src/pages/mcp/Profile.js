import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Divider,
  Avatar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import { Edit, AccountCircle, ExitToApp } from '@mui/icons-material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { logout } from '../../store/slices/authSlice';

const profileValidationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    .required('Phone number is required'),
});

const passwordValidationSchema = Yup.object({
  currentPassword: Yup.string().required('Current password is required'),
  newPassword: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isEditMode, setIsEditMode] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleUpdateProfile = (values, { setSubmitting }) => {
    // Simulating API call for profile update
    setTimeout(() => {
      // In a real app, dispatch an action to update profile
      console.log('Profile updated:', values);
      setSuccessMessage('Profile updated successfully');
      setIsEditMode(false);
      setSubmitting(false);
    }, 1000);
  };

  const handleUpdatePassword = (values, { setSubmitting, resetForm }) => {
    // Simulating API call for password update
    setTimeout(() => {
      // In a real app, dispatch an action to update password
      console.log('Password updated:', values);
      setSuccessMessage('Password updated successfully');
      setOpenPasswordDialog(false);
      setSubmitting(false);
      resetForm();
    }, 1000);
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage('');
  };

  return (
    <Box sx={{ flexGrow: 1, py: 3 }}>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Avatar
              sx={{ width: 100, height: 100, margin: '0 auto 16px', bgcolor: 'primary.main' }}
            >
              <AccountCircle fontSize="large" />
            </Avatar>
            <Typography variant="h5" gutterBottom>
              {user?.name}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {user?.email}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Role: {user?.role === 'mcp' ? 'MCP Owner' : 'Pickup Partner'}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Button
              variant="outlined"
              color="primary"
              startIcon={<Edit />}
              onClick={() => setIsEditMode(true)}
              sx={{ mr: 1 }}
              disabled={isEditMode}
            >
              Edit Profile
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<ExitToApp />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {isEditMode ? 'Edit Profile' : 'Profile Information'}
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Formik
              initialValues={{
                name: user?.name || '',
                email: user?.email || '',
                phone: user?.phone || '',
              }}
              validationSchema={profileValidationSchema}
              onSubmit={handleUpdateProfile}
            >
              {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
                <Form>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Name"
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.name && Boolean(errors.name)}
                        helperText={touched.name && errors.name}
                        disabled={!isEditMode}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
                        disabled={!isEditMode}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Phone"
                        name="phone"
                        value={values.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.phone && Boolean(errors.phone)}
                        helperText={touched.phone && errors.phone}
                        disabled={!isEditMode}
                        margin="normal"
                      />
                    </Grid>
                  </Grid>

                  {isEditMode && (
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                      <Button
                        variant="outlined"
                        onClick={() => setIsEditMode(false)}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Box>
                        <Button
                          variant="outlined"
                          onClick={() => setOpenPasswordDialog(true)}
                          sx={{ mr: 1 }}
                          disabled={isSubmitting}
                        >
                          Change Password
                        </Button>
                        <Button
                          type="submit"
                          variant="contained"
                          disabled={isSubmitting}
                          startIcon={isSubmitting && <CircularProgress size={20} />}
                        >
                          Save Changes
                        </Button>
                      </Box>
                    </Box>
                  )}
                </Form>
              )}
            </Formik>
          </Paper>
        </Grid>
      </Grid>

      {/* Change Password Dialog */}
      <Dialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <Formik
          initialValues={{
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
          }}
          validationSchema={passwordValidationSchema}
          onSubmit={handleUpdatePassword}
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
            <Form>
              <DialogContent>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Current Password"
                  name="currentPassword"
                  type="password"
                  value={values.currentPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.currentPassword && Boolean(errors.currentPassword)}
                  helperText={touched.currentPassword && errors.currentPassword}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="New Password"
                  name="newPassword"
                  type="password"
                  value={values.newPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.newPassword && Boolean(errors.newPassword)}
                  helperText={touched.newPassword && errors.newPassword}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Confirm New Password"
                  name="confirmPassword"
                  type="password"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                  helperText={touched.confirmPassword && errors.confirmPassword}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenPasswordDialog(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  startIcon={isSubmitting && <CircularProgress size={20} />}
                >
                  Update Password
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </Box>
  );
};

export default Profile; 