import { createSlice } from '@reduxjs/toolkit';
import { getUserLocation, updateUserLocation } from '../thunks/locationThunk';

const initialState = {
  coordinates: null,
  address: null,
  loading: false,
  error: null,
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    clearLocation: (state) => {
      state.coordinates = null;
      state.address = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.coordinates = action.payload?.data?.coordinates || null;
        state.address = action.payload?.data?.address || null;
      })
      .addCase(getUserLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to get location';
      })
      .addCase(updateUserLocation.fulfilled, (state, action) => {
        state.coordinates = action.payload?.data?.coordinates || state.coordinates;
        state.address = action.payload?.data?.address || state.address;
      });
  },
});

export const { clearLocation, clearError } = locationSlice.actions;
export default locationSlice.reducer;