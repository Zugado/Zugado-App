// Auth selectors
export const selectUser = (state) => state.auth.user;
export const selectAuthLoader = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectIsNewUser = (state) => state.auth.isNewUser;
export const selectToken = (state) => state.auth.token;
export const selectWishlist = (state) => state.auth.wishlist || [];
export const selectWishlistLoading = (state) => state.auth.wishlistLoading;

// Job selectors
export const selectJobs = (state) => state.job.jobs;
export const selectJobsLoading = (state) => state.job.loading;
export const selectJobsError = (state) => state.job.error;
export const selectTags = (state) => state.job.tags;
export const selectTagsLoading = (state) => state.job.tagsLoading;

// Location selectors
export const selectUserLocation = (state) => state.location;
export const selectLocationCoordinates = (state) => state.location.coordinates;
export const selectLocationAddress = (state) => state.location.address;
export const selectLocationLoading = (state) => state.location.loading;
