# Zugado Chat — Postman Testing Guidebook

> Complete step-by-step guide to test all REST endpoints and Socket.IO WebSocket events using Postman.

---

## Table of Contents

1. [Setup — Environment Variables](#1-setup--environment-variables)
2. [Get Your Token](#2-get-your-token)
3. [REST API Tests](#3-rest-api-tests)
   - [Initiate Chat](#31-initiate-chat)
   - [Get All Conversations](#32-get-all-conversations)
   - [Get Chat Messages](#33-get-chat-messages)
   - [Send Message (REST Fallback)](#34-send-message-rest-fallback)
   - [Mark Messages as Read](#35-mark-messages-as-read)
   - [Upload File](#36-upload-file)
   - [Delete Chat](#37-delete-chat)
4. [WebSocket (Socket.IO) Tests](#4-websocket-socketio-tests)
   - [How to Open Socket.IO in Postman](#41-how-to-open-socketio-in-postman)
   - [Connect to Server](#42-connect-to-server)
   - [join_chat](#43-join_chat)
   - [send_message](#44-send_message)
   - [typing](#45-typing)
   - [mark_as_read](#46-mark_as_read)
   - [leave_chat](#47-leave_chat)
   - [Listen — new_message](#48-listen--new_message)
   - [Listen — user_typing](#49-listen--user_typing)
   - [Listen — messages_read](#410-listen--messages_read)
   - [Listen — error](#411-listen--error)
5. [Full Test Flow — Step by Step](#5-full-test-flow--step-by-step)
6. [Common Errors & Fixes](#6-common-errors--fixes)

---

## 1. Setup — Environment Variables

Create a Postman **Environment** named `Zugado UAT` with these variables:

| Variable       | Value                          | Description                        |
|----------------|--------------------------------|------------------------------------|
| `BASE_URL`     | `https://apiuat.zugado.com`    | UAT server base URL                |
| `TOKEN`        | *(paste after login)*          | JWT Bearer token                   |
| `CHAT_ID`      | *(paste after initiate chat)*  | Conversation `_id`                 |
| `JOB_ID`       | *(paste your job _id)*         | Job `_id`                          |
| `PARTICIPANT_ID` | *(paste other user _id)*     | The other user's `_id`             |

**How to set:**
1. Click **Environments** (top right in Postman)
2. Click **+** → name it `Zugado UAT`
3. Add each variable above
4. Click **Save**
5. Select `Zugado UAT` from the environment dropdown (top right)

---

## 2. Get Your Token

### Login — Verify OTP

```
POST {{BASE_URL}}/api/auth/verifyOTP
```

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "phone": "+91XXXXXXXXXX",
  "otp": "123456"
}
```

**After success:**
- Copy `data.token` from the response
- Set it as the `TOKEN` environment variable

> From now on, every request uses:
> ```
> Authorization: Bearer {{TOKEN}}
> ```

---

## 3. REST API Tests

### 3.1 Initiate Chat

Creates a new chat or returns existing one between two users for a job.

```
POST {{BASE_URL}}/api/chat/initiate
```

**Headers:**
```
Authorization: Bearer {{TOKEN}}
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "jobId": "{{JOB_ID}}",
  "participantId": "{{PARTICIPANT_ID}}"
}
```

**Expected Response (201 new / 200 existing):**
```json
{
  "success": true,
  "message": "Chat initiated successfully",
  "data": {
    "_id": "69c6f085...",
    "jobId": { "_id": "...", "title": "Driver wanted" },
    "participants": [...],
    "lastMessage": "",
    "unreadCount": 0
  }
}
```

**After success:**
- Copy `data._id` → set as `CHAT_ID` environment variable

---

### 3.2 Get All Conversations

Returns all chats for the logged-in user.

```
GET {{BASE_URL}}/api/chat/conversations?page=1&limit=20
```

**Headers:**
```
Authorization: Bearer {{TOKEN}}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "conversations": [
      {
        "_id": "69c6f085...",
        "jobId": { "_id": "...", "title": "Driver wanted" },
        "otherParticipant": {
          "_id": "...",
          "firstName": "Alok",
          "lastName": "Singh",
          "avatar": ""
        },
        "lastMessage": "Hello",
        "lastMessageTime": "2026-03-27T21:03:01Z",
        "unreadCount": 2
      }
    ],
    "totalPages": 1,
    "currentPage": 1,
    "total": 1
  }
}
```

---

### 3.3 Get Chat Messages

Fetch all messages for a specific conversation.

```
GET {{BASE_URL}}/api/chat/{{CHAT_ID}}/messages?page=1&limit=50
```

**Headers:**
```
Authorization: Bearer {{TOKEN}}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "chatId": "69c6f085...",
    "messages": [
      {
        "_id": "69msg001...",
        "senderId": "6966be6c...",
        "message": "Hello, I am interested",
        "messageType": "text",
        "isRead": true,
        "timestamp": "2026-03-27T21:03:01Z"
      }
    ],
    "totalMessages": 5,
    "hasMore": false,
    "currentPage": 1
  }
}
```

> **Pagination:** Use `page=2`, `page=3` for older messages. `hasMore: true` means more pages exist.

---

### 3.4 Send Message (REST Fallback)

Use this when Socket.IO is not available. Normally messages go via socket.

```
POST {{BASE_URL}}/api/chat/{{CHAT_ID}}/message
```

**Headers:**
```
Authorization: Bearer {{TOKEN}}
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "message": "Hello from Postman!",
  "messageType": "text"
}
```

**messageType options:** `text` | `image` | `file`

**Expected Response (201):**
```json
{
  "success": true,
  "data": {
    "message": {
      "_id": "69msg003...",
      "senderId": "6966be6c...",
      "message": "Hello from Postman!",
      "messageType": "text",
      "isRead": false,
      "timestamp": "2026-03-27T21:10:00Z"
    }
  }
}
```

---

### 3.5 Mark Messages as Read

Call this when user opens a chat to reset unread count.

```
PATCH {{BASE_URL}}/api/chat/{{CHAT_ID}}/read
```

**Headers:**
```
Authorization: Bearer {{TOKEN}}
```

**Body:** *(empty or `{}`)*

**Expected Response:**
```json
{
  "success": true,
  "data": { "updatedCount": 3 }
}
```

---

### 3.6 Upload File

Upload an image or file to attach in chat. Use `multipart/form-data`.

```
POST {{BASE_URL}}/api/chat/{{CHAT_ID}}/upload
```

**Headers:**
```
Authorization: Bearer {{TOKEN}}
```

**Body (form-data):**
| Key    | Type | Value              |
|--------|------|--------------------|
| `file` | File | *(select a file)*  |

**Allowed types:** JPEG, PNG, GIF, PDF, DOC, DOCX
**Max size:** 5MB

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "fileUrl": "https://s3.amazonaws.com/zugado/chat-files/...",
    "fileName": "photo.jpg",
    "fileSize": 245678,
    "mimeType": "image/jpeg"
  }
}
```

> After upload, send the `fileUrl` via socket `send_message` with `messageType: "image"`.

---

### 3.7 Delete Chat

Soft deletes the chat (data stays, chat becomes inactive).

```
DELETE {{BASE_URL}}/api/chat/{{CHAT_ID}}
```

**Headers:**
```
Authorization: Bearer {{TOKEN}}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Chat deleted successfully",
  "data": null
}
```

---

## 4. WebSocket (Socket.IO) Tests

### 4.1 How to Open Socket.IO in Postman

Postman supports Socket.IO natively since v10.

**Steps:**
1. Open Postman
2. Click **New** (top left)
3. Select **Socket.IO**
4. In the URL field enter: `https://apiuat.zugado.com`
5. Click the **Headers** tab → add:
   ```
   Authorization: Bearer {{TOKEN}}
   ```
6. Click the **Connection** tab → under **Auth** add:
   ```json
   { "token": "YOUR_JWT_TOKEN_HERE" }
   ```
   > Paste your actual token here — Postman Socket.IO doesn't expand `{{TOKEN}}` in auth object automatically.

7. Click **Connect**

**You should see:**
```
Connected
Socket ID: W8_xSy264MWGxp8bAAAx
```

---

### 4.2 Connect to Server

**URL:**
```
https://apiuat.zugado.com
```

**Auth (in Connection tab → Auth):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Transport:** Select `WebSocket` only (uncheck polling)

**Expected events after connect:**
```
connect        → fires automatically
```

---

### 4.3 join_chat

Join a specific chat room. Must emit this first before sending messages.

**Event name to emit:**
```
join_chat
```

**Message body (JSON):**
```json
{
  "chatId": "69c6f0852167160ce6fe7368"
}
```

**Listen for response event:**
```
chat_joined
```

**Expected response:**
```json
{
  "chatId": "69c6f0852167160ce6fe7368",
  "message": "Successfully joined chat"
}
```

---

### 4.4 send_message

Send a text message to the chat room.

**Event name to emit:**
```
send_message
```

**Body — Text message:**
```json
{
  "chatId": "69c6f0852167160ce6fe7368",
  "message": "Hello from Postman Socket!",
  "messageType": "text"
}
```

**Body — Image message (after file upload):**
```json
{
  "chatId": "69c6f0852167160ce6fe7368",
  "message": "Sending an image",
  "messageType": "image",
  "fileUrl": "https://s3.amazonaws.com/zugado/chat-files/...",
  "fileName": "photo.jpg",
  "fileSize": 245678
}
```

**Listen for response event:**
```
new_message
```

**Expected response (both participants receive this):**
```json
{
  "chatId": "69c6f0852167160ce6fe7368",
  "message": {
    "_id": "69msg004...",
    "senderId": "6966be6c...",
    "message": "Hello from Postman Socket!",
    "messageType": "text",
    "isRead": false,
    "timestamp": "2026-03-27T21:15:00Z"
  }
}
```

---

### 4.5 typing

Emit when user starts or stops typing.

**Event name to emit:**
```
typing
```

**Body — User started typing:**
```json
{
  "chatId": "69c6f0852167160ce6fe7368",
  "isTyping": true
}
```

**Body — User stopped typing:**
```json
{
  "chatId": "69c6f0852167160ce6fe7368",
  "isTyping": false
}
```

**Listen for response event (other participant receives):**
```
user_typing
```

**Expected response:**
```json
{
  "chatId": "69c6f0852167160ce6fe7368",
  "userId": "6966be6c...",
  "isTyping": true
}
```

---

### 4.6 mark_as_read

Mark all messages in the chat as read.

**Event name to emit:**
```
mark_as_read
```

**Body:**
```json
{
  "chatId": "69c6f0852167160ce6fe7368"
}
```

**Listen for response event (other participant receives):**
```
messages_read
```

**Expected response:**
```json
{
  "chatId": "69c6f0852167160ce6fe7368",
  "userId": "6966be6c..."
}
```

---

### 4.7 leave_chat

Leave the chat room. Emit when closing the chat screen.

**Event name to emit:**
```
leave_chat
```

**Body:**
```json
{
  "chatId": "69c6f0852167160ce6fe7368"
}
```

> No response event expected. Server removes you from the room silently.

---

### 4.8 Listen — new_message

Add this as a listener in Postman to receive incoming messages.

**Event name to listen:**
```
new_message
```

**What you receive:**
```json
{
  "chatId": "69c6f0852167160ce6fe7368",
  "message": {
    "_id": "69msg005...",
    "senderId": "6973e77c...",
    "message": "Hey, I can do this job",
    "messageType": "text",
    "isRead": false,
    "timestamp": "2026-03-27T21:20:00Z"
  }
}
```

---

### 4.9 Listen — user_typing

**Event name to listen:**
```
user_typing
```

**What you receive:**
```json
{
  "chatId": "69c6f0852167160ce6fe7368",
  "userId": "6973e77c...",
  "isTyping": true
}
```

---

### 4.10 Listen — messages_read

**Event name to listen:**
```
messages_read
```

**What you receive:**
```json
{
  "chatId": "69c6f0852167160ce6fe7368",
  "userId": "6973e77c..."
}
```

---

### 4.11 Listen — error

**Event name to listen:**
```
error
```

**What you receive:**
```json
{
  "message": "Not authorized to join this chat"
}
```

**All possible error messages:**

| Message | Cause | Fix |
|---------|-------|-----|
| `Authentication required` | No token or invalid token | Pass valid JWT in auth |
| `Chat not found` | Wrong chatId | Use correct chatId from conversations |
| `Not authorized to join this chat` | User not a participant | Use correct user token |
| `Message cannot be empty` | Empty message string | Send non-empty message |
| `Not authorized` | Token expired or wrong user | Re-login and get new token |
| `Failed to join chat` | Server error | Check chatId is valid |
| `Failed to send message` | Server error | Retry after a moment |

---

## 5. Full Test Flow — Step by Step

Follow this exact order to test everything end to end:

```
STEP 1 — Get Token
─────────────────
POST /api/auth/verifyOTP
→ Copy token → set TOKEN variable

STEP 2 — Initiate Chat
──────────────────────
POST /api/chat/initiate
Body: { jobId, participantId }
→ Copy data._id → set CHAT_ID variable

STEP 3 — Get Conversations (verify chat exists)
───────────────────────────────────────────────
GET /api/chat/conversations?page=1&limit=20
→ Should see your new chat in the list

STEP 4 — Open Socket.IO in Postman
───────────────────────────────────
URL: https://apiuat.zugado.com
Auth: { "token": "YOUR_TOKEN" }
→ Click Connect
→ Should see: Connected + Socket ID

STEP 5 — Add Listeners (before emitting anything)
──────────────────────────────────────────────────
Add listeners for:
  • new_message
  • chat_joined
  • user_typing
  • messages_read
  • error

STEP 6 — Join Chat Room
────────────────────────
Emit: join_chat
Body: { "chatId": "YOUR_CHAT_ID" }
→ Listen: chat_joined fires with confirmation

STEP 7 — Send a Message via Socket
────────────────────────────────────
Emit: send_message
Body: { "chatId": "...", "message": "Hello!", "messageType": "text" }
→ Listen: new_message fires with message object including _id

STEP 8 — Get Messages via REST (verify message saved)
──────────────────────────────────────────────────────
GET /api/chat/{{CHAT_ID}}/messages?page=1&limit=50
→ Should see the message you just sent

STEP 9 — Test Typing Indicator
────────────────────────────────
Emit: typing
Body: { "chatId": "...", "isTyping": true }
→ Other user's socket receives: user_typing

STEP 10 — Mark as Read
────────────────────────
Emit: mark_as_read
Body: { "chatId": "..." }
→ Other user's socket receives: messages_read

STEP 11 — Leave Chat
─────────────────────
Emit: leave_chat
Body: { "chatId": "..." }
→ No response (silent)

STEP 12 — Clean Up (optional)
──────────────────────────────
DELETE /api/chat/{{CHAT_ID}}
→ Soft deletes the chat
```

---

## 6. Common Errors & Fixes

| Problem | Symptom | Fix |
|---------|---------|-----|
| Socket not connecting | No `connect` event fires | Check token is valid and not expired |
| `chat_joined` not firing | Emit `join_chat` but no response | Check chatId is correct and user is a participant |
| `new_message` not firing | Message sent but not received | Make sure you joined the room first with `join_chat` |
| 401 Unauthorized on REST | `{ "success": false }` | Token expired — re-login and update TOKEN variable |
| 403 BID_REQUIRED | Cannot initiate chat | Bidder must place a bid first |
| Message sent but `_id` is undefined | `new_message` data has no `_id` | Check exact raw response — `_id` may be nested differently |
| Postman Socket.IO shows "Disconnected" immediately | Auth rejected | Paste raw token in auth object, not `{{TOKEN}}` variable |
| `typing` event not received by other user | Other user not in room | Both users must emit `join_chat` first |

---

## Quick Reference Card

```
BASE URL: https://apiuat.zugado.com

─── REST ──────────────────────────────────────────────────────
POST   /api/chat/initiate                  → Start or get chat
GET    /api/chat/conversations?page=1      → All conversations
GET    /api/chat/:chatId/messages?page=1   → Chat messages
POST   /api/chat/:chatId/message           → Send (REST fallback)
PATCH  /api/chat/:chatId/read              → Mark as read
POST   /api/chat/:chatId/upload            → Upload file
DELETE /api/chat/:chatId                   → Delete chat

─── SOCKET.IO EMIT ────────────────────────────────────────────
join_chat      { chatId }
send_message   { chatId, message, messageType }
typing         { chatId, isTyping: true/false }
mark_as_read   { chatId }
leave_chat     { chatId }

─── SOCKET.IO LISTEN ──────────────────────────────────────────
chat_joined    → { chatId, message }
new_message    → { chatId, message: { _id, senderId, message, ... } }
user_typing    → { chatId, userId, isTyping }
messages_read  → { chatId, userId }
error          → { message }
```

---

*Zugado Chat Postman Guide v1 | UAT Environment*
