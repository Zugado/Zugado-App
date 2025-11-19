import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../../api/axiosInstance';

// -------------------- THUNKS --------------------

//send otp

export const sendOtp = createAsyncThunk(
  'auth/sendOtp',
  async ({ mobileOrEmail }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/auth/send-otp', { mobileOrEmail });
      console.log('Send OTP Response:', res.data);
      return res.data.message; // success message
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to send OTP';
      return rejectWithValue(msg);
    }
  }
);

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async ({ mobileOrEmail, otp }, { rejectWithValue }) => {
    console.log('Verifying OTP:', otp);
    try {
      const res = await axiosInstance.post('/auth/verify-otp', { mobileOrEmail, otp });
      console.log('Verify OTP Response:', res.data);
      return res.data.message; // success message
    } catch (error) {
      const msg = error.response?.data?.message || 'OTP verification failed';
      console.log('OTP Verification Error:', msg);
      return rejectWithValue(msg);
    }
  }
);

// Login
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/auth/login', { email, password });
      const { token, user } = res.data;

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      await AsyncStorage.removeItem("guest");
      return { user, token };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

// Auto Login
export const loadUserFromStorage = createAsyncThunk(
  "auth/loadUserFromStorage",
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userData = await AsyncStorage.getItem("user");
      const guest = await AsyncStorage.getItem("guest");

      if (token && userData) {
        return { token, user: JSON.parse(userData) };
      }

      if (guest === "true") {
        return { guest: true };
      }

      return rejectWithValue("No user found");
    } catch (error) {
      return rejectWithValue("Failed to load user");
    }
  }
);

// Forgot, OTP, Reset → (unchanged)

// -------------------- SLICE --------------------
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isGuest: false,
    loading: true,
    signUpLoading: false,
    error: null,
    forgotPasswordMessage: null,
    otpVerified: false,
    resetPasswordMessage: null,
  },
  reducers: {
    setGuestMode: (state) => {
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
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isGuest = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Load User / Guest
      .addCase(loadUserFromStorage.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUserFromStorage.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload?.guest) {
          state.isGuest = true;
          state.user = null;
          state.token = null;
        } else {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isGuest = false;
        }
      })
      .addCase(loadUserFromStorage.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { logout, clearAuthState, setGuestMode } = authSlice.actions;
export default authSlice.reducer;
