import axios from "axios";

export const handleAxiosError = (error, thunkAPI) => {
    if (axios.isAxiosError(error)) {
        console.log('error occured in axios', error);

        if (error?.response) {
            // Server responded with a status code outside 2xx
            console.log('error response = ', error?.response?.data);
            return thunkAPI.rejectWithValue(error.response.data);

        } else if (error.request) {
            // No response received from the server
            console.log("Network Error: No response received", error.request);
            const networkError = {
                message: "Oops! Something went wrong with the network. Please try again later.",
                statusCode: 500,
                data: null,
                errorCode: "NETWORK_ERROR",
                timestamp: Date.now(),
            };
            return thunkAPI.rejectWithValue(networkError);
        } else {
            // Something happened while setting up the request
            console.log("Request Error:", error.message);
            return thunkAPI.rejectWithValue({ message: error.message });
        }
    } else {
        // Non-Axios error (e.g. bug in your code)
        console.log("Unexpected Error:", error);
        return thunkAPI.rejectWithValue({ message: "Unexpected error occurred." });
    }
};