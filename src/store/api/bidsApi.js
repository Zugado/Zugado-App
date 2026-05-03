import { apiPostRequest } from "../https/post";
import { apiGetRequest } from "../https/get";
import { apiPutRequest } from "../https/put";
import { apiPatchRequest } from "../https/patch";

// Create Bid on job by id api
export const postBidByJobIdAPI = (data) =>
  apiPostRequest({
    apiUrl: `/bids/bid/${data}`,
    content_type: "application/json",
    data: data,
  });

// Update Bid on job by id api
export const updateBidByJobIdAPI = (data) =>
  apiPutRequest({
    apiUrl: `/bids/bid/${data?.bidId}`,
    content_type: "application/json",
    data: data.payload,
  });

// Approve bid — PATCH /bids/bid/:bidId/status
export const approveBidAPI = ({ bidId }) =>
  apiPatchRequest({
    apiUrl: `/bids/bid/${bidId}/status`,
    content_type: "application/json",
    data: { status: 'approved' },
  });

// Reject bid — PATCH /bids/bid/:bidId/status
export const rejectBidAPI = ({ bidId, rejectionReason }) =>
  apiPatchRequest({
    apiUrl: `/bids/bid/${bidId}/status`,
    content_type: "application/json",
    data: { status: 'rejected', rejectionReason },
  });

// Get all bids of job by id api
export const getAllBidsByJobIdAPI = (data) =>
  apiGetRequest({
    apiUrl: `/bids/job/${data}`,
    content_type: "application/json",
    data: data,
  });

// Get all bids on jobs api
export const getAllMyBidsAPI = () =>
  apiGetRequest({
    apiUrl: `/bids/my-bids`,
    content_type: "application/json",
  });
