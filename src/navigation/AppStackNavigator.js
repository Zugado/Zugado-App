// src/navigation/AppStackNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './TabNavigator';
// import NotificationScreen from '../screens/NotificationScreen';
import CreateJobScreen2 from '../screens/Jobs/CreateJobScreen2';
import CreateJobScreen3 from '../screens/Jobs/CreateJobScreen3';
import JobDetailedScreen from '../screens/Jobs/JobDetailedScreen';
import LanguageSelectScreen from '../screens/LanguageSelectScreen';

const Stack = createStackNavigator();

export default function AppStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Main bottom tabs */}
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="CreateJobScreen2" component={CreateJobScreen2} />
      <Stack.Screen name="CreateJobScreen3" component={CreateJobScreen3} />
      <Stack.Screen name="JobDetailedScreen" component={JobDetailedScreen} />
      <Stack.Screen name="LanguageSelectScreen" component={LanguageSelectScreen} />
    </Stack.Navigator>
  );
}
