import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../utils/api';

// Async thunk
export const getMCPStats = createAsyncThunk(
  'stats/getMCPStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getMCPStats();
      return response;
    } catch (error) {
      console.error('Stats fetch error:', error);
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch stats' });
    }
  }
);

const initialState = {
  stats: {
    totalCollections: 0,
    activePickups: 0,
    totalEarnings: 0,
    partnersCount: 0,
    dailyCollections: []
  },
  loading: false,
  error: null,
};

const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMCPStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMCPStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(getMCPStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch stats';
      });
  },
});

export const { clearError } = statsSlice.actions;
export default statsSlice.reducer; 