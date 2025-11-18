// src/navigation/AppStackNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './TabNavigator';
// import JobDetails from '../screens/Jobs/JobDetails';
// import EditProfile from '../screens/Profile/EditProfile';

const Stack = createStackNavigator();

export default function AppStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Main bottom tabs */}
      <Stack.Screen name="MainTabs" component={TabNavigator} />

      {/* Screens outside tabs */}
      {/* <Stack.Screen name="JobDetails" component={JobDetails} /> */}
      {/* <Stack.Screen name="EditProfile" component={EditProfile} /> */}
    </Stack.Navigator>
  );
}
