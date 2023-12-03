import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import claimedRoutesReducer from "./slices/claimedRoutesSlice";

export default configureStore({
  reducer: {
    auth: authSlice,
    claimedRoutes: claimedRoutesReducer,
  },
});
