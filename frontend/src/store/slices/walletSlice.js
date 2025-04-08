import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../utils/api';

// Async thunks
export const getMCPWallet = createAsyncThunk(
  'wallet/getMCPWallet',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getMCPWallet();
      return response;
    } catch (error) {
      console.error('Wallet fetch error:', error);
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch wallet' });
    }
  }
);

export const getMCPTransactions = createAsyncThunk(
  'wallet/getMCPTransactions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getMCPTransactions();
      return response;
    } catch (error) {
      console.error('Transactions fetch error:', error);
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch transactions' });
    }
  }
);

const initialState = {
  wallet: {
    balance: 0,
    totalEarnings: 0,
    totalWithdrawals: 0,
    pendingAmount: 0,
  },
  transactions: [],
  loading: false,
  error: null,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMCPWallet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMCPWallet.fulfilled, (state, action) => {
        state.loading = false;
        state.wallet = action.payload;
      })
      .addCase(getMCPWallet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch wallet';
      })
      .addCase(getMCPTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMCPTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(getMCPTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch transactions';
      });
  },
});

export const { clearError } = walletSlice.actions;
export default walletSlice.reducer; 