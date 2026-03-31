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
  try {
    const applied = state.job?.appliedJobs || [];
    if (applied.some(item => item?.job?._id === jobId || item?.job === jobId)) return true;
    // Fallback: check myAllBids in case appliedJobs hasn't been fetched yet
    const myBids = state.job?.myAllBids || [];
    return myBids.some(item => item?.job?._id === jobId || item?.job === jobId || item?.jobId === jobId || item?.jobId?._id === jobId);
  } catch (e) {
    return false;
  }
};

export default {
  selectHasBidded,
};
