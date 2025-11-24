import { configureStore } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ serializableCheck: false }),
});

// Load user from AsyncStorage after splash screen
export const loadUserFromStorage = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const userData = await AsyncStorage.getItem('user');
    const isGuest = await AsyncStorage.getItem('guest');
    
    if (isGuest === 'true') {
      store.dispatch({ type: 'auth/setGuestMode' });
    } else if (token) {
      const user = userData ? JSON.parse(userData) : null;
      store.dispatch({
        type: 'auth/loadUser',
        payload: { token, user }
      });
    }
  } catch (error) {
    console.log('Error loading user from storage:', error);
  }
};

