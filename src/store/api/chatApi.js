import { apiPostRequest } from "../https/post";
import { apiGetRequest } from "../https/get";
import { apiPutRequest } from "../https/put";

//Get all chats api
export const getAllChatsAPI = (data) =>
  apiGetRequest({
    apiUrl: `/chat/conversations?page=${data.page}&limit=${data.limit}`,
    content_type: "application/json",
    data: null,
});

//Start new chat api
export const startNewChatAPI = (data) =>
  apiPostRequest({
    apiUrl: `/chat/initiate`,
    content_type: "application/json",
    data: data,
});


export const updateBidByJobIdAPI = (data) =>
  apiPutRequest({
    apiUrl: `/bids/bid/${data}`,
    content_type: "application/json",
    data: data,
});


//Get all bids of job by id api
export const getAllBidsByJobIdAPI = (data) =>
  apiGetRequest({
    apiUrl: `/bids/job/${data}`,
    content_type: "application/json",
    data: data,
});

//Get all bids on jobs api
export const getAllMyBidsAPI = () =>
  apiGetRequest({
    apiUrl: `/bids/my-bids`,
    content_type: "application/json",
  });
