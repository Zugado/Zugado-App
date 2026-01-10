import { createAsyncThunk } from '@reduxjs/toolkit';
import { 
  postBidByJobIdAPI, 
  getAllBidsByJobIdAPI, 
  getAllMyBidsAPI 
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
  async (data, thunkAPI) => {
    try {
      const response = await getAllMyBidsAPI(data);
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);