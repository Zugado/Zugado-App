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
    const myBids = state.job?.myAllBids || [];
    return myBids.some(item => {
      const id = item?.job?._id || item?.job?.id || item?.job || item?.jobId?._id || item?.jobId?.id || item?.jobId;
      return String(id) === String(jobId);
    });
  } catch (e) {
    return false;
  }
};
export const selectMyBidStatus = (state, jobId) => {
  if (!jobId) return null;

  const myBids = state.job?.myAllBids || [];

  const bid = myBids.find(item => {
    const id = item?.job?._id || item?.job?.id || item?.job || item?.jobId?._id || item?.jobId?.id || item?.jobId;
    return String(id) === String(jobId);
  });

  return bid?.status || null;
};
export default {
  selectHasBidded,
  selectMyBidStatus,
};
