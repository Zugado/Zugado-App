import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAllChatsAPI,
  startNewChatAPI,
  getChatMessagesAPI,
  markChatReadAPI,
  sendMessageRestAPI,
  deleteChatAPI,
} from '../api/chatApi';
import { handleAxiosError } from '../../utils/handleAxiosError';

export const getAllChats = createAsyncThunk(
  'chat/getAllChats',
  async (data, thunkAPI) => {
    try {
      const response = await getAllChatsAPI(data);
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);

export const startNewChat = createAsyncThunk(
  'chat/startNewChat',
  async (data, thunkAPI) => {
    try {
      const response = await startNewChatAPI(data);
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);

export const getChatMessages = createAsyncThunk(
  'chat/getChatMessages',
  async (data, thunkAPI) => {
    try {
      const response = await getChatMessagesAPI(data);
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);

export const markChatRead = createAsyncThunk(
  'chat/markChatRead',
  async (chatId, thunkAPI) => {
    try {
      const response = await markChatReadAPI(chatId);
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);

export const sendMessageRest = createAsyncThunk(
  'chat/sendMessageRest',
  async (data, thunkAPI) => {
    try {
      const response = await sendMessageRestAPI(data);
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);

export const deleteChat = createAsyncThunk(
  'chat/deleteChat',
  async (chatId, thunkAPI) => {
    try {
      const response = await deleteChatAPI(chatId);
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);
