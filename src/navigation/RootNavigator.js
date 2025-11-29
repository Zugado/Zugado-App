import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import i18n from '../i18n/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from '../screens/SplashScreen';
import LanguageSelectScreen from '../screens/LanguageSelectScreen';
import OnboardingNavigator from './OnboardingNavigator';
import AppStackNavigator from './AppStackNavigator';
import RegisterScreen from '../screens/Auth/RegisterScreen';

export default function RootNavigator() {
  const { user, isGuest, isNewUser } = useSelector(state => state.auth);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [appLanguage, setAppLanguage] = useState(null);

  useEffect(() => {
    const loadLanguage = async () => {
      const lang = await AsyncStorage.getItem("appLanguage");
      if (lang) {
        i18n.changeLanguage(lang);
        setAppLanguage(lang);
      }
    };
    loadLanguage();

    const timer = setTimeout(() => {
      setShowSplash(false);
      setInitialLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash || initialLoading) return <SplashScreen />;

  if (!appLanguage) {
    return <LanguageSelectScreen onComplete={(lang) => setAppLanguage(lang)} />;
  }

  if (isGuest) return <AppStackNavigator />;

  if (isNewUser) {
    return  <RegisterScreen />;
  }

  if (user) {
    return <AppStackNavigator /> ;
  }

  return <OnboardingNavigator />;
}
