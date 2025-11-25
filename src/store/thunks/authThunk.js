import { createAsyncThunk } from '@reduxjs/toolkit';
import { sendOtpAPI, verifyOtpAPI, registerAPI } from '../api/authApi';
import { handleAxiosError } from '../../utils/handleAxiosError';
// Thunk for sending OTP
export const sendOtp = createAsyncThunk(
  "auth/sendOtp",
  async (data, thunkAPI) => {
    try {
      const response = await sendOtpAPI(data);
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);

// Thunk for verifying OTP
export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (data, thunkAPI) => {
    try {
      const response = await verifyOtpAPI(data);
      return response?.data;
    } catch (error) {
      // console.log('errorn in thunk = ', error.response);
      return handleAxiosError(error, thunkAPI);
    }
  }
);


// Thunk for Register
export const register = createAsyncThunk(
  "auth/register",
  async (data, thunkAPI) => {
    try {
      const response = await registerAPI(data);
      return response?.data;
    } catch (error) {
      console.log(error.response);
      return handleAxiosError(error, thunkAPI);
    }
  }
);