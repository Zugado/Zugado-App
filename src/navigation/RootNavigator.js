// src/navigation/RootNavigator.js
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AuthNavigator from './AuthNavigator';
import AppStackNavigator from './AppStackNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadUserFromStorage } from '../redux/slices/authSlice';


export default function RootNavigator() {
  const dispatch = useDispatch();
  const { user, loading, isGuest } = useSelector((state) => state.auth);

  React.useEffect(() => {
    dispatch(loadUserFromStorage());
  }, []);

  if (loading) return null; // or splash

  // If user logged in
  if (user) return <AppStackNavigator />;

  // If using guest mode
  if (isGuest) return <AppStackNavigator />;

  // Else show Auth for first time
  return <AuthNavigator />;
}
