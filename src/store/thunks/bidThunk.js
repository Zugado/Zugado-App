import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  postBidByJobIdAPI,
  getAllBidsByJobIdAPI,
  getAllMyBidsAPI,
  approveBidAPI,
  rejectBidAPI,
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

// Approve bid thunk — PATCH /bids/bid/:bidId/status { status: 'approved' }
export const approveBid = createAsyncThunk(
  "bid/approveBid",
  async ({ bidId }, thunkAPI) => {
    try {
      const response = await approveBidAPI({ bidId });
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);

// Reject bid thunk — PATCH /bids/bid/:bidId/status { status: 'rejected', reason }
export const rejectBid = createAsyncThunk(
  "bid/rejectBid",
  async ({ bidId, rejectionReason }, thunkAPI) => {
    try {
      const response = await rejectBidAPI({ bidId, rejectionReason });
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);
