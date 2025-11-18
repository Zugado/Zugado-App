// src/navigation/RootNavigator.js
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AuthNavigator from './AuthNavigator';
import AppStackNavigator from './AppStackNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadUserFromStorage } from '../redux/slices/authSlice';


export default function RootNavigator() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  return user ? <AppStackNavigator /> : <AuthNavigator />;
}