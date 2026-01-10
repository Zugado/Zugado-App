import { createAsyncThunk } from '@reduxjs/toolkit';
import { 
  createJobAPI, 
  getAllJobAPI, 
  getJobByIdAPI, 
  getAppliedJobsAPI, 
  getInProgressJobsAPI, 
  updateJobByIdAPI, 
  getJobAttachmentsByIdAPI, 
  uploadJobAttachmentsByIdAPI, 
  updateJobAttachmentsByIdAPI, 
  getAllTagsAPI, 
  reportJobByIdAPI 
} from '../api/jobApi';
import { handleAxiosError } from '../../utils/handleAxiosError';

// Create job thunk
export const createJob = createAsyncThunk(
  "job/createJob",
  async (data, thunkAPI) => {
    try {
      const response = await createJobAPI(data);
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);

// Get all jobs thunk
export const getAllJobs = createAsyncThunk(
  "job/getAllJobs",
  async (data, thunkAPI) => {
    try {
      const response = await getAllJobAPI(data);
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);

// Get job by id thunk
export const getJobById = createAsyncThunk(
  "job/getJobById",
  async (data, thunkAPI) => {
    try {
      const response = await getJobByIdAPI(data);
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);

// Get applied jobs thunk
export const getAppliedJobs = createAsyncThunk(
  "job/getAppliedJobs",
  async (data, thunkAPI) => {
    try {
      const response = await getAppliedJobsAPI(data);
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);

// Get in progress jobs thunk
export const getInProgressJobs = createAsyncThunk(
  "job/getInProgressJobs",
  async (data, thunkAPI) => {
    try {
      const response = await getInProgressJobsAPI(data);
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);

// Update job by id thunk
export const updateJobById = createAsyncThunk(
  "job/updateJobById",
  async (data, thunkAPI) => {
    try {
      const response = await updateJobByIdAPI(data);
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);

// Get job attachments by id thunk
export const getJobAttachmentsById = createAsyncThunk(
  "job/getJobAttachmentsById",
  async (data, thunkAPI) => {
    try {
      const response = await getJobAttachmentsByIdAPI(data);
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);

// Upload job attachments by id thunk
export const uploadJobAttachmentsById = createAsyncThunk(
  "job/uploadJobAttachmentsById",
  async (data, thunkAPI) => {
    try {
      const response = await uploadJobAttachmentsByIdAPI(data);
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);

// Update job attachments by id thunk
export const updateJobAttachmentsById = createAsyncThunk(
  "job/updateJobAttachmentsById",
  async (data, thunkAPI) => {
    try {
      const response = await updateJobAttachmentsByIdAPI(data);
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);

// Get all tags thunk
export const getAllTags = createAsyncThunk(
  "job/getAllTags",
  async (data, thunkAPI) => {
    try {
      const response = await getAllTagsAPI(data);
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);

// Report job by id thunk
export const reportJobById = createAsyncThunk(
  "job/reportJobById",
  async (data, thunkAPI) => {
    try {
      const response = await reportJobByIdAPI(data);
      return response?.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);