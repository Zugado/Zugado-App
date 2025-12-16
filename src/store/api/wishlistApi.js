import { apiGetRequest } from "../https/get";
import { apiPostRequest } from "../https/post";
import { apiDeleteRequest } from "../https/delete";

// Get user wishlist
export const getWishlistAPI = () =>
  apiGetRequest({
    apiUrl: `/user/wishlist`,
    content_type: "application/json",
  });

// Add job to wishlist
export const addToWishlistAPI = (jobId) =>
  apiPostRequest({
    apiUrl: `/user/wishlist/${jobId}`,
    content_type: "application/json",
    data: {},
  });

// Remove job from wishlist
export const removeFromWishlistAPI = (jobId) =>
  apiDeleteRequest({
    apiUrl: `/user/wishlist/${jobId}`,
    content_type: "application/json",
  });