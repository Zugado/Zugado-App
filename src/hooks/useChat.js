import { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import {
  appendMessage,
  addOptimisticMessage,
  replaceOptimisticMessage,
  markMessagesRead,
  updateConversationLastMessage,
  incrementUnreadCount,
} from '../store/slices/chatSlice';

const SOCKET_URL = 'https://apiuat.zugado.com';
const TAG = '[useChat]';

export const useChat = chatId => {
  const dispatch = useDispatch();
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const currentUserIdRef = useRef(null);

  const [connected, setConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUserId, setTypingUserId] = useState(null);

  useEffect(() => {
    if (!chatId) {
      console.log(`${TAG} No chatId provided — skipping socket connection`);
      return;
    }

    console.log(`${TAG} Initialising socket for chatId: ${chatId}`);

    const initSocket = async () => {
      const token = await AsyncStorage.getItem('token');
      const userRaw = await AsyncStorage.getItem('user');
      try {
        const userObj = userRaw ? JSON.parse(userRaw) : null;
        currentUserIdRef.current = userObj?._id || null;
      } catch (e) {
        currentUserIdRef.current = null;
      }

      if (!token) {
        console.warn(`${TAG} No token found in AsyncStorage — cannot connect socket`);
        return;
      }

      console.log(`${TAG} Token found. Connecting to ${SOCKET_URL} ...`);

      const socket = io(SOCKET_URL, {
        auth: { token },
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 2000,
      });

      socketRef.current = socket;

      // ── connect ────────────────────────────────────────────────────────
      socket.on('connect', () => {
        console.log(`${TAG} ✅ Connected — socketId: ${socket.id}`);
        setConnected(true);
        console.log(`${TAG} 📤 Emitting join_chat — chatId: ${chatId}`);
        socket.emit('join_chat', { chatId });
      });

      // ── chat_joined ────────────────────────────────────────────────────
      socket.on('chat_joined', data => {
        console.log(`${TAG} ✅ chat_joined confirmed:`, JSON.stringify(data));
      });

      // ── disconnect ─────────────────────────────────────────────────────
      socket.on('disconnect', reason => {
        console.warn(`${TAG} ❌ Disconnected — reason: ${reason}`);
        setConnected(false);
      });

      // ── connect_error ──────────────────────────────────────────────────
      socket.on('connect_error', err => {
        console.error(`${TAG} 🔴 Connection error — ${err.message}`);
      });

      // ── reconnect_attempt ──────────────────────────────────────────────
      socket.io.on('reconnect_attempt', attempt => {
        console.log(`${TAG} 🔄 Reconnect attempt #${attempt}`);
      });

      socket.io.on('reconnect', attempt => {
        console.log(`${TAG} ✅ Reconnected after ${attempt} attempt(s)`);
      });

      socket.io.on('reconnect_failed', () => {
        console.error(`${TAG} 🔴 Reconnection failed after all attempts`);
      });

      // ── new_message ────────────────────────────────────────────────────
      socket.on('new_message', data => {
        console.log(`${TAG} 📩 new_message RAW data:`, JSON.stringify(data));
        console.log(
          `${TAG} 📩 new_message received — chatId: ${data?.chatId} | msgId: ${data?.message?._id} | text: "${data?.message?.message}"`,
        );

        // Server may return message directly as data.message or data itself
        const serverMsg = data?.message ?? data;

          // If server included a clientTempId, replace the optimistic message
          const clientTempId = serverMsg?.clientTempId || serverMsg?.clientTempID || null;

          // Ensure server message has a stable _id for list keys
          const safeServerMsg = {
            ...serverMsg,
            _id: serverMsg._id ?? `srv_${Date.now()}_${Math.random().toString(36).slice(2,8)}`,
            timestamp: serverMsg.timestamp ?? new Date().toISOString(),
          };

          if (clientTempId) {
            dispatch(replaceOptimisticMessage({ tempId: clientTempId, message: safeServerMsg }));
          } else {
            // No clientTempId — append server message. Our reducer's appendMessage has a
            // heuristic to replace any matching optimistic temp entries (same text + sender)
            // to avoid duplicates.
            dispatch(appendMessage(safeServerMsg));
          }

          dispatch(
            updateConversationLastMessage({
              chatId: data.chatId ?? safeServerMsg.chatId,
              lastMessage: safeServerMsg.message,
              lastMessageTime: safeServerMsg.timestamp,
            }),
          );
      });

      // ── user_typing ────────────────────────────────────────────────────
      socket.on('user_typing', data => {
        console.log(
          `${TAG} ✏️  user_typing — userId: ${data?.userId} | isTyping: ${data?.isTyping}`,
        );
        if (data.chatId === chatId) {
          setIsTyping(data.isTyping);
          setTypingUserId(data.isTyping ? data.userId : null);
        }
      });

      // ── messages_read ──────────────────────────────────────────────────
      socket.on('messages_read', data => {
        console.log(`${TAG} 👁️  messages_read — by userId: ${data?.userId}`);
        dispatch(markMessagesRead());
      });

      // ── error (server-side socket error) ──────────────────────────────
      socket.on('error', data => {
        console.error(`${TAG} 🔴 Server socket error — message: "${data?.message}"`);
      });
    };

    initSocket();

    return () => {
      if (socketRef.current) {
        console.log(`${TAG} 📤 Emitting leave_chat — chatId: ${chatId}`);
        socketRef.current.emit('leave_chat', { chatId });
        socketRef.current.disconnect();
        socketRef.current = null;
        console.log(`${TAG} Socket disconnected and cleaned up`);
      }
      clearTimeout(typingTimeoutRef.current);
    };
  }, [chatId, dispatch]);

  /**
   * Send a message via Socket.IO.
   * Logs clearly if socket is not ready so you can see why a send fails.
   */
  const sendMessage = useCallback(
    (text, messageType = 'text', fileData = null) => {
      if (!text?.trim()) {
        console.warn(`${TAG} sendMessage called with empty text — ignored`);
        return;
      }

      if (!socketRef.current) {
        console.warn(`${TAG} sendMessage failed — socket not initialised yet (chatId: ${chatId})`);
        return;
      }

      if (!socketRef.current.connected) {
        console.warn(
          `${TAG} sendMessage failed — socket exists but NOT connected (readyState: ${socketRef.current.connected}) | chatId: ${chatId}`,
        );
        return;
      }

      // create optimistic message and dispatch immediately
      const tempId = `temp_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
      const userId = currentUserIdRef.current || null;
      const optimisticMsg = {
        _id: tempId,
        senderId: userId,
        message: text.trim(),
        messageType,
        isRead: false,
        timestamp: new Date().toISOString(),
        status: 'sending',
      };
      dispatch(addOptimisticMessage(optimisticMsg));

      const payload = { chatId, message: text.trim(), messageType, clientTempId: tempId };
      if (fileData) {
        payload.fileUrl = fileData.fileUrl;
        payload.fileName = fileData.fileName;
        payload.fileSize = fileData.fileSize;
      }

      console.log(`${TAG} 📤 Emitting send_message — chatId: ${chatId} | text: "${text.trim()}" | type: ${messageType}`);
      socketRef.current.emit('send_message', payload);
    },
    [chatId, dispatch],
  );

  /**
   * Emit typing indicator. Auto-stops after 2 seconds.
   */
  const sendTyping = useCallback(
    isTypingNow => {
      if (!socketRef.current?.connected) return;
      socketRef.current.emit('typing', { chatId, isTyping: isTypingNow });
      if (isTypingNow) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
          socketRef.current?.emit('typing', { chatId, isTyping: false });
        }, 2000);
      }
    },
    [chatId],
  );

  /**
   * Emit mark_as_read to reset unread count for the other participant.
   */
  const markAsRead = useCallback(() => {
    if (!socketRef.current?.connected) {
      console.log(`${TAG} markAsRead skipped — socket not connected`);
      return;
    }
    console.log(`${TAG} 📤 Emitting mark_as_read — chatId: ${chatId}`);
    socketRef.current.emit('mark_as_read', { chatId });
  }, [chatId]);

  return { connected, isTyping, typingUserId, sendMessage, sendTyping, markAsRead };
};

/**
 * useGlobalChat — mounts a persistent socket at the app level (TabNavigator).
 * Listens for new_message events from ANY chat and increments the global
 * unread badge count in Redux whenever a message arrives from another user.
 * Does NOT join any specific chat room — just needs the auth connection.
 */
export const useGlobalChat = () => {
  const dispatch = useDispatch();
  const currentUserId = useSelector(state => state.auth.user?._id);
  const socketRef = useRef(null);

  useEffect(() => {
    let active = true;

    const init = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token || !active) return;

      const socket = io(SOCKET_URL, {
        auth: { token },
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 3000,
      });
      socketRef.current = socket;

      socket.on('new_message', data => {
        const msg = data?.message ?? data;
        // Only count messages sent by the OTHER user
        if (msg?.senderId && msg.senderId !== currentUserId) {
          dispatch(incrementUnreadCount());
        }
      });
    };

    init();

    return () => {
      active = false;
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  // Re-init if the logged-in user changes (login/logout)
  }, [currentUserId, dispatch]);
};
