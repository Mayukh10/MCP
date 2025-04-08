import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Async thunk
export const getMCPAnalytics = createAsyncThunk(
  'analytics/getMCPAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/analytics/mcp`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  analytics: {
    totalCollections: 0,
    activeCollections: 0,
    completedCollections: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    lastMonthRevenue: 0,
    activePartners: 0,
    totalPartners: 0,
    avgCollectionsPerPartner: 0,
  },
  loading: false,
  error: null,
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMCPAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMCPAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.analytics = action.payload;
      })
      .addCase(getMCPAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? action.payload.message : 'Failed to fetch analytics';
      });
  },
});

export const { clearError } = analyticsSlice.actions;
export default analyticsSlice.reducer; 