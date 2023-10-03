// store.js
import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import claimedRoutesReducer from './slices/claimedRoutesSlice'; // Import the new reducer

export default configureStore({
  reducer: {
    auth: authSlice,
    claimedRoutes: claimedRoutesReducer, // Add the new reducer
  },
});
