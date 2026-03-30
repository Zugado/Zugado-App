/**
 * chatSlice.js
 *
 * Redux slice for all chat-related state.
 *
 * State shape:
 *  conversations  — list of conversation previews shown in AllChatScreen
 *  messages       — messages for the currently open chat (ChatingScreen)
 *  activeChatId   — _id of the conversation whose messages are loaded
 *  hasMore        — whether older messages can be paginated
 *  loading        — conversations list loading flag
 *  messagesLoading — messages loading flag
 *
 * Reducers:
 *  appendMessage              — adds a single socket message (deduped by _id)
 *  markMessagesRead           — sets isRead=true on all loaded messages
 *  updateConversationLastMessage — updates preview text in the conversations list
 *  clearMessages              — called on ChatingScreen unmount
 *  clearChats                 — called on logout
 */

import { createSlice } from '@reduxjs/toolkit';
import { getAllChats, getChatMessages } from '../thunks/chatThunk';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    conversations: [],
    totalPages: 1,
    currentPage: 1,
    total: 0,
    loading: false,
    messages: [],
    messagesLoading: false,
    activeChatId: null,
    hasMore: false,
    error: null,
  },
  reducers: {
    /** Reset conversations list (e.g. on logout) */
    clearChats: state => {
      state.conversations = [];
      state.error = null;
    },

    /** Clear messages when leaving ChatingScreen so stale data doesn't flash */
    clearMessages: state => {
      state.messages = [];
      state.activeChatId = null;
      state.hasMore = false;
    },

    /**
     * Append a single message received via Socket.IO new_message event.
     * Deduplication guard prevents the same message appearing twice if
     * both REST and socket deliver it.
     */
    appendMessage: (state, action) => {
      const payload = action.payload;
      // If server provided an _id that already exists, ignore
      const existsById = state.messages.find(m => m._id === payload._id);
      if (existsById) return;

      // If there's an optimistic temp message with the same temp id (clientTempId matched elsewhere), replace it
      const tempMatchById = state.messages.findIndex(m => typeof m._id === 'string' && m._id === payload.clientTempId);
      if (tempMatchById !== -1) {
        state.messages[tempMatchById] = payload;
        return;
      }

      // Heuristic replacement: find a temp message with same sender and nearly-equal timestamp or identical text
      const tempIndex = state.messages.findIndex(m => {
        if (!(typeof m._id === 'string' && m._id.startsWith('temp_') && m.status === 'sending')) return false;
        if (m.senderId === payload.senderId && m.message === payload.message) return true;
        // fallback: compare timestamps (within 5s)
        try {
          const t1 = new Date(m.timestamp).getTime();
          const t2 = new Date(payload.timestamp).getTime();
          if (m.senderId === payload.senderId && Math.abs(t1 - t2) < 5000) return true;
        } catch (e) {}
        return false;
      });
      if (tempIndex !== -1) {
        state.messages[tempIndex] = payload;
        return;
      }

      // Final dedupe: if any existing message has same sender+text+timestamp within 5s, don't append duplicate
      const duplicate = state.messages.find(m => {
        if (m.senderId !== payload.senderId) return false;
        if (m.message !== payload.message) return false;
        try {
          const t1 = new Date(m.timestamp).getTime();
          const t2 = new Date(payload.timestamp).getTime();
          return Math.abs(t1 - t2) < 5000;
        } catch (e) {
          return false;
        }
      });
      if (duplicate) return;

      state.messages.push(payload);
    },

    /**
     * Add an optimistic message immediately to the UI while the server processes it.
     * Message _id should be a temp id (e.g. 'temp_...').
     */
    addOptimisticMessage: (state, action) => {
      state.messages.push(action.payload);
    },

    /**
     * Replace an optimistic message (temp id) with the server message once it arrives.
     * If no temp message is found, append the server message if it's not already present.
     */
    replaceOptimisticMessage: (state, action) => {
      const { tempId, message } = action.payload;
      const idx = state.messages.findIndex(m => m._id === tempId);
      const existsServer = state.messages.find(m => m._id === message._id);
      if (idx !== -1) {
        // replace the temp message in-place
        state.messages[idx] = message;
      } else if (!existsServer) {
        state.messages.push(message);
      }
    },

    /** Mark all loaded messages as read — triggered by messages_read socket event */
    markMessagesRead: state => {
      state.messages = state.messages.map(m => ({ ...m, isRead: true }));
    },

    /**
     * Update the last message preview in the conversations list.
     * Called after a new_message socket event so AllChatScreen stays in sync
     * without needing a full re-fetch.
     */
    updateConversationLastMessage: (state, action) => {
      const { chatId, lastMessage, lastMessageTime } = action.payload;
      const conv = state.conversations.find(c => c._id === chatId);
      if (conv) {
        conv.lastMessage = lastMessage;
        conv.lastMessageTime = lastMessageTime;
      }
    },
  },

  extraReducers: builder => {
    builder
      // ── getAllChats (conversations list) ──────────────────────────────
      .addCase(getAllChats.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllChats.fulfilled, (state, action) => {
        state.loading = false;
        // API response: { success, data: { conversations, totalPages, currentPage, total } }
        state.conversations = action.payload?.data?.conversations || [];
        state.totalPages = action.payload?.data?.totalPages || 1;
        state.currentPage = action.payload?.data?.currentPage || 1;
        state.total = action.payload?.data?.total || 0;
      })
      .addCase(getAllChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch chats';
      })

      // ── getChatMessages (messages for one chat) ───────────────────────
      .addCase(getChatMessages.pending, state => {
        state.messagesLoading = true;
      })
      .addCase(getChatMessages.fulfilled, (state, action) => {
        state.messagesLoading = false;
        // API response: { success, data: { chatId, messages, hasMore, ... } }
        state.messages = action.payload?.data?.messages || [];
        state.activeChatId = action.payload?.data?.chatId || null;
        state.hasMore = action.payload?.data?.hasMore || false;
      })
      .addCase(getChatMessages.rejected, state => {
        state.messagesLoading = false;
      });
  },
});

export const {
  clearChats,
  clearMessages,
  appendMessage,
  addOptimisticMessage,
  replaceOptimisticMessage,
  markMessagesRead,
  updateConversationLastMessage,
} = chatSlice.actions;

export default chatSlice.reducer;
