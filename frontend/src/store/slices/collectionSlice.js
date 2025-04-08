import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Async thunks
export const getMCPCollections = createAsyncThunk(
  'collections/getMCPCollections',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/collections/mcp`, {
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

export const getPartnerCollections = createAsyncThunk(
  'collections/getPartnerCollections',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/collections/partner`, {
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

export const getAvailableCollections = createAsyncThunk(
  'collections/getAvailableCollections',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/collections/available`, {
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

export const createCollection = createAsyncThunk(
  'collections/createCollection',
  async (collectionData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/collections`, collectionData, {
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

export const updateCollectionStatus = createAsyncThunk(
  'collections/updateCollectionStatus',
  async ({ collectionId, status }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${API_URL}/collections/${collectionId}/status`,
        { status },
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

export const updateCollectionPrice = createAsyncThunk(
  'collections/updateCollectionPrice',
  async ({ collectionId, price }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${API_URL}/collections/${collectionId}/price`,
        { price },
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

export const assignCollection = createAsyncThunk(
  'collections/assignCollection',
  async ({ collectionId, partnerId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/collections/${collectionId}/assign`,
        { partnerId },
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

const initialState = {
  collections: [],
  loading: false,
  error: null,
};

const collectionSlice = createSlice({
  name: 'collections',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle getMCPCollections
      .addCase(getMCPCollections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMCPCollections.fulfilled, (state, action) => {
        state.loading = false;
        state.collections = action.payload;
      })
      .addCase(getMCPCollections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? action.payload.message : 'Failed to fetch collections';
      })
      
      // Handle getPartnerCollections
      .addCase(getPartnerCollections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPartnerCollections.fulfilled, (state, action) => {
        state.loading = false;
        state.collections = action.payload;
      })
      .addCase(getPartnerCollections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? action.payload.message : 'Failed to fetch collections';
      })
      
      // Handle getAvailableCollections
      .addCase(getAvailableCollections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAvailableCollections.fulfilled, (state, action) => {
        state.loading = false;
        state.collections = action.payload;
      })
      .addCase(getAvailableCollections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? action.payload.message : 'Failed to fetch available collections';
      })
      
      // Handle createCollection
      .addCase(createCollection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCollection.fulfilled, (state, action) => {
        state.loading = false;
        state.collections.push(action.payload);
      })
      .addCase(createCollection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? action.payload.message : 'Failed to create collection';
      })
      
      // Handle updateCollectionStatus
      .addCase(updateCollectionStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCollectionStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.collections.findIndex((collection) => collection._id === action.payload._id);
        if (index !== -1) {
          state.collections[index] = action.payload;
        }
      })
      .addCase(updateCollectionStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? action.payload.message : 'Failed to update collection status';
      })
      
      // Handle updateCollectionPrice
      .addCase(updateCollectionPrice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCollectionPrice.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.collections.findIndex((collection) => collection._id === action.payload._id);
        if (index !== -1) {
          state.collections[index] = action.payload;
        }
      })
      .addCase(updateCollectionPrice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? action.payload.message : 'Failed to update collection price';
      })
      
      // Handle assignCollection
      .addCase(assignCollection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignCollection.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.collections.findIndex((collection) => collection._id === action.payload._id);
        if (index !== -1) {
          state.collections[index] = action.payload;
        }
      })
      .addCase(assignCollection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? action.payload.message : 'Failed to assign collection';
      });
  },
});

export const { clearError } = collectionSlice.actions;
export default collectionSlice.reducer; 