import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../utils/api';

// Async thunk
export const getMCPPartners = createAsyncThunk(
  'partners/getMCPPartners',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getMCPPartners();
      return response;
    } catch (error) {
      console.error('Partners fetch error:', error);
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch partners' });
    }
  }
);

const initialState = {
  partners: [],
  loading: false,
  error: null,
};

const partnerSlice = createSlice({
  name: 'partner',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMCPPartners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMCPPartners.fulfilled, (state, action) => {
        state.loading = false;
        state.partners = action.payload;
      })
      .addCase(getMCPPartners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch partners';
      });
  },
});

export const { clearError } = partnerSlice.actions;
export default partnerSlice.reducer; 