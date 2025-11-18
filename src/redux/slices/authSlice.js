import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../../api/axiosInstance';

// -------------------- THUNKS --------------------
// 0️⃣ Signup user
export const signup = createAsyncThunk(
  "auth/signup",
  async ({ name, email, phone, password }, { rejectWithValue }) => {
    console.log("Signup data:", { name, email, phone, password });
    try {
      const res = await axiosInstance.post("/auth/signup", {
        name,
        email,
        phone,
        password,
      });
      const { user, token} = res.data;
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));
      return { user, token }; // assuming your backend returns { user, token, message }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Signup failed");
    }
  }
);

// 1️⃣ Login user
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/auth/login', { email, password });
      const { token, user } = res.data;

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      return { user, token };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

// ✅ Auto-login when app restarts
export const loadUserFromStorage = createAsyncThunk(
  "auth/loadUserFromStorage",
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userData = await AsyncStorage.getItem("user");
      if (token && userData) {
        return { token, user: JSON.parse(userData) };
      }
      return rejectWithValue("No user found");
    } catch (error) {
      return rejectWithValue("Failed to load user");
    }
  }
);

// 2️⃣ Forgot password (send OTP)
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async ({ email }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/auth/forgot-password', { email });
      return res.data.message;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send OTP');
    }
  }
);

// 3️⃣ Verify OTP
export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/auth/verify-otp', { email, otp });
      return res.data.message;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Invalid or expired OTP');
    }
  }
);

// 4️⃣ Reset password
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ email, newPassword }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/auth/reset-password', { email, newPassword });
      return res.data.message;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reset password');
    }
  }
);

// -------------------- SLICE --------------------
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    loading: false,
    signUpLoading: false,
    error: null,
    forgotPasswordMessage: null,
    otpVerified: false,
    resetPasswordMessage: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      AsyncStorage.removeItem('token');
      AsyncStorage.removeItem('user');
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

    // Signup
.addCase(signup.pending, (state) => {
  state.signUpLoading = true;
  state.error = null;
})
.addCase(signup.fulfilled, (state, action) => {
  state.signUpLoading = false;
  state.user = action.payload.user;
  state.token = action.payload.token;
})
.addCase(signup.rejected, (state, action) => {
  state.signUpLoading = false;
  state.error = action.payload;
})
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

       // load from storage
      .addCase(loadUserFromStorage.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUserFromStorage.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loadUserFromStorage.rejected, (state) => {
        state.loading = false;
      })

      // Forgot password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.forgotPasswordMessage = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.forgotPasswordMessage = action.payload;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Verify OTP
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.otpVerified = false;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.otpVerified = true;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Reset password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.resetPasswordMessage = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.resetPasswordMessage = action.payload;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export const { logout, clearAuthState } = authSlice.actions;
export default authSlice.reducer;