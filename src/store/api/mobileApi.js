import { apiPostRequest } from "../https/post";

// Send OTP for mobile change
export const sendMobileOtpAPI = (data) =>
  apiPostRequest({
    apiUrl: `/user/mobile/send-otp`,
    content_type: "application/json",
    data: data,
  });

// Verify OTP for mobile change
export const verifyMobileOtpAPI = (data) =>
  apiPostRequest({
    apiUrl: `/user/mobile/verify-otp`,
    content_type: "application/json",
    data: data,
  });