import { apiGetRequest } from "../https/get";
import { apiPutRequest } from "../https/put";

// Get user location API
export const getUserLocationAPI = () =>
  apiGetRequest({
    apiUrl: `/user/location`,
    content_type: "application/json",
  });

// Update user location API
export const updateUserLocationAPI = (data) =>
  apiPutRequest({
    apiUrl: `/user/location`,
    content_type: "application/json",
    data: data,
  });