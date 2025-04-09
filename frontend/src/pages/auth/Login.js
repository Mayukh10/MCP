import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  Divider,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { login } from '../../store/slices/authSlice';

// Validation schema
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (values) => {
    try {
      const result = await dispatch(login(values)).unwrap();
      
      // Navigate based on user role
      if (result.user.role === 'mcp') {
        navigate('/mcp/dashboard');
      } else if (result.user.role === 'partner') {
        navigate('/partner/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      // Error is handled by Redux
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Sign In
      </Typography>
      
      <Paper 
        elevation={3} 
        sx={{ p: 3, mb: 3, bgcolor: 'info.light', color: 'info.contrastText' }}
      >
        <Typography variant="subtitle1" fontWeight="bold">
          Test Credentials:
        </Typography>
        <Typography variant="body2">
          MCP Admin: admin@mcp.com / password123
        </Typography>
        <Typography variant="body2">
          Partner: partner@example.com / password123
        </Typography>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        validationSchema={LoginSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form>
            <Stack spacing={3}>
              <Field name="email">
                {({ field }) => (
                  <TextField
                    {...field}
                    label="Email"
                    variant="outlined"
                    fullWidth
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                  />
                )}
              </Field>

              <Field name="password">
                {({ field }) => (
                  <TextField
                    {...field}
                    label="Password"
                    variant="outlined"
                    fullWidth
                    type={showPassword ? 'text' : 'password'}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleClickShowPassword} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              </Field>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </Stack>
          </Form>
        )}
      </Formik>

      <Divider sx={{ my: 3 }} />

      <Box textAlign="center">
        <Typography variant="body2" sx={{ mb: 1 }}>
          <Link to="/forgot-password">Forgot password?</Link>
        </Typography>
        <Typography variant="body2">
          Don&apos;t have an account?{' '}
          <Link to="/register">Register</Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Login; 