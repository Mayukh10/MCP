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
  FormControl,
  FormHelperText,
  Select,
  MenuItem,
  InputLabel,
  Paper,
  Stack,
  Divider,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { register } from '../../store/slices/authSlice';

// Validation schema
const RegisterSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  phone: Yup.string()
    .required('Phone number is required')
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  role: Yup.string()
    .oneOf(['mcp', 'pickup_partner'], 'Invalid role selected')
    .required('Role is required'),
});

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (values) => {
    const { confirmPassword, ...userData } = values;
    
    try {
      await dispatch(register(userData)).unwrap();
      navigate('/dashboard');
    } catch (err) {
      // Error is handled by Redux
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Create an Account
      </Typography>
      
      <Paper 
        elevation={3} 
        sx={{ p: 3, mb: 3, bgcolor: 'info.light', color: 'info.contrastText' }}
      >
        <Typography variant="subtitle1" fontWeight="bold">
          Registration Instructions:
        </Typography>
        <Typography variant="body2">
          For testing, use password123 as your password. Select either 'mcp' or 'pickup_partner' as your role.
        </Typography>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Formik
        initialValues={{
          name: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
          role: '',
        }}
        validationSchema={RegisterSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, values, setFieldValue }) => (
          <Form>
            <Stack spacing={3}>
              <Field name="name">
                {({ field }) => (
                  <TextField
                    {...field}
                    label="Full Name"
                    variant="outlined"
                    fullWidth
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                  />
                )}
              </Field>

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

              <Field name="phone">
                {({ field }) => (
                  <TextField
                    {...field}
                    label="Phone Number"
                    variant="outlined"
                    fullWidth
                    error={touched.phone && Boolean(errors.phone)}
                    helperText={touched.phone && errors.phone}
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

              <Field name="confirmPassword">
                {({ field }) => (
                  <TextField
                    {...field}
                    label="Confirm Password"
                    variant="outlined"
                    fullWidth
                    type={showConfirmPassword ? 'text' : 'password'}
                    error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                    helperText={touched.confirmPassword && errors.confirmPassword}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleClickShowConfirmPassword} edge="end">
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              </Field>

              <FormControl 
                fullWidth 
                variant="outlined" 
                error={touched.role && Boolean(errors.role)}
              >
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                  labelId="role-label"
                  label="Role"
                  name="role"
                  value={values.role}
                  onChange={(e) => setFieldValue('role', e.target.value)}
                >
                  <MenuItem value="">
                    <em>Select a role</em>
                  </MenuItem>
                  <MenuItem value="mcp">MCP (Admin)</MenuItem>
                  <MenuItem value="pickup_partner">Pickup Partner</MenuItem>
                </Select>
                {touched.role && errors.role && (
                  <FormHelperText error>{errors.role}</FormHelperText>
                )}
              </FormControl>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Register'}
              </Button>
            </Stack>
          </Form>
        )}
      </Formik>

      <Divider sx={{ my: 3 }} />

      <Box textAlign="center">
        <Typography variant="body2">
          Already have an account?{' '}
          <Link to="/login">Sign In</Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Register; 