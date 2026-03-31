# Zugado Chat System — Integration Kit

> Yeh document mobile/web app developers ke liye hai jo Zugado backend ka chat system integrate karna chahte hain.

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Authentication](#authentication)
4. [REST API Endpoints](#rest-api-endpoints)
5. [Socket.IO Real-time Events](#socketio-real-time-events)
6. [File Upload](#file-upload)
7. [Complete Flow — Step by Step](#complete-flow)
8. [React Native Integration Example](#react-native-integration-example)
9. [Flutter Integration Example](#flutter-integration-example)
10. [Error Codes Reference](#error-codes-reference)
11. [Business Rules](#business-rules)

---

## Overview

Zugado ka chat system **job-based** hai — sirf job creator aur us job ke bidders ke beech chat ho sakti hai.

**Technology Stack:**
- REST API — HTTP endpoints (initiate, fetch, delete)
- Socket.IO — Real-time messaging (send, receive, typing)
- AWS S3 — File storage

**Base URL:**
```
Production : https://api.zugado.com
UAT        : https://uat-api.zugado.com
Local      : http://localhost:5000
```

---

## Prerequisites

Chat initiate karne se pehle yeh steps complete hone chahiye:

```
1. User registered & logged in  →  JWT token milega
2. Job exist karta ho           →  jobId chahiye
3. Bidder ne bid lagayi ho      →  tabhi chat allowed hai
```

> **Note:** Job creator kisi bhi bidder se chat initiate kar sakta hai bina bid ke. Bidder ko pehle bid lagani hogi.

---

## Authentication

Har REST request mein header mein JWT token bhejo:

```
Authorization: Bearer <your_jwt_token>
```

Socket.IO connection mein token auth object mein do:

```javascript
const socket = io('https://api.zugado.com', {
  auth: {
    token: 'your_jwt_token'
  }
});
```

---

## REST API Endpoints

### 1. Chat Initiate Karo

**POST** `/api/chat/initiate`

Naya chat shuru karo ya existing chat wapas lo.

**Request:**
```json
{
  "jobId": "65abc123def456789",
  "participantId": "65xyz789abc123456"
}
```

**Response (201 — naya chat):**
```json
{
  "success": true,
  "message": "Chat initiated successfully",
  "data": {
    "_id": "65chat123456",
    "jobId": {
      "_id": "65abc123def456789",
      "title": "Need a plumber",
      "jobType": "quick"
    },
    "participants": [
      {
        "userId": {
          "_id": "65user001",
          "firstName": "Rahul",
          "lastName": "Sharma",
          "avatar": "https://s3.amazonaws.com/..."
        },
        "role": "creator"
      },
      {
        "userId": {
          "_id": "65user002",
          "firstName": "Amit",
          "lastName": "Kumar",
          "avatar": "https://s3.amazonaws.com/..."
        },
        "role": "bidder"
      }
    ],
    "messages": [],
    "lastMessage": "",
    "lastMessageTime": "2024-01-15T10:30:00Z",
    "unreadCount": [
      { "userId": "65user001", "count": 0 },
      { "userId": "65user002", "count": 0 }
    ]
  }
}
```

> **Tip:** Agar chat pehle se exist karta hai toh same response milega status 200 ke saath. `_id` save kar lo — yahi `chatId` hai.

---

### 2. Saari Conversations Lo

**GET** `/api/chat/conversations?page=1&limit=20`

Logged-in user ki saari chat list.

**Response:**
```json
{
  "success": true,
  "data": {
    "conversations": [
      {
        "_id": "65chat123456",
        "jobId": {
          "_id": "65abc123def456789",
          "title": "Need a plumber",
          "jobType": "quick",
          "location": {}
        },
        "otherParticipant": {
          "_id": "65user002",
          "firstName": "Amit",
          "lastName": "Kumar",
          "avatar": "https://..."
        },
        "lastMessage": "Kal aa sakta hoon",
        "lastMessageTime": "2024-01-15T10:30:00Z",
        "unreadCount": 3
      }
    ],
    "totalPages": 2,
    "currentPage": 1,
    "total": 25
  }
}
```

---

### 3. Chat Messages Lo

**GET** `/api/chat/:jobId/:participantId?page=1&limit=50`

Kisi specific job ke chat ke messages.

**Response:**
```json
{
  "success": true,
  "data": {
    "chatId": "65chat123456",
    "job": {
      "_id": "65abc123def456789",
      "title": "Need a plumber",
      "amount": { "min": 500, "max": 1000 }
    },
    "otherParticipant": {
      "_id": "65user002",
      "firstName": "Amit",
      "lastName": "Kumar",
      "avatar": "https://..."
    },
    "messages": [
      {
        "_id": "65msg001",
        "senderId": "65user002",
        "message": "Hello, main interested hoon",
        "messageType": "text",
        "isRead": true,
        "timestamp": "2024-01-15T10:30:00Z"
      },
      {
        "_id": "65msg002",
        "senderId": "65user001",
        "message": "Theek hai, kab aa sakte ho?",
        "messageType": "text",
        "isRead": false,
        "timestamp": "2024-01-15T10:35:00Z"
      }
    ],
    "totalMessages": 15,
    "hasMore": false,
    "currentPage": 1
  }
}
```

> **Pagination:** Purane messages ke liye `page=2`, `page=3` use karo. `hasMore: true` matlab aur messages hain.

---

### 4. Message Bhejo (REST Fallback)

**POST** `/api/chat/:chatId/message`

Socket.IO available na ho tab use karo.

**Request:**
```json
{
  "message": "Kal subah 10 baje aa sakta hoon",
  "messageType": "text"
}
```

**messageType values:** `text` | `image` | `file`

**Response (201):**
```json
{
  "success": true,
  "data": {
    "message": {
      "_id": "65msg003",
      "senderId": "65user001",
      "message": "Kal subah 10 baje aa sakta hoon",
      "messageType": "text",
      "isRead": false,
      "timestamp": "2024-01-15T10:40:00Z"
    }
  }
}
```

---

### 5. Messages Read Mark Karo

**PATCH** `/api/chat/:chatId/read`

Chat open karne par call karo — unread count reset ho jaayega.

**Response:**
```json
{
  "success": true,
  "data": { "updatedCount": 3 }
}
```

---


### 6. Chat Delete Karo

**DELETE** `/api/chat/:chatId`

Soft delete — chat inactive ho jaata hai.

**Response:**
```json
{
  "success": true,
  "message": "Chat deleted successfully",
  "data": null
}
```

---

## Socket.IO Real-time Events

### Connection Setup

```javascript
import { io } from 'socket.io-client';

const socket = io('https://api.zugado.com', {
  auth: { token: 'your_jwt_token' },
  transports: ['websocket'],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000
});

socket.on('connect', () => console.log('Connected:', socket.id));
socket.on('disconnect', (reason) => console.log('Disconnected:', reason));
socket.on('connect_error', (err) => console.error('Connection error:', err.message));
```

---

### Events Summary Table

| Direction | Event Name | Description |
|-----------|-----------|-------------|
| **Emit** (bhejo) | `join_chat` | Chat room join karo |
| **Emit** | `send_message` | Message bhejo |
| **Emit** | `typing` | Typing indicator |
| **Emit** | `mark_as_read` | Messages read karo |
| **Emit** | `leave_chat` | Chat room chhodo |
| **Listen** (suno) | `chat_joined` | Room join confirm |
| **Listen** | `new_message` | Naya message aaya |
| **Listen** | `user_typing` | Doosra user type kar raha hai |
| **Listen** | `messages_read` | Messages read ho gaye |
| **Listen** | `error` | Error aaya |

---

### Event Details

#### join_chat — Chat Room Join Karo

Chat screen open karte hi yeh emit karo:

```javascript
socket.emit('join_chat', { chatId: '65chat123456' });

socket.on('chat_joined', (data) => {
  // data = { chatId: '65chat123456', message: 'Successfully joined chat' }
  console.log('Room joined:', data.chatId);
});
```

---

#### send_message — Message Bhejo

```javascript
// Text message
socket.emit('send_message', {
  chatId: '65chat123456',
  message: 'Hello bhai, kab free ho?',
  messageType: 'text'
});

// File/Image message (pehle REST se upload karo, phir URL bhejo)
socket.emit('send_message', {
  chatId: '65chat123456',
  message: 'File bhej raha hoon',
  messageType: 'image',       // 'image' ya 'file'
  fileUrl: 'https://s3.amazonaws.com/...',
  fileName: 'photo.jpg',
  fileSize: 245678
});

// Naya message receive karo (dono participants ko milega)
socket.on('new_message', (data) => {
  // data.chatId  — kis chat ka message hai
  // data.message — message object
  console.log('New message:', data.message);
  // {
  //   _id: '65msg004',
  //   senderId: '65user001',
  //   message: 'Hello bhai, kab free ho?',
  //   messageType: 'text',
  //   isRead: false,
  //   timestamp: '2024-01-15T10:45:00Z'
  // }
});
```

---

#### typing — Typing Indicator

```javascript
// User type karna shuru kare
socket.emit('typing', { chatId: '65chat123456', isTyping: true });

// User type karna band kare
socket.emit('typing', { chatId: '65chat123456', isTyping: false });

// Doosre user ki typing status suno
socket.on('user_typing', (data) => {
  // data = { chatId, userId, isTyping: true/false }
  if (data.isTyping) {
    showTypingIndicator();
  } else {
    hideTypingIndicator();
  }
});
```

---

#### mark_as_read — Read Receipt

```javascript
socket.emit('mark_as_read', { chatId: '65chat123456' });

// Doosre user ko pata chalega ki messages read ho gaye
socket.on('messages_read', (data) => {
  // data = { chatId, userId }
  updateReadReceipts(data.userId);
});
```

---

#### leave_chat — Room Chhodo

Chat screen se bahar jaate waqt:

```javascript
socket.emit('leave_chat', { chatId: '65chat123456' });
```

---

#### error — Error Handle Karo

```javascript
socket.on('error', (data) => {
  console.error('Socket error:', data.message);
  // Possible messages:
  // 'Authentication required'
  // 'Chat not found'
  // 'Not authorized to join this chat'
  // 'Message cannot be empty'
  // 'Not authorized'
  // 'Failed to join chat'
  // 'Failed to send message'
});
```

---

## File Upload

Pehle file upload karo, phir URL socket se bhejo.

**POST** `/api/chat/:chatId/upload`

```
Content-Type: multipart/form-data
Authorization: Bearer <token>

Body: file = <binary>
```

**Allowed Types:** JPEG, PNG, GIF, PDF, DOC, DOCX  
**Max Size:** 5MB

**Response:**
```json
{
  "success": true,
  "data": {
    "fileUrl": "https://s3.amazonaws.com/zugado/chat-files/65chat123456/uuid.jpg",
    "fileName": "photo.jpg",
    "fileSize": 245678,
    "mimeType": "image/jpeg"
  }
}
```

**Upload ke baad message bhejo:**
```javascript
socket.emit('send_message', {
  chatId: '65chat123456',
  message: 'Image bhej raha hoon',
  messageType: 'image',
  fileUrl: 'https://s3.amazonaws.com/...',
  fileName: 'photo.jpg',
  fileSize: 245678
});
```

---

## Complete Flow

### Step 1 — Login karke token lo
```
POST /api/auth/verifyOTP  →  JWT token save karo
```

### Step 2 — Job pe bid lagao (agar bidder ho)
```
POST /api/bids  →  bid create karo
```

### Step 3 — Chat initiate karo
```
POST /api/chat/initiate
Body: { jobId, participantId }
→  chatId save karo
```

### Step 4 — Socket connect karo
```javascript
const socket = io(BASE_URL, { auth: { token } });
```

### Step 5 — Chat room join karo
```javascript
socket.emit('join_chat', { chatId });
```

### Step 6 — Purane messages load karo
```
GET /api/chat/:jobId/:participantId
```

### Step 7 — Real-time messaging
```javascript
// Bhejo
socket.emit('send_message', { chatId, message, messageType: 'text' });

// Suno
socket.on('new_message', (data) => addMessageToUI(data.message));
```

### Step 8 — Chat screen close karo
```javascript
socket.emit('leave_chat', { chatId });
// PATCH /api/chat/:chatId/read  ← unread reset karo
```

---

## React Native Integration Example

```javascript
// hooks/useChat.js
import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const BASE_URL = 'https://api.zugado.com';

export const useChat = (token, chatId) => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (!token || !chatId) return;

    socketRef.current = io(BASE_URL, {
      auth: { token },
      transports: ['websocket']
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      setConnected(true);
      socket.emit('join_chat', { chatId });
    });

    socket.on('new_message', (data) => {
      setMessages(prev => [...prev, data.message]);
    });

    socket.on('user_typing', (data) => {
      setIsTyping(data.isTyping);
    });

    socket.on('messages_read', () => {
      setMessages(prev =>
        prev.map(msg => ({ ...msg, isRead: true }))
      );
    });

    socket.on('disconnect', () => setConnected(false));

    return () => {
      socket.emit('leave_chat', { chatId });
      socket.disconnect();
    };
  }, [token, chatId]);

  const sendMessage = (text) => {
    if (!socketRef.current || !text.trim()) return;
    socketRef.current.emit('send_message', {
      chatId,
      message: text.trim(),
      messageType: 'text'
    });
  };

  const sendTyping = (isTypingNow) => {
    if (!socketRef.current) return;
    socketRef.current.emit('typing', { chatId, isTyping: isTypingNow });

    if (isTypingNow) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socketRef.current?.emit('typing', { chatId, isTyping: false });
      }, 2000);
    }
  };

  const markAsRead = () => {
    socketRef.current?.emit('mark_as_read', { chatId });
  };

  return { messages, isTyping, connected, sendMessage, sendTyping, markAsRead };
};
```

```javascript
// screens/ChatScreen.js
import React, { useState, useEffect } from 'react';
import { View, FlatList, TextInput, TouchableOpacity, Text } from 'react-native';
import { useChat } from '../hooks/useChat';

export default function ChatScreen({ route }) {
  const { chatId, jobId, participantId, token, currentUserId } = route.params;
  const [inputText, setInputText] = useState('');
  const { messages, isTyping, connected, sendMessage, sendTyping, markAsRead } = useChat(token, chatId);

  useEffect(() => {
    // Chat open hote hi messages read mark karo
    markAsRead();
    // Purane messages REST se load karo
    fetchOldMessages();
  }, []);

  const fetchOldMessages = async () => {
    const res = await fetch(`${BASE_URL}/api/chat/${jobId}/${participantId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    // setMessages(data.data.messages); — initial load ke liye
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMessage(inputText);
    setInputText('');
  };

  const handleTyping = (text) => {
    setInputText(text);
    sendTyping(text.length > 0);
  };

  return (
    <View style={{ flex: 1 }}>
      {!connected && <Text style={{ textAlign: 'center', color: 'red' }}>Connecting...</Text>}
      {isTyping && <Text style={{ padding: 8, color: 'gray' }}>Typing...</Text>}

      <FlatList
        data={messages}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={{
            alignSelf: item.senderId === currentUserId ? 'flex-end' : 'flex-start',
            backgroundColor: item.senderId === currentUserId ? '#007AFF' : '#E5E5EA',
            padding: 10,
            margin: 4,
            borderRadius: 12,
            maxWidth: '75%'
          }}>
            <Text style={{ color: item.senderId === currentUserId ? 'white' : 'black' }}>
              {item.message}
            </Text>
          </View>
        )}
      />

      <View style={{ flexDirection: 'row', padding: 8 }}>
        <TextInput
          style={{ flex: 1, borderWidth: 1, borderRadius: 20, paddingHorizontal: 12 }}
          value={inputText}
          onChangeText={handleTyping}
          placeholder="Message likho..."
        />
        <TouchableOpacity onPress={handleSend} style={{ padding: 10 }}>
          <Text>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
```

---

## Flutter Integration Example

```dart
// pubspec.yaml mein add karo:
// socket_io_client: ^2.0.3+1
// http: ^1.1.0

import 'package:socket_io_client/socket_io_client.dart' as IO;
import 'package:http/http.dart' as http;
import 'dart:convert';

class ChatService {
  static const String baseUrl = 'https://api.zugado.com';
  late IO.Socket socket;
  final String token;
  final String chatId;

  Function(Map<String, dynamic>)? onNewMessage;
  Function(bool)? onTyping;

  ChatService({required this.token, required this.chatId});

  void connect() {
    socket = IO.io(baseUrl, IO.OptionBuilder()
      .setTransports(['websocket'])
      .setAuth({'token': token})
      .enableReconnection()
      .build());

    socket.onConnect((_) {
      print('Connected');
      socket.emit('join_chat', {'chatId': chatId});
    });

    socket.on('new_message', (data) {
      onNewMessage?.call(Map<String, dynamic>.from(data['message']));
    });

    socket.on('user_typing', (data) {
      onTyping?.call(data['isTyping'] as bool);
    });

    socket.onDisconnect((_) => print('Disconnected'));
  }

  void sendMessage(String message) {
    socket.emit('send_message', {
      'chatId': chatId,
      'message': message,
      'messageType': 'text',
    });
  }

  void sendTyping(bool isTyping) {
    socket.emit('typing', {'chatId': chatId, 'isTyping': isTyping});
  }

  void markAsRead() {
    socket.emit('mark_as_read', {'chatId': chatId});
  }

  void disconnect() {
    socket.emit('leave_chat', {'chatId': chatId});
    socket.disconnect();
  }

  // REST: Purane messages fetch karo
  Future<List<dynamic>> fetchMessages(String jobId, String participantId) async {
    final res = await http.get(
      Uri.parse('$baseUrl/api/chat/$jobId/$participantId'),
      headers: {'Authorization': 'Bearer $token'},
    );
    final data = jsonDecode(res.body);
    return data['data']['messages'];
  }

  // REST: Chat initiate karo
  Future<Map<String, dynamic>> initiateChat(String jobId, String participantId) async {
    final res = await http.post(
      Uri.parse('$baseUrl/api/chat/initiate'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
      body: jsonEncode({'jobId': jobId, 'participantId': participantId}),
    );
    return jsonDecode(res.body)['data'];
  }
}
```

---

## Error Codes Reference

| HTTP Code | Error Code | Matlab | Solution |
|-----------|-----------|--------|----------|
| 404 | `CHAT_NOT_FOUND` | Chat exist nahi karta | Pehle `/initiate` call karo |
| 403 | `NOT_PARTICIPANT` | User is chat mein nahi | Sahi chatId use karo |
| 404 | `JOB_NOT_FOUND` | Job exist nahi | Valid jobId do |
| 400 | `SELF_CHAT_NOT_ALLOWED` | Khud se chat nahi | Doosre user ka ID do |
| 403 | `BID_REQUIRED` | Bid nahi lagayi | Pehle bid lagao |
| 429 | `RATE_LIMIT_EXCEEDED` | Bahut zyada messages | 1 minute wait karo |
| 400 | `EMPTY_MESSAGE` | Message empty hai | Message text do |
| 400 | `INVALID_FILE_TYPE` | File type allowed nahi | JPEG/PNG/PDF/DOC use karo |
| 400 | `FILE_TOO_LARGE` | File 5MB se badi | File compress karo |

---

## Business Rules

1. Chat sirf **job creator ↔ bidder** ke beech hoti hai
2. Bidder ko **pehle bid lagani hogi** chat ke liye
3. Ek job ke liye **ek hi chat thread** hogi do users ke beech
4. **Khud se chat** allowed nahi
5. Message rate limit: **20 messages/minute**
6. File size limit: **5MB**
7. Allowed file types: **JPEG, PNG, GIF, PDF, DOC, DOCX**
8. Chat delete = **soft delete** (data rehta hai, sirf inactive hota hai)
9. Socket mein message bhejne par **dono participants** ko `new_message` event milta hai
10. Unread count **automatically update** hota hai

---

## Quick Reference Card

```
CHAT INITIATE    POST   /api/chat/initiate
CONVERSATIONS    GET    /api/chat/conversations
MESSAGES         GET    /api/chat/:jobId/:participantId
SEND (REST)      POST   /api/chat/:chatId/message
MARK READ        PATCH  /api/chat/:chatId/read
DELETE           DELETE /api/chat/:chatId
FILE UPLOAD      POST   /api/chat/:chatId/upload

SOCKET EMIT:  join_chat | send_message | typing | mark_as_read | leave_chat
SOCKET LISTEN: chat_joined | new_message | user_typing | messages_read | error
```

---

*Last updated: Zugado Backend v1 | Socket.IO v4*
