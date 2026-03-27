import { createAsyncThunk } from '@reduxjs/toolkit';
import { 
  getAllChatsAPI,
  startNewChatAPI, 
  getAllMyBidsAPI 
} from '../api/chatApi';
import { handleAxiosError } from '../../utils/handleAxiosError';

// Get all chats thunk
export const getAllChats = createAsyncThunk(
  "chat/getAllChats",
  async (data, thunkAPI) => {
    try {
      const response = await getAllChatsAPI(data);
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);

// Start new chat thunk
export const startNewChat = createAsyncThunk(
  "chat/startNewChat",
  async (data, thunkAPI) => {
    try {
      const response = await startNewChatAPI(data);
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