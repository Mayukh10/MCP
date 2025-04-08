import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  TextField,
  Button,
  Link,
  Typography,
  Alert,
  Box,
} from '@mui/material';
import axios from 'axios';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Enter a valid email')
    .required('Email is required'),
});

function ForgotPassword() {
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/forgot-password`,
        { email: values.email }
      );
      
      setStatus({
        type: 'success',
        message: 'Password reset link has been sent to your email address.',
      });
      resetForm();
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to send reset link. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {status.message && (
        <Alert severity={status.type} sx={{ mb: 2, width: '100%' }}>
          {status.message}
        </Alert>
      )}
      <Typography component="h1" variant="h5" align="center" sx={{ mb: 3 }}>
        Forgot Password
      </Typography>
      <Typography variant="body2" align="center" sx={{ mb: 4 }}>
        Enter your email address and we'll send you a link to reset your password.
      </Typography>
      <Formik
        initialValues={{ email: '' }}
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
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              error={touched.email && Boolean(errors.email)}
              helperText={touched.email && errors.email}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              sx={{ mt: 3, mb: 2 }}
            >
              Send Reset Link
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

export default ForgotPassword; 