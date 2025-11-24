
export const selectUser = (state) => state.auth.user;  // ✅ Get user data
export const selectAuthLoader = (state) => state.auth.loading;  // ✅ Get loader data
export const selectAuthError = (state) => state.auth.error;  // ✅ Get error data
export const selectIsNewUser = (state) => state.auth.isNewUser;  // ✅ Get isNewUser data
