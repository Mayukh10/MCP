import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Async thunks
export const getMCPTransactions = createAsyncThunk(
  'transactions/getMCP',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/transactions/mcp`, {
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

export const getPartnerTransactions = createAsyncThunk(
  'transactions/getPartner',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/transactions/partner`, {
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

export const updateTransactionPayment = createAsyncThunk(
  'transactions/updatePayment',
  async ({ transactionId, paymentMethod, paymentDetails }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/transactions/${transactionId}/payment`,
        { paymentMethod, paymentDetails },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getTransactionSummary = createAsyncThunk(
  'transactions/getSummary',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/transactions/summary`, {
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
  transactions: [],
  summary: null,
  loading: false,
  error: null,
};

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get MCP Transactions
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
      })
      // Get Partner Transactions
      .addCase(getPartnerTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPartnerTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(getPartnerTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch transactions';
      })
      // Update Transaction Payment
      .addCase(updateTransactionPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTransactionPayment.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.transactions.findIndex(
          (t) => t._id === action.payload._id
        );
        if (index !== -1) {
          state.transactions[index] = action.payload;
        }
      })
      .addCase(updateTransactionPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update payment';
      })
      // Get Transaction Summary
      .addCase(getTransactionSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTransactionSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
      })
      .addCase(getTransactionSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch summary';
      });
  },
});

export const { clearError } = transactionSlice.actions;
export default transactionSlice.reducer; 