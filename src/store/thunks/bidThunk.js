import { createAsyncThunk } from '@reduxjs/toolkit';
import { 
  postBidByJobIdAPI, 
  getAllBidsByJobIdAPI, 
  getAllMyBidsAPI,
  updateBidStatusAPI,
  updateBidByJobIdAPI,
} from '../api/bidsApi';
import { handleAxiosError } from '../../utils/handleAxiosError';

// Post bid by job id thunk
export const postBidByJobId = createAsyncThunk(
  "bid/postBidByJobId",
  async (data, thunkAPI) => {
    try {
      const response = await postBidByJobIdAPI(data);
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);

// Update Bid by Job Id Thunk
export const updateBidByJobId = createAsyncThunk(
  "bid/updateBidByJobId",
  async (data, thunkAPI) => {
    try {
      const response = await updateBidByJobIdAPI(data);
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);

// Get all bids by job id thunk
export const getAllBidsByJobId = createAsyncThunk(
  "bid/getAllBidsByJobId",
  async (data, thunkAPI) => {
    try {
      const response = await getAllBidsByJobIdAPI(data);
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);

// Get all my bids thunk
export const getAllMyBids = createAsyncThunk(
  "bid/getAllMyBids",
  async (_, thunkAPI) => {
    try {
      const response = await getAllMyBidsAPI();
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);

// Update bid status thunk — approve or reject a bid
// Payload: { bidId: string, status: 'approved' | 'rejected' }
export const updateBidStatus = createAsyncThunk(
  "bid/updateBidStatus",
  async (data, thunkAPI) => {
    try {
      const response = await updateBidStatusAPI(data);
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);