import { apiPostRequest } from "../https/post";



// API call for updating user profile images
export const updateProfilePicAPI = async (data) => {

  const formData = new FormData();
  formData.append('profilePicture', {
    uri: data.uri,
    type: data.type || 'image/jpeg',
    name: data.name || 'profile.jpg',
  });
  
  return apiPostRequest({
    apiUrl: `/user/profile-picture/upload'`,
    content_type: "multipart/form-data",
    data: formData,
    accessToken,
  });
};
