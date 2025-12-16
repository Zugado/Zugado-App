import { createAsyncThunk } from '@reduxjs/toolkit';
import { getUserLocationAPI, updateUserLocationAPI } from '../api/locationApi';
import { handleAxiosError } from '../../utils/handleAxiosError';

// Get user location thunk
export const getUserLocation = createAsyncThunk(
  "location/getUserLocation",
  async (_, thunkAPI) => {
    try {
      const response = await getUserLocationAPI();
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);

// Update user location thunk
export const updateUserLocation = createAsyncThunk(
  "location/updateUserLocation",
  async (data, thunkAPI) => {
    try {
      const response = await updateUserLocationAPI(data);
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);