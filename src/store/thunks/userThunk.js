import { updateProfilePicAPI } from "../api/userApi";

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