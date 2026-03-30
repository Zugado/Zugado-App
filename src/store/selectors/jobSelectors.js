// jobSelectors.js
// Reusable selectors for job-related checks used by multiple screens

/**
 * Return true if the current user has applied/bidded to the given jobId.
 * The store keeps applied jobs in state.job.appliedJobs (array of items
 * where item.job._id === jobId). This selector is intentionally simple so
 * it can be composed in components or memoized later if needed.
 */
export const selectHasBidded = (state, jobId) => {
  if (!jobId) return false;
  const applied = state.job?.appliedJobs || [];
  try {
    return applied.some(item => item?.job?._id === jobId || item?.job === jobId);
  } catch (e) {
    return false;
  }
};

export default {
  selectHasBidded,
};
