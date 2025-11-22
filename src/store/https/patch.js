import axiosInstance from "../api/axiosInstance";

export const apiPatchRequest = async ({ apiUrl, content_type, data }) => {
  const headers = {
    "Accept": "*/*",
    "Content-Type": content_type || "application/json",
  };


  console.log("PATCH Request:", apiUrl);

  console.log("Body:", data);

  const response = await axiosInstance.patch(apiUrl, data, { headers });
  console.log("Response:", response.data);
  return response;
};