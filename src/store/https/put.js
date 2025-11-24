import axiosInstance from "../api/axiosInstance";

export const apiPutRequest = async ({ apiUrl, content_type, data }) => {
  const headers = {
    "Accept": "*/*",
    "Content-Type": content_type || "application/json",
  };


  console.log("PUT Request:", apiUrl);

  console.log("Body:", data);

  const response = await axiosInstance.put(apiUrl, data);
  console.log("Response:", response.data);
  return response;
};
