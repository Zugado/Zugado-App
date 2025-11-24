// src/navigation/OnboardingNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Onboarding1 from '../screens/OnboardingScreens/Onboarding1';
import Onboarding2 from '../screens/OnboardingScreens/Onboarding2';
import Onboarding3 from '../screens/OnboardingScreens/Onboarding3';
import LanguageSelectScreen from '../screens/LanguageSelectScreen';
import AuthNavigator from './AuthNavigator';
import OnboardingScreen from '../screens/OnboardingScreens/OnboardingScreen';

const Stack = createNativeStackNavigator();

export default function OnboardingNavigator() {
  // return (
  //   <Stack.Navigator screenOptions={{ headerShown: false }}>
  //     <Stack.Screen name="Onboarding1" component={Onboarding1} />
  //     <Stack.Screen name="Onboarding2" component={Onboarding2} />
  //     <Stack.Screen name="Onboarding3" component={Onboarding3} />
  //     <Stack.Screen name="Auth" component={AuthNavigator} />
  //     <Stack.Screen name="LanguageSelectScreen" component={LanguageSelectScreen} />
  //   </Stack.Navigator>
  // );
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* 3. Use the single OnboardingScreen for the entire flow */}
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      
      {/* Retain other necessary routes */}
      <Stack.Screen name="Auth" component={AuthNavigator} />
      <Stack.Screen name="LanguageSelectScreen" component={LanguageSelectScreen} />
    </Stack.Navigator>
  );
}
