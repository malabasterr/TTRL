import { createSlice } from "@reduxjs/toolkit";

const claimedRoutesSlice = createSlice({
  name: "claimedRoutes",
  initialState: {},
  reducers: {
    updateClaimedRoute: (state, action) => {
      const { routeId, teamColor } = action.payload;
      state[routeId] = teamColor;
    },
  },
});

export const { updateClaimedRoute } = claimedRoutesSlice.actions;

export default claimedRoutesSlice.reducer;
