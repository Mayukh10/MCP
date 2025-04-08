import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import collectionReducer from './slices/collectionSlice';
import partnerReducer from './slices/partnerSlice';
import orderReducer from './slices/orderSlice';
import analyticsReducer from './slices/analyticsSlice';
import walletReducer from './slices/walletSlice';
import statsReducer from './slices/statsSlice';
import notificationReducer from './slices/notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    collections: collectionReducer,
    partners: partnerReducer,
    orders: orderReducer,
    analytics: analyticsReducer,
    wallet: walletReducer,
    stats: statsReducer,
    notifications: notificationReducer,
  },
}); 