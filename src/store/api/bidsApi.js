import { apiPostRequest } from "../https/post";
import { apiGetRequest } from "../https/get";
import { apiPutRequest } from "../https/put";

//Create Bid on job by id api
export const postBidByJobIdAPI = (data) =>
  apiPostRequest({
    apiUrl: `/bids/bid/${data}`,
    content_type: "application/json",
    data: data,
});

//Update Bid on job by id api
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
