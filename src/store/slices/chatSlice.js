import { createSlice } from '@reduxjs/toolkit';
import { getAllChats } from '../thunks/chatThunk';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    conversations: [],
    totalPages: 1,
    currentPage: 1,
    total: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearChats: state => {
      state.conversations = [];
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getAllChats.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllChats.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload?.data?.conversations || [];
        state.totalPages = action.payload?.data?.totalPages || 1;
        state.currentPage = action.payload?.data?.currentPage || 1;
        state.total = action.payload?.data?.total || 0;
      })
      .addCase(getAllChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch chats';
      });
  },
});

export const { clearChats } = chatSlice.actions;
export default chatSlice.reducer;
