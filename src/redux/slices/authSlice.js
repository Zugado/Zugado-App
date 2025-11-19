import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../../api/axiosInstance';

// -------------------- THUNKS --------------------

// Signup
export const signup = createAsyncThunk(
  "auth/signup",
  async ({ name, email, phone, password }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/signup", {
        name,
        email,
        phone,
        password,
      });
      const { user, token } = res.data;
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));
      await AsyncStorage.removeItem("guest");
      return { user, token };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Signup failed");
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
    loading: false,
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

      // Signup
      .addCase(signup.pending, (state) => {
        state.signUpLoading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.signUpLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isGuest = false;
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
