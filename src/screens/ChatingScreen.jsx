/**
 * ChatingScreen.jsx
 *
 * Real-time chat screen between a job creator and a bidder.
 *
 * Flow:
 *  1. On mount → REST GET /chat/:jobId/:participantId  loads previous messages into Redux
 *  2. useChat hook connects Socket.IO, joins the chat room, and listens for new_message /
 *     user_typing / messages_read events — all dispatched into Redux so the FlatList
 *     re-renders automatically.
 *  3. On send → socket.emit('send_message') is used as primary; the server echoes the
 *     message back via new_message so it appears in the list without optimistic updates.
 *  4. On unmount → socket emits leave_chat and disconnects; Redux messages are cleared.
 *
 * Key-prop warning fix:
 *  The previous version wrapped FlatList inside a ScrollView (via KeyboardAvoidingView
 *  containing a ScrollView), which caused React to warn about missing keys on VirtualizedList
 *  children.  Fixed by removing the intermediate ScrollView — KeyboardAvoidingView wraps
 *  the entire View directly.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MyStatusBar from '../components/MyStatusbar';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '../components/Header';
import { Colors } from '../styles/commonStyles';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { selectHasBidded } from '../store/selectors/jobSelectors';
import { getChatMessages, markChatRead } from '../store/thunks/chatThunk';
import { clearMessages, resetUnreadForChat } from '../store/slices/chatSlice';
import { useChat } from '../hooks/useChat';

/**
 * Predefined quick-chat messages shown when the user hasn't bid on the job yet.
 * These are tappable suggestion bubbles — clicking one navigates to BidPlacementScreen.
 */
const QUICK_CHAT_SUGGESTIONS = [
  'Tell me more about this job?',
  'Can we have a quick call?',
  'Is this job still available?',
  'What is the expected timeline?',
];

export default function ChatingScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  /**
   * chatData is the full conversation object passed from AllChatScreen.
   * It contains: _id (chatId), jobId { _id, title }, otherParticipant { _id, firstName, lastName, avatar }
   */
  const { chatData } = route.params || {};
  const chatId = chatData?._id;
  const currentUserId = useSelector(state => state.auth.user?._id || state.auth.user?.id);

  const otherParticipant = chatData?.otherParticipant ||
    chatData?.participants?.find(p => p?.userId?._id !== currentUserId)?.userId;

  const participants = chatData?.participants || [];
  const routeIsCreator = route.params?.isCreator;

  const [inputText, setInputText] = useState('');
  const flatListRef = useRef(null);

  const messages = useSelector(state => state.chat.messages || []);
  const messagesLoading = useSelector(state => state.chat.messagesLoading);

  /**
   * Determine chat access level from jobSlice:
   *
   * isCreator  — currentUserId created this job → full access always
   * hasBid     — currentUserId has an entry in appliedJobs for this job → full access
   * isChatUnlocked = isCreator || hasBid
   *
   * When locked: show predefined quick-chat bubbles + "Place a Bid" CTA.
   * When unlocked: show real message history + live input box.
   */
  const jobIdOfChat = chatData?.jobId?._id;

  // More reliable creator/bidder detection.
  // Prefer explicit creator id from chatData.jobId if available, otherwise
  // fall back to job slice arrays. This prevents false negatives where
  // createdJobs/appliedJobs haven't been populated yet.
  const isCreator = useSelector(state => {
    // Explicit flag from navigation (creator opening from CreatedByMe screen)
    if (routeIsCreator) return true;

    // Prefer participants array from chatData if backend returned it
    try {
      const participants = chatData?.participants || chatData?.data?.participants || null;
      if (Array.isArray(participants) && participants.length > 0 && currentUserId) {
        const me = participants.find(p => p?.userId?._id === currentUserId || p?.userId === currentUserId);
        if (me && (me.role === 'creator' || me.role === 'owner')) return true;
      }
    } catch (e) {
      // ignore and fallback
    }

    const jobCreatorId =
      chatData?.jobId?.createdBy?._id || chatData?.jobId?.creator?._id || chatData?.jobId?.userId || null;
    if (currentUserId && jobCreatorId && currentUserId === jobCreatorId) return true;
    return state.job.createdJobs?.some(j => j._id === jobIdOfChat);
  });

  // Use reusable selector to decide whether current user has bidded for this job
  const hasBid = useSelector(state => selectHasBidded(state, jobIdOfChat));

  // Chat is unlocked if user created the job OR has placed a bid on it
  const isChatUnlocked = Boolean(isCreator || hasBid);

  /**
   * useChat hook manages the Socket.IO lifecycle.
   * We pass chatId directly — no need to wait for activeChatId from REST.
   */
  const { connected, isTyping, typingUserId, sendMessage, sendTyping, markAsRead } = useChat(chatId);
  const [showQuickChats, setShowQuickChats] = useState(true);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [quickChatHeight, setQuickChatHeight] = useState(0);
  const [inputHeight, setInputHeight] = useState(56);
  
  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onKeyboardShow = e => {
      setKeyboardVisible(true);
      setKeyboardHeight(e?.endCoordinates?.height || 0);
    };
    const onKeyboardHide = () => {
      setKeyboardVisible(false);
      setKeyboardHeight(0);
    };

    const showSub = Keyboard.addListener(showEvent, onKeyboardShow);
    const hideSub = Keyboard.addListener(hideEvent, onKeyboardHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // Compute dynamic bottom padding so messages don't get hidden under quick chat card
  const basePadding = 10;
  const computedPadding = inputHeight + ( !isChatUnlocked && showQuickChats ? quickChatHeight : 0 ) + basePadding;
  const effectivePadding = keyboardVisible ? Math.max(computedPadding, keyboardHeight + basePadding) : computedPadding;

  // When quick chats visibility or measured heights change, ensure the list scrolls
  useEffect(() => {
    // small delay to allow layout to settle
    const t = setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 120);
    return () => clearTimeout(t);
  }, [showQuickChats, quickChatHeight, inputHeight]);

  /**
   * Step 1 — Load previous messages via REST on mount.
   * GET /api/chat/:chatId/messages  — chatId is the conversation _id from getAllChats
   */
  useEffect(() => {
    if (chatId) {
      dispatch(getChatMessages({ chatId }));
      dispatch(resetUnreadForChat(chatId));
    }
    return () => {
      dispatch(clearMessages());
    };
  }, [chatId, dispatch]);

  /**
   * Step 2 — Mark messages as read as soon as the screen opens.
   * Uses both socket (mark_as_read) and REST PATCH /chat/:chatId/read.
   */
  useEffect(() => {
    if (chatId) {
      markAsRead();
      dispatch(markChatRead(chatId));
    }
  }, [chatId, dispatch, markAsRead]);

  /**
   * When message items become viewable (enter the reading viewport) we should
   * mark them as read (like WhatsApp) so the sender receives a seen receipt.
   * We only trigger reads for messages authored by the other participant.
   */
  const viewabilityConfig = { itemVisiblePercentThreshold: 50 };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (!viewableItems || viewableItems.length === 0) return;
    const hasUnreadFromOther = viewableItems.some(v => {
      const m = v.item;
      return m && !m.isRead && m.senderId !== currentUserId;
    });
    if (hasUnreadFromOther) {
      // Emit socket mark_as_read and call REST to persist read state
      markAsRead();
      if (chatId) dispatch(markChatRead(chatId));
    }
  }).current;

  // Auto-scroll to the latest message whenever the list grows
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages.length]);

  /** Send message via Socket.IO and clear input */
  const handleSend = useCallback(() => {
    if (!inputText.trim()) return;
    if (!connected) {
      console.warn('[ChatingScreen] handleSend — socket not connected, cannot send');
      return;
    }
    console.log(`[ChatingScreen] Sending message: "${inputText.trim()}"`);
    sendMessage(inputText.trim());
    setInputText('');
    sendTyping(false);
  }, [inputText, sendMessage, sendTyping, connected]);

  /**
   * Send a predefined quick-chat message.
   * Logs connection state so you can debug why it may not send.
   */
  const handleQuickSend = useCallback(
    text => {
      console.log(`[ChatingScreen] Quick send tapped — text: "${text}" | connected: ${connected}`);
      if (!connected) {
        console.warn('[ChatingScreen] Quick send failed — socket not connected yet. Wait a moment and try again.');
        return;
      }
      sendMessage(text);
    },
    [connected, sendMessage],
  );

  /** Update input and emit typing indicator to the other participant */
  const handleTyping = useCallback(
    text => {
      setInputText(text);
      sendTyping(text.length > 0);
    },
    [sendTyping],
  );

  const formatTime = timestamp => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const hasAvatar = !!otherParticipant?.avatar;
  const otherName = otherParticipant
  ? `${otherParticipant.firstName || ''} ${otherParticipant.lastName || ''}`.trim()
  : participants
      ?.find(p => p.role === "creator")
      ?.firstName || "";

  /**
   * Renders a single chat bubble.
   * - Right-aligned (primary color) for messages sent by the current user
   * - Left-aligned (light gray) for messages from the other participant
   * - Shows timestamp + read receipt tick for sent messages
   */
  const renderMessage = useCallback(
    ({ item }) => {
      const isMine = item.senderId === currentUserId;
      return (
        <View
          style={[
            styles.messageBubble,
            isMine ? styles.myBubble : styles.theirBubble,
          ]}>
          {item.messageType === 'image' && item.fileUrl ? (
            // Image message — rendered as a thumbnail
            <Image source={{ uri: item.fileUrl }} style={styles.messageImage} />
          ) : (
            <Text style={[styles.messageText, isMine && styles.myMessageText]}>
              {item.message}
            </Text>
          )}
          <View style={styles.messageFooter}>
            <Text style={[styles.messageTime, isMine && styles.myMessageTime]}>
              {formatTime(item.timestamp)}
            </Text>
            {/* Read receipt: single tick = sent, double tick = read */}
            {isMine && (
              <MaterialIcons
                name={item.isRead ? 'done-all' : 'done'}
                size={12}
                color={item.isRead ? '#4FC3F7' : 'rgba(255,255,255,0.6)'}
                style={styles.footerIconMargin}
              />
            )}
          </View>
        </View>
      );
    },
    [currentUserId],
  );

  /**
   * Show locked state (Place a Bid) only when:
   * - socket is not connected AND
   * - no messages have been loaded AND
   * - not currently loading
   * This prevents the locked UI from flashing while messages are being fetched.
   */

  return (
    <SafeAreaView style={styles.safeAreaBlack}>
      <MyStatusBar />
      <Header showSearch={false} navigation={navigation} />

      {/**
       * KeyboardAvoidingView wraps the entire screen content directly —
       * NO intermediate ScrollView — this is the fix for the
       * "Each child in a list should have a unique key prop" warning
       * that occurred when FlatList was nested inside a ScrollView.
       */}
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 110 : 90}>
        <View style={styles.container}>
          {/* ── Chat Header: avatar, name, job title, online status ── */}
          <View style={styles.header}>
            {/* Back button — important for iOS devices without gesture navigation */}
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Feather name="arrow-left" size={22} color={Colors.blackColor} />
            </TouchableOpacity>

            {hasAvatar ? (
              <Image
                source={{ uri: otherParticipant.avatar }}
                style={styles.avatar}
              />
            ) : (
              // Fallback: show first letter of name when no avatar URL
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Text style={styles.avatarInitial}>
                  {otherParticipant?.firstName?.[0]?.toUpperCase() || '?'}
                </Text>
              </View>
            )}
            <View style={styles.userThings}>
              <View style={styles.userHeader}>
                <Text style={styles.usernameTop}>{otherName || 'User'}</Text>
                <TouchableOpacity style={styles.dotOption}>
                  <Feather
                    name="more-vertical"
                    size={16}
                    color={Colors.blackColor}
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.jobName} numberOfLines={1}>
                {chatData?.jobId?.title || 'Job'}
              </Text>
              {/* Online/offline dot — driven by socket connection state */}
              <View style={styles.statusRow}>
                <View
                  style={[
                    styles.statusDot,
                    connected ? styles.statusDotOnline : styles.statusDotOffline,
                  ]}
                />
                <Text style={styles.userStatus}>
                  {isTyping && typingUserId && typingUserId !== currentUserId
                    ? 'Typing...'
                    : connected
                    ? 'Online'
                    : 'Offline'}
                </Text>
              </View>
            </View>
          </View>

          {/* ── Safety warning banner ── */}
          <View style={styles.warningContainer}>
            <View style={styles.warningBox}>
              <MaterialIcons name="work" size={16} color={Colors.grayColor} />
              <Text style={styles.warningText}>
                Do not Share Mobile Number Until Finalized
              </Text>
            </View>
          </View>

          {/* ── Main chat area ── */}
          <View style={styles.chatContainer}>
            {messagesLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
              </View>
            ) : (
              <>
                {/* Always render the messages list so optimistic quick messages appear */}
                <FlatList
                  ref={flatListRef}
                  data={messages}
                  keyExtractor={(item, index) => item._id ?? `msg_${index}`}
                  renderItem={renderMessage}
                  onViewableItemsChanged={onViewableItemsChanged}
                  viewabilityConfig={viewabilityConfig}
                  contentContainerStyle={[
                    styles.messagesListDefault,
                    { paddingBottom: effectivePadding },
                  ]}
                  showsVerticalScrollIndicator={false}
                  ListEmptyComponent={
                    <View style={styles.emptyChat}>
                      {isChatUnlocked ? (
                        <Text style={styles.emptyChatText}>No messages yet. Say hello! 👋</Text>
                      ) : (
                        <View style={styles.aiBubble}>
                          <Text style={styles.aiBubbleLabel}>🤖 Quick chat</Text>
                          <Text style={styles.aiBubbleText}>
                            Tap a quick message below to send it to the other user.
                          </Text>
                        </View>
                      )}
                    </View>
                  }
                />

                {/* Quick chat floating panel — anchored above the input so it doesn't push the input down */}
                {!isChatUnlocked && (
                  <View
                    style={styles.quickChatFloating}
                    pointerEvents={connected ? 'auto' : 'none'}
                    onLayout={e => {
                      const h = e.nativeEvent.layout.height || 0;
                      setQuickChatHeight(h);
                    }}
                  >
                    <View style={styles.quickChatCard}>
                      <View style={styles.quickChatHeader}>
                        <Text style={styles.quickChatTitle}>Quick chat</Text>
                        <View style={styles.quickChatHeaderRight}>
                          <View style={styles.lockBadge}>
                            <Feather name="lock" size={12} color={Colors.grayColor} />
                            <Text style={styles.lockBadgeText}>Bid to unlock</Text>
                          </View>
                          <TouchableOpacity onPress={() => setShowQuickChats(s => !s)} style={styles.quickChatToggle}>
                            <Feather name={showQuickChats ? 'chevron-down' : 'chevron-up'} size={16} color={Colors.grayColor} />
                          </TouchableOpacity>
                        </View>
                      </View>

                      {showQuickChats && QUICK_CHAT_SUGGESTIONS.map((text, index) => (
                        <TouchableOpacity
                          key={index}
                          style={[styles.quickBubble, !connected && styles.quickBubbleDisabled]}
                          onPress={() => handleQuickSend(text)}
                          activeOpacity={connected ? 0.85 : 1}
                        >
                          <Text style={styles.quickBubbleText}>{text}</Text>
                          <View style={[styles.quickBubbleIconWrap, !connected && styles.quickBubbleDisabled]}> 
                            <Feather
                              name="arrow-right"
                              size={14}
                              color={connected ? Colors.primary : Colors.grayColor}
                            />
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}
              </>
            )}

            {/* Typing indicator — show whenever the other user types (even when locked)
                so receiver sees live typing feedback */}
            {isTyping && (
              <View style={styles.typingIndicator}>
                <Text style={styles.typingText}>{otherName} is typing...</Text>
              </View>
            )}

            {/* ── Bottom action area ── */}
              {isChatUnlocked ? (
              // UNLOCKED: live text input + send button
              <View
                style={styles.inputRow}
                onLayout={e => {
                  const h = e.nativeEvent.layout.height || 56;
                  setInputHeight(h);
                }}
              >
                <TextInput
                  style={styles.textInput}
                  value={inputText}
                  onChangeText={handleTyping}
                  placeholder="Type a message..."
                  placeholderTextColor={Colors.grayColor}
                  multiline
                  maxLength={500}
                />
                <TouchableOpacity
                  style={[
                    styles.sendButton,
                    !inputText.trim() && styles.sendButtonDisabled,
                  ]}
                  onPress={handleSend}
                  disabled={!inputText.trim()}>
                  <Feather name="send" size={18} color={Colors.whiteColor} />
                </TouchableOpacity>
              </View>
            ) : (
              // LOCKED: disabled input + Place a Bid CTA
              <View style={styles.bottomButtons}>
                <View style={styles.unlockButton}>
                  <Feather name="lock" size={14} color={Colors.grayColor} style={styles.lockIconMargin} />
                  <Text style={styles.unlockButtonText}>Chat will Unlock After Bidding</Text>
                </View>
                <TouchableOpacity
                  style={styles.bidButton}
                  onPress={() =>
                    navigation.navigate('BidPlacementScreen', {
                      job: chatData?.jobId?._id
                        ? chatData.jobId
                        : { _id: chatData?.jobId },
                    })
                  }>
                  <Text style={styles.bidButtonText}>Place a Bid</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaBlack: { flex: 1, backgroundColor: Colors.bodyBackColor },
  keyboardView: { flex: 1 },
  container: {
    flex: 1,
    marginTop: -20,
    backgroundColor: Colors.bodyBackColor,
    overflow: 'hidden',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: Colors.whiteColor,
    borderBottomColor: '#bab9b9',
    borderBottomWidth: 0.5,
  },
  backButton: {
    padding: 4,
    marginRight: 8,
  },
  avatar: { width: 60, height: 60, borderRadius: 30 },
  avatarPlaceholder: {
    backgroundColor: Colors.extraLightGrayColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: { fontSize: 22, fontWeight: '700', color: Colors.grayColor },
  userThings: { flex: 1, marginLeft: 12 },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  usernameTop: { fontSize: 18, fontWeight: 'bold', color: Colors.blackColor },
  dotOption: { padding: 4, marginRight: 10 },
  jobName: {
    fontSize: 12,
    color: Colors.blackColor,
    fontWeight: '500',
    marginBottom: 2,
  },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  userStatus: { fontSize: 10, color: Colors.grayColor },
  warningContainer: { paddingHorizontal: 10, paddingTop: 8 },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.whiteColor,
    elevation: 2,
    padding: 10,
    borderRadius: 10,
    gap: 8,
  },
  warningText: { flex: 1, fontSize: 12, color: Colors.blackColor },
  chatContainer: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
    marginTop: 8,
    paddingHorizontal: 10,
    paddingTop: 4,
  },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  messagesList: { paddingVertical: 10, flexGrow: 1 },
  emptyChat: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 60 },
  emptyChatText: { color: Colors.grayColor, fontSize: 14 },
  messageBubble: {
    maxWidth: '75%',
    marginVertical: 3,
    padding: 10,
    borderRadius: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 1,
  },
  myBubble: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  theirBubble: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.extraLightGrayColor,
    borderBottomLeftRadius: 4,
  },
  messageText: { fontSize: 13, color: Colors.blackColor, lineHeight: 18 },
  myMessageText: { color: Colors.whiteColor },
  messageImage: { width: 180, height: 140, borderRadius: 10 },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  footerIconMargin: { marginLeft: 4 },
  messageTime: { fontSize: 9, color: Colors.grayColor },
  myMessageTime: { color: 'rgba(255,255,255,0.7)' },
  typingIndicator: { paddingHorizontal: 4, paddingBottom: 4 },
  typingText: { fontSize: 11, color: Colors.grayColor, fontStyle: 'italic' },
  statusDotOnline: { backgroundColor: Colors.greenColor },
  statusDotOffline: { backgroundColor: '#ccc' },
  quickChatFloating: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 102,
    zIndex: 20,
  },
  quickChatCard: {
    backgroundColor: Colors.whiteColor,
    borderRadius: 14,
    padding: 12,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  quickBubbleIconWrap: {
    marginLeft: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f2f9ff',
  },
  quickChatHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  quickChatToggle: {
    padding: 6,
    marginLeft: 8,
    borderRadius: 8,
  },
  messagesListWithFooter: { paddingVertical: 10, paddingBottom: 300, flexGrow: 1 },
  messagesListDefault: { paddingVertical: 10, flexGrow: 1 },
  inputRow: {
    zIndex: 30,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingVertical: 8,
    gap: 8,
    borderTopWidth: 0.5,
    borderTopColor: Colors.extraLightGrayColor,
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: Colors.extraLightGrayColor,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 13,
    color: Colors.blackColor,
    backgroundColor: '#f9f9f9',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: { backgroundColor: Colors.extraLightGrayColor },
  bottomButtons: { paddingTop: 10 },
  unlockButton: {
    flexDirection: 'row',
    backgroundColor: Colors.extraLightGrayColor,
    borderWidth: 0.3,
    borderColor: Colors.grayColor,
    elevation: 2,
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unlockButtonText: { color: Colors.blackColor, fontSize: 13 },
  bidButton: {
    backgroundColor: '#e86b18',
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
    alignItems: 'center',
  },
  bidButtonText: { color: Colors.whiteColor, fontWeight: '500', fontSize: 13 },

  // ── Locked / predefined quick-chat styles ──────────────────────────────
  lockedChatArea: {
    flex: 1,
    paddingVertical: 10,
  },
  quickChatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickChatTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.blackColor,
  },
  lockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.extraLightGrayColor,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  lockIconMargin: { marginRight: 6 },
  lockBadgeText: {
    fontSize: 11,
    color: Colors.grayColor,
  },
  // Predefined suggestion bubble — right-aligned, mimics a sent message
  quickBubble: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.whiteColor,
    borderWidth: 1,
    borderColor: '#e6e6e6',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginVertical: 6,
    maxWidth: '82%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  quickBubbleDisabled: {
    opacity: 0.45,
  },
  quickBubbleText: {
    flex: 1,
    fontSize: 13,
    color: Colors.blackColor,
  },
  // AI reply bubble — left-aligned, mimics a received message
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.extraLightGrayColor,
    borderWidth: 0.2,
    borderColor: Colors.blackColor,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginVertical: 4,
    maxWidth: '80%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  aiBubbleLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.grayColor,
    marginBottom: 4,
  },
  aiBubbleText: {
    fontSize: 13,
    color: Colors.blackColor,
  },
});
