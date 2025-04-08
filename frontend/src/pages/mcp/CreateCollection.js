import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Button,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { createCollection } from '../../store/slices/collectionSlice';

const wasteTypes = [
  { value: 'plastic', label: 'Plastic' },
  { value: 'paper', label: 'Paper' },
  { value: 'metal', label: 'Metal' },
  { value: 'glass', label: 'Glass' },
  { value: 'e_waste', label: 'E-Waste' },
  { value: 'other', label: 'Other' },
];

const units = [
  { value: 'kg', label: 'Kilograms (kg)' },
  { value: 'pieces', label: 'Pieces' },
];

const steps = ['Waste Details', 'Pickup Information', 'Review'];

const validationSchema = Yup.object({
  wasteType: Yup.string().required('Waste type is required'),
  quantity: Yup.number()
    .required('Quantity is required')
    .positive('Quantity must be positive'),
  unit: Yup.string().required('Unit is required'),
  scheduledDate: Yup.date()
    .required('Pickup date is required')
    .min(new Date(), 'Pickup date must be in the future'),
  address: Yup.object({
    street: Yup.string().required('Street address is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    pincode: Yup.string()
      .required('Pincode is required')
      .matches(/^[0-9]{6}$/, 'Pincode must be 6 digits'),
    landmark: Yup.string(),
  }),
  notes: Yup.string(),
});

const CreateCollection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.collections);
  const [activeStep, setActiveStep] = useState(0);

  const initialValues = {
    wasteType: '',
    quantity: '',
    unit: 'kg',
    scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      landmark: '',
    },
    notes: '',
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (values, { resetForm }) => {
    await dispatch(createCollection(values));
    resetForm();
    navigate('/mcp/collections');
  };

  const renderStepContent = (activeStep, values, errors, touched, handleChange, setFieldValue) => {
    switch (activeStep) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                name="wasteType"
                label="Waste Type"
                value={values.wasteType}
                onChange={handleChange}
                error={touched.wasteType && Boolean(errors.wasteType)}
                helperText={touched.wasteType && errors.wasteType}
              >
                {wasteTypes.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                name="quantity"
                label="Quantity"
                type="number"
                inputProps={{ min: 0, step: 0.1 }}
                value={values.quantity}
                onChange={handleChange}
                error={touched.quantity && Boolean(errors.quantity)}
                helperText={touched.quantity && errors.quantity}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                select
                name="unit"
                label="Unit"
                value={values.unit}
                onChange={handleChange}
                error={touched.unit && Boolean(errors.unit)}
                helperText={touched.unit && errors.unit}
              >
                {units.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="notes"
                label="Additional Notes"
                multiline
                rows={4}
                value={values.notes}
                onChange={handleChange}
                error={touched.notes && Boolean(errors.notes)}
                helperText={touched.notes && errors.notes}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Pickup Date & Time"
                  value={values.scheduledDate}
                  onChange={(newValue) => {
                    setFieldValue('scheduledDate', newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={touched.scheduledDate && Boolean(errors.scheduledDate)}
                      helperText={touched.scheduledDate && errors.scheduledDate}
                    />
                  )}
                  minDate={new Date()}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="address.street"
                label="Street Address"
                value={values.address.street}
                onChange={handleChange}
                error={touched.address?.street && Boolean(errors.address?.street)}
                helperText={touched.address?.street && errors.address?.street}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                name="address.city"
                label="City"
                value={values.address.city}
                onChange={handleChange}
                error={touched.address?.city && Boolean(errors.address?.city)}
                helperText={touched.address?.city && errors.address?.city}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                name="address.state"
                label="State"
                value={values.address.state}
                onChange={handleChange}
                error={touched.address?.state && Boolean(errors.address?.state)}
                helperText={touched.address?.state && errors.address?.state}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                name="address.pincode"
                label="Pincode"
                value={values.address.pincode}
                onChange={handleChange}
                error={touched.address?.pincode && Boolean(errors.address?.pincode)}
                helperText={touched.address?.pincode && errors.address?.pincode}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="address.landmark"
                label="Landmark (Optional)"
                value={values.address.landmark}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Waste Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2">Waste Type</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {wasteTypes.find((type) => type.value === values.wasteType)?.label || values.wasteType}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2">Quantity</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {values.quantity} {values.unit}
                  </Typography>
                </Grid>
              </Grid>
              {values.notes && (
                <>
                  <Typography variant="subtitle2">Additional Notes</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {values.notes}
                  </Typography>
                </>
              )}

              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Pickup Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2">Pickup Date & Time</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {values.scheduledDate.toLocaleString()}
                  </Typography>
                </Grid>
              </Grid>

              <Typography variant="subtitle2">Pickup Address</Typography>
              <Typography variant="body1">
                {values.address.street},
                <br />
                {values.address.city}, {values.address.state} - {values.address.pincode}
                {values.address.landmark && (
                  <>
                    <br />
                    Landmark: {values.address.landmark}
                  </>
                )}
              </Typography>
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ flexGrow: 1, py: 3 }}>
      <Typography variant="h4" gutterBottom>
        Create Collection Request
      </Typography>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, setFieldValue, isValid, dirty }) => (
            <Form>
              {renderStepContent(
                activeStep,
                values,
                errors,
                touched,
                handleChange,
                setFieldValue
              )}

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                {activeStep !== 0 && (
                  <Button onClick={handleBack} sx={{ mr: 1 }}>
                    Back
                  </Button>
                )}

                {activeStep === steps.length - 1 ? (
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading || !isValid}
                    startIcon={loading && <CircularProgress size={20} />}
                  >
                    Submit Request
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={
                      (activeStep === 0 &&
                        (!values.wasteType || !values.quantity || !values.unit)) ||
                      (activeStep === 1 &&
                        (!values.scheduledDate ||
                          !values.address.street ||
                          !values.address.city ||
                          !values.address.state ||
                          !values.address.pincode))
                    }
                  >
                    Next
                  </Button>
                )}
              </Box>
            </Form>
          )}
        </Formik>
      </Paper>
    </Box>
  );
};

export default CreateCollection; 