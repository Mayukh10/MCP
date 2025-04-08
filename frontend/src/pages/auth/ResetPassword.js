import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  TextField,
  Button,
  Link,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  Box,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';

const validationSchema = Yup.object({
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    // Extract token from query params
    const params = new URLSearchParams(location.search);
    const tokenParam = params.get('token');
    
    if (!tokenParam) {
      setStatus({
        type: 'error',
        message: 'Invalid or missing reset token. Please request a new password reset link.',
      });
    } else {
      setToken(tokenParam);
    }
  }, [location]);

  const handleSubmit = async (values, { setSubmitting }) => {
    if (!token) {
      setStatus({
        type: 'error',
        message: 'Invalid reset token. Please request a new password reset link.',
      });
      setSubmitting(false);
      return;
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/reset-password`,
        { 
          token,
          password: values.password
        }
      );
      
      setStatus({
        type: 'success',
        message: 'Password has been reset successfully!',
      });
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login', { state: { message: 'Password reset successful. Please login with your new password.' } });
      }, 2000);
      
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to reset password. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <>
      {status.message && (
        <Alert severity={status.type} sx={{ mb: 2, width: '100%' }}>
          {status.message}
        </Alert>
      )}
      <Typography component="h1" variant="h5" align="center" sx={{ mb: 3 }}>
        Reset Password
      </Typography>
      <Typography variant="body2" align="center" sx={{ mb: 4 }}>
        Enter your new password below.
      </Typography>
      <Formik
        initialValues={{ password: '', confirmPassword: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, touched, errors }) => (
          <Form style={{ width: '100%' }}>
            <Field
              as={TextField}
              variant="outlined"
              margin="normal"
              fullWidth
              name="password"
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="new-password"
              error={touched.password && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Field
              as={TextField}
              variant="outlined"
              margin="normal"
              fullWidth
              name="confirmPassword"
              label="Confirm New Password"
              type={showPassword ? 'text' : 'password'}
              id="confirmPassword"
              error={touched.confirmPassword && Boolean(errors.confirmPassword)}
              helperText={touched.confirmPassword && errors.confirmPassword}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isSubmitting || !token}
              sx={{ mt: 3, mb: 2 }}
            >
              Reset Password
            </Button>
            <Box textAlign="center">
              <Link component={RouterLink} to="/login" variant="body2">
                Back to Sign In
              </Link>
            </Box>
          </Form>
        )}
      </Formik>
    </>
  );
}

export default ResetPassword; 