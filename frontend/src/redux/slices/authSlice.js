import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    userData: { name: "", email: "" },
  },
  reducers: {
    updateData: (state, action) => {
      state.userData = action.payload;
    },
  },
});

export const { updateData } = authSlice.actions;

export default authSlice.reducer;
