import { addToWishlist, removeFromWishlist, getWishlist } from '../store/thunks/wishlistThunk';

export const handleWishlistToggle = async (dispatch, jobId, isWishlisted, showSnackbar) => {
  try {
    if (isWishlisted) {
      await dispatch(removeFromWishlist(jobId)).unwrap();
      showSnackbar('Job removed from wishlist', 'success');
    } else {
      await dispatch(addToWishlist(jobId)).unwrap();
      showSnackbar('Job added to wishlist', 'success');
    }
    // Refresh wishlist to sync state
    dispatch(getWishlist());
  } catch (error) {
    showSnackbar('Failed to update wishlist', 'error');
  }
};