import { createSlice } from '@reduxjs/toolkit';
import { getAllJobs, getAllTags } from '../thunks/jobThunk';

const initialState = {
  jobs: [],
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
    clearJobs: (state) => {
      state.jobs = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload?.data || [];
      })
      .addCase(getAllJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch jobs';
      })
      .addCase(getAllTags.pending, (state) => {
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