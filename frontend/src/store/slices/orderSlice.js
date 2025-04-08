import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../utils/api';

// Async thunks
export const getMCPOrders = createAsyncThunk(
  'orders/getMCPOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getMCPOrders();
      return response;
    } catch (error) {
      console.error('Orders fetch error:', error);
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch orders' });
    }
  }
);

export const getPartnerOrders = createAsyncThunk(
  'orders/getPartnerOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getPartnerOrders();
      return response;
    } catch (error) {
      console.error('Partner orders fetch error:', error);
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch partner orders' });
    }
  }
);

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await apiService.createOrder(orderData);
      return response;
    } catch (error) {
      console.error('Create order error:', error);
      return rejectWithValue(error.response?.data || { message: 'Failed to create order' });
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await apiService.updateOrderStatus(orderId, status);
      return response;
    } catch (error) {
      console.error('Update order status error:', error);
      return rejectWithValue(error.response?.data || { message: 'Failed to update order status' });
    }
  }
);

// Initial state
const initialState = {
  orders: [],
  loading: false,
  error: null,
  createSuccess: false,
  updateSuccess: false,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetSuccess: (state) => {
      state.createSuccess = false;
      state.updateSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get MCP Orders
      .addCase(getMCPOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMCPOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getMCPOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch orders';
      })
      // Get Partner Orders
      .addCase(getPartnerOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPartnerOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getPartnerOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch partner orders';
      })
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.createSuccess = false;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.unshift(action.payload);
        state.createSuccess = true;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create order';
        state.createSuccess = false;
      })
      // Update Order Status
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.orders.findIndex(order => order._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        state.updateSuccess = true;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update order status';
        state.updateSuccess = false;
      });
  },
});

export const { clearError, resetSuccess } = orderSlice.actions;
export default orderSlice.reducer; 