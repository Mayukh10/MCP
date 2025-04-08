import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Async thunks
export const getPartnerEarnings = createAsyncThunk(
  'earnings/getPartnerEarnings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/earnings/partner`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const earningsSlice = createSlice({
  name: 'earnings',
  initialState: {
    earnings: {
      totalEarnings: 0,
      monthlyEarnings: 0,
      collectionsCompleted: 0,
      history: [],
    },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPartnerEarnings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPartnerEarnings.fulfilled, (state, action) => {
        state.loading = false;
        state.earnings = action.payload;
      })
      .addCase(getPartnerEarnings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch earnings';
      });
  },
});

export default earningsSlice.reducer; 