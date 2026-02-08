// src/navigation/AppStackNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './TabNavigator';
// import NotificationScreen from '../screens/NotificationScreen';
import CreateJobScreen from '../screens/Jobs/CreateJobScreen';
import CreateJobScreen2 from '../screens/Jobs/CreateJobScreen2';
import CreateJobScreen3 from '../screens/Jobs/CreateJobScreen3';
import DraftChoiceScreen from '../screens/Jobs/DraftChoiceScreen';
import JobDetailedScreen from '../screens/Jobs/JobDetailedScreen';
import ApproximateLocationMap from '../screens/Jobs/ApproximateLocationMap';
import LanguageSelectScreen from '../screens/LanguageSelectScreen';
import LocationPickerScreen from '../screens/mapAndAddress/LocationPickerScreen';

import EditProfileScreen from '../screens/EditProfileScreen';
import PreferencesScreen from '../screens/PreferencesScreen';
import SavedAddressesScreen from '../screens/SavedAddressesScreen';
import ManageSavedAddressesScreen from '../screens/ManageSavedAddressesScreen';
import LocationPermissionScreen from '../screens/LocationPermissionScreen';
import WishlistScreen from '../screens/WishlistScreen';
import BidPlacementScreen from '../screens/BidPlacementScreen';
import SubscriptionScreen from '../screens/SubscriptionScreen';
import ManageJobDetailScreen from '../screens/ManageJobDetailScreen';
const Stack = createStackNavigator();

export default function AppStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      // initialRouteName="LocationPermission"
    >
      {/* Location Permission Screen */}
      {/* <Stack.Screen name="LocationPermission" component={LocationPermissionScreen} /> */}
      {/* Main bottom tabs */}
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="DraftChoiceScreen" component={DraftChoiceScreen} />
      <Stack.Screen name="CreateJobScreen" component={CreateJobScreen} />
      <Stack.Screen name="CreateJobScreen2" component={CreateJobScreen2} />
      <Stack.Screen name="CreateJobScreen3" component={CreateJobScreen3} />
      <Stack.Screen name="JobDetailedScreen" component={JobDetailedScreen} />
      <Stack.Screen
        name="ApproximateLocationMap"
        component={ApproximateLocationMap}
      />
      <Stack.Screen
        name="LanguageSelectScreen"
        component={LanguageSelectScreen}
      />
      <Stack.Screen
        name="LocationPickerScreen"
        component={LocationPickerScreen}
      />
      <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
      <Stack.Screen name="PreferencesScreen" component={PreferencesScreen} />
      <Stack.Screen
        name="SavedAddressesScreen"
        component={SavedAddressesScreen}
      />
      <Stack.Screen
        name="ManageSavedAddressesScreen"
        component={ManageSavedAddressesScreen}
      />
      <Stack.Screen name="WishlistScreen" component={WishlistScreen} />
      <Stack.Screen name="SubscriptionScreen" component={SubscriptionScreen} />
      <Stack.Screen
        name="ManageJobDetailScreen"
        component={ManageJobDetailScreen}
      />
      <Stack.Screen name="BidPlacementScreen" component={BidPlacementScreen} />
    </Stack.Navigator>
  );
}
