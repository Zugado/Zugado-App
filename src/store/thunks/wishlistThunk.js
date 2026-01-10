import { createAsyncThunk } from '@reduxjs/toolkit';
import { getWishlistAPI, addToWishlistAPI, removeFromWishlistAPI } from '../api/wishlistApi';
import { handleAxiosError } from '../../utils/handleAxiosError';

// Get wishlist
export const getWishlist = createAsyncThunk(
  "wishlist/getWishlist",
  async (_, thunkAPI) => {
    try {
      const response = await getWishlistAPI();
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);

// Add to wishlist
export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async (jobId, thunkAPI) => {
    try {
      const response = await addToWishlistAPI(jobId);
      return { jobId, ...response?.data };
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);

// Remove from wishlist
export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async (jobId, thunkAPI) => {
    try {
      const response = await removeFromWishlistAPI(jobId);
      return { jobId, ...response?.data };
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);