import { getUserProfileAPI, updateProfilePicAPI } from "../api/userApi";

import { createAsyncThunk } from '@reduxjs/toolkit';
import { handleAxiosError } from '../../utils/handleAxiosError';

//Update profile pic thunk
export const updateProfilePic = createAsyncThunk(
  "user/updateProfilePic",
  async (data, thunkAPI) => {
    try {
      const response = await updateProfilePicAPI(data);
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);

//Update profile pic thunk
export const getUserProfile = createAsyncThunk(
  "user/getUserProfile",
  async (_, thunkAPI) => {
    try {
      const response = await getUserProfileAPI();
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);

//Update user details thunk
export const updateUseDetails = createAsyncThunk(
  "user/updateUseDetails",
  async (data, thunkAPI) => {
    try {
      const response = await updateUserDetailsAPI(data);
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);