
import { apiPostRequest } from "../https/post";


//Send OTP API
export const sendOtpAPI = (data) =>
  apiPostRequest({
    apiUrl: `/auth/send-otp`,
    content_type: "application/json",
    data: data,
});

//Verify OTP API
export const verifyOtpAPI = (data) =>
  apiPostRequest({
    apiUrl: `/auth/verify-otp`,
    content_type: "application/json",
    data: data,
});

//Register API
export const registerAPI = (data) =>
  apiPostRequest({
    apiUrl: `/auth/register`,
    content_type: "application/json",
    data: data,
});

