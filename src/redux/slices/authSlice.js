import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../../api/axiosInstance';

export const sendOtp = createAsyncThunk(
  'auth/sendOtp',
  async ({ mobileOrEmail }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/auth/send-otp', { mobileOrEmail });
      return res.data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to send OTP';
      return rejectWithValue(msg);
    }
  }
);

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async ({ mobileOrEmail, otp }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/auth/verify-otp', { mobileOrEmail, otp });
      console.log('Verify OTP Response:', res.data);
      return res.data; // success data (should contain user/token)
    } catch (error) {
      const msg = error.response?.data?.message || 'OTP verification failed';
      console.log('OTP Verification Error:', msg);
      return rejectWithValue(msg);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/auth/register', userData);
      return res.data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed';
      console.log('Registration Error:', msg);
      return rejectWithValue(msg);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
    error: null,
    isGuest: false,
    token: null,
  },
  reducers: {
    setGuestMode(state) {
      state.isGuest = true;
      state.user = null;
      state.token = null;
      AsyncStorage.setItem("guest", "true");
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isGuest = false;
      AsyncStorage.removeItem("token");
      AsyncStorage.removeItem("user");
      AsyncStorage.removeItem("guest");
    },
    clearAuthState: (state) => {
      state.loading = false;
      state.error = null;
      state.forgotPasswordMessage = null;
      state.otpVerified = false;
      state.resetPasswordMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state) => {
        // We don't need to store the message here, just clear loading/error
        state.loading = false;
        state.error = null;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
    state.loading = false;
    state.user = action.payload.data.user;
    state.token = action.payload.data.token;
    state.error = null;

    if (action.payload.data.token) {
        AsyncStorage.setItem("token", action.payload.data.token);
        AsyncStorage.setItem("user", JSON.stringify(action.payload.data.user));
    }
})
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
  state.loading = false;
  state.user = action.payload.data.user;
  state.token = action.payload.data.token;

  if (action.payload.data.token) {
    AsyncStorage.setItem('token', action.payload.data.token);
    AsyncStorage.setItem('user', JSON.stringify(action.payload.data.user));
  }

  state.error = null;
})
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {  logout, clearAuthState, setGuestMode } = authSlice.actions;
export default authSlice.reducer;