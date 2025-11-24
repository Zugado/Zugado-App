import axiosInstance from "../api/axiosInstance";
export const apiGetRequest = async (request) => {
    
        console.log("Calling GET API:", request);
        // console.log("Headers:", { Authorization: `Bearer ${request.accessToken}` });

        const response = await axiosInstance.get(request.apiUrl, {
            headers: {
                "accept": "*/*",
                "content-type": request.content_type
            },
        });

        // Log the raw response for debugging
        console.log("Raw API Response:", response.data);

        return response; // Axios automatically parses JSON
   
};

