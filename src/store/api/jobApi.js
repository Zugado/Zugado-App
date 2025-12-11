import { apiPostRequest } from "../https/post";
import { apiGetRequest } from "../https/get";
import { apiPutRequest } from "../https/put";
import { apiPostRequest } from "../https/post";

//Create job api
export const createJobAPI = (data) =>
  apiPostRequest({
    apiUrl: `/jobs/create`,
    content_type: "application/json",
    data: data,
});


//Get all job api
export const getAllJobAPI = (data) =>
  apiGetRequest({
    apiUrl: `/jobs/all`,
    content_type: "application/json",
    data: data,
});

//Get job by id api
export const getJobByIdAPI = (data) =>
  apiGetRequest({
    apiUrl: `/jobs/${data}`,
    content_type: "application/json",
    data: data,
});

//Get applied job by  api
export const getAppliedJobsAPI = (data) =>
  apiGetRequest({
    apiUrl: `/jobs/applied?page=${data.pageNo}&limit=${data.limit}`,
    content_type: "application/json",
    data: data,
});

//Get in Progress job by  api
export const getInProgressJobsAPI = (data) =>
  apiGetRequest({
    apiUrl: `/jobs/in-progress?page=${data.pageNo}&limit=${data.limit}`,
    content_type: "application/json",
    data: data,
});

//Update job by id api
export const updateJobByIdAPI = (data) =>
  apiPutRequest({
    apiUrl: `/jobs/${data}`,
    content_type: "application/json",
    data: data,
});


//Get job  attachment by id api
export const getJobAttachmentsByIdAPI = (data) =>
  apiGetRequest({
    apiUrl: `/jobs/${data}/attachment`,
    content_type: "application/json",
    data: data,
});

//Upload job attachment by id api
export const uploadJobAttachmentsByIdAPI = (data) =>
  apiPostRequest({
    apiUrl: `/jobs/${data.jobId}/upload-documents`,
    content_type: "multipart/form-data",
    data: data.formData,
});


//Update job attachment by id api
export const updateJobAttachmentsByIdAPI = (data) =>
  apiPutRequest({
    apiUrl: `/jobs/${data}`,
    content_type: "application/json",
    data: data,
});


//Get all job tags api
export const getAllTagsAPI = (data) =>
  apiGetRequest({
    apiUrl: `/jobs/tags`,
    content_type: "application/json",
    data: data,
});


//Report job by id api
export const reportJobByIdAPI = (data) =>
  apiPostRequest({
    apiUrl: `/jobs/${data}/report`,
    content_type: "application/json",
    data: data,
});
