import { apiPostRequest } from "../https/post";
import { apiPutRequest } from "../https/put";
import { apiGetRequest } from "../https/get";

// API call for updating user profile images
export const updateProfilePicAPI = async (data) => {

  const formData = new FormData();
  formData.append('profilePicture', {
    uri: data.uri,
    type: data.type || 'image/jpeg',   
    name: data.name || 'profile.jpg',
  });
  
  console.log('Form Data = ',JSON.stringify(formData,null,2));
  return apiPostRequest({
    apiUrl: `/user/profile-picture/upload`,
    content_type: "multipart/form-data",
    data: formData,
  });
};


// API call for get user profile
export const getUserProfileAPI = async () => {

  return apiGetRequest({
    apiUrl: `/user/profile`,
    content_type: "application/json",
    data: null,
  });
};


// API call for update user profile details
export const updateUserDetailsAPI = async (data) => {

  return apiPutRequest({
    apiUrl: `/user/profile`,
    content_type: "application/json",
    data: data,
  });
};
