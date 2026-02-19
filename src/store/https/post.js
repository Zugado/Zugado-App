import axiosInstance from "../api/axiosInstance";

export const apiPostRequest = async ({ apiUrl, content_type, data }) => {
    const headers = {
      'Content-Type': content_type,
      'Accept': '*/*',
    };

    console.log(`POST Request: ${apiUrl}`);

    console.log('Body:', JSON.stringify(data, null, 2));

    const response = await axiosInstance.post(apiUrl, data, { headers });
    console.log('raw api response = ', response?.data);
    return response; // axios parses JSON by default
  
};
