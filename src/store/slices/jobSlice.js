import { createSlice } from '@reduxjs/toolkit';
import {
  getAllAppliedJobs,
  getAllCreatedJobs,
  getAllJobs,
  getAllTags,
} from '../thunks/jobThunk';
import { create } from 'react-test-renderer';
import { getAllMyBids } from '../thunks/bidThunk';

const initialState = {
  jobs: [],
  createdJobs: [],
  appliedJobs: [],
  myAllBids: [],
  loading: false,
  error: null,
};

const jobSlice = createSlice({
  name: 'job',
  initialState: {
    ...initialState,
    tags: [],
    tagsLoading: false,
  },
  reducers: {
    clearJobs: state => {
      state.jobs = [];
      state.createdJobs = [];
      state.appliedJobs = [];
      state.myAllBids = [];
      state.error = null;
      state.tags = [];
    },
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getAllJobs.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload?.data || [];
        console.log('Jobs fetched successfully in slice:', state.jobs.jobs);
      })
      .addCase(getAllJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch jobs';
      })
      .addCase(getAllCreatedJobs.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCreatedJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.createdJobs = action.payload?.data?.jobs || [];
        console.log(
          'Created Jobs fetched successfully in slice:',
          action.payload?.data?.jobs,
        );
      })
      .addCase(getAllCreatedJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch created jobs';
      })
      .addCase(getAllAppliedJobs.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllAppliedJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.appliedJobs = action.payload?.data || [];
        console.log(
          'Applied Jobs fetched successfully in slice:',
          action.payload?.data,
        );
      })
      .addCase(getAllAppliedJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch applied jobs';
      })
      .addCase(getAllMyBids.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllMyBids.fulfilled, (state, action) => {
        state.loading = false;
        state.myAllBids = action.payload?.data || [];
        console.log(
          'My All Bids fetched successfully in slice:',
          action.payload,
        );
      })
      .addCase(getAllMyBids.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch my bids';
        console.error('Error fetching my bids in slice:', action.payload); 
      })
      .addCase(getAllTags.pending, state => {
        state.tagsLoading = true;
      })
      .addCase(getAllTags.fulfilled, (state, action) => {
        state.tagsLoading = false;
        state.tags = action.payload?.data || [];
      })
      .addCase(getAllTags.rejected, (state, action) => {
        state.tagsLoading = false;
      });
  },
});

export const { clearJobs, clearError } = jobSlice.actions;
export default jobSlice.reducer;
