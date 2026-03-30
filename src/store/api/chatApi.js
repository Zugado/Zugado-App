import { apiPostRequest } from "../https/post";
import { apiGetRequest } from "../https/get";
import { apiPatchRequest } from "../https/patch";
import { apiDeleteRequest } from "../https/delete";

export const getAllChatsAPI = (data) =>
  apiGetRequest({
    apiUrl: `/chat/conversations?page=${data.page}&limit=${data.limit}`,
    content_type: "application/json",
    data: null,
  });

export const startNewChatAPI = (data) =>
  apiPostRequest({
    apiUrl: `/chat/initiate`,
    content_type: "application/json",
    data,
  });

// Correct endpoint: GET /chat/:chatId/messages?page=1&limit=50
// chatId is the conversation _id from getAllChats response
export const getChatMessagesAPI = ({ chatId, page = 1, limit = 50 }) =>
  apiGetRequest({
    apiUrl: `/chat/${chatId}/messages?page=${page}&limit=${limit}`,
    content_type: "application/json",
    data: null,
  });

export const markChatReadAPI = (chatId) =>
  apiPatchRequest({
    apiUrl: `/chat/${chatId}/read`,
    content_type: "application/json",
    data: {},
  });

export const sendMessageRestAPI = ({ chatId, message, messageType = 'text' }) =>
  apiPostRequest({
    apiUrl: `/chat/${chatId}/message`,
    content_type: "application/json",
    data: { message, messageType },
  });

export const deleteChatAPI = (chatId) =>
  apiDeleteRequest({
    apiUrl: `/chat/${chatId}`,
    content_type: "application/json",
  });
