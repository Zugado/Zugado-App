// src/navigation/RootNavigator.js
import React, { useEffect, useState } from 'react';
import i18n from '../i18n/i18n';
import { useSelector, useDispatch } from 'react-redux';
import { loadUserFromStorage } from '../redux/slices/authSlice';
import AppStackNavigator from './AppStackNavigator';
import OnboardingNavigator from './OnboardingNavigator';
import SplashScreen from '../screens/SplashScreen';
import LanguageSelectScreen from '../screens/LanguageSelectScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RootNavigator() {
  const dispatch = useDispatch();
  const { user, loading, isGuest } = useSelector((state) => state.auth);
  const [showSplash, setShowSplash] = useState(true);
  const [appLanguage, setAppLanguage] = useState(null);

  useEffect(() => {
    // Load user/guest from AsyncStorage
    dispatch(loadUserFromStorage());

     const loadLanguage = async () => {
      const lang = await AsyncStorage.getItem("appLanguage");
      if (lang) {
        i18n.changeLanguage(lang);
        setAppLanguage(lang);
      }
    };

    loadLanguage();

    // Always show splash for 2 seconds
    const timer = setTimeout(() => setShowSplash(false), 1000);

    return () => clearTimeout(timer);
  }, [dispatch]);

  // Show splash until auth is loaded and 3 seconds passed
  if (loading || showSplash) return <SplashScreen />;

  // Check if language is set
  if (!appLanguage)
  return <LanguageSelectScreen onComplete={(lang) => setAppLanguage(lang)} />;


  // Navigate based on auth state
  if (user || isGuest) return <AppStackNavigator />;
  return <OnboardingNavigator />;
}
