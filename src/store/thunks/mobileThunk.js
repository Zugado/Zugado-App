import { createAsyncThunk } from '@reduxjs/toolkit';
import { sendMobileOtpAPI, verifyMobileOtpAPI } from '../api/mobileApi';
import { handleAxiosError } from '../../utils/handleAxiosError';

// Send OTP for mobile change
export const sendMobileOtp = createAsyncThunk(
  "mobile/sendOtp",
  async (data, thunkAPI) => {
    try {
      const response = await sendMobileOtpAPI(data);
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);

// Verify OTP for mobile change
export const verifyMobileOtp = createAsyncThunk(
  "mobile/verifyOtp",
  async (data, thunkAPI) => {
    try {
      const response = await verifyMobileOtpAPI(data);
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);