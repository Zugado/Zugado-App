import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sendOtp, verifyOtp, register } from '../thunks/authThunk';
import {getUserProfile, updateProfilePic} from '../thunks/userThunk';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
    error: null,
    isGuest: false,
    token: null,
    isNewUser: null,
  },
  reducers: {
    setGuestMode(state) {
      state.isGuest = true;
      state.user = null;
      state.token = null;
      AsyncStorage.setItem("guest", "true");
    },
    loadUser: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isGuest = false;
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

        console.log('verifyOtp.fulfilled', action.payload);

        if (action.payload?.data?.isNewUser) {
          state.token = action.payload?.data?.token;
          state.isNewUser = action.payload?.data?.isNewUser;
          state.error = null;

          if (state.token) {
            AsyncStorage.setItem("token", state?.token);
          }
        } else {
          state.user = action.payload?.data?.user;
          state.token = action.payload?.data?.token;
          state.isNewUser = action.payload?.data?.isNewUser;
          state.error = null;

          if (state.token) {
            AsyncStorage.setItem("token", state.token);
          }
          if (state.user) {
            AsyncStorage.setItem("user", JSON.stringify(state.user));
          }
        }
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload?.data || null;
        state.isNewUser = false;

        if (state.user && action.payload?.data) {
          AsyncStorage.setItem('user', JSON.stringify(action.payload.data));
        }

        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(updateProfilePic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfilePic.fulfilled, (state, action) => {
        state.loading = false;
         state.error = null;
        
      })
      .addCase(updateProfilePic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action?.payload?.data || null;
        state.isNewUser = false;

        if (state.user && action?.payload?.data) {
          AsyncStorage.setItem('user', JSON.stringify(action.payload.data));
        }

        state.error = null;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      ;
  }
});

export const { logout, clearAuthState, setGuestMode, loadUser } = authSlice.actions;
export default authSlice.reducer;