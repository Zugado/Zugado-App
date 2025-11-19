// src/navigation/TabNavigator.js
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import HomeScreen from '../screens/Home/HomeScreen';
import ManageJobScreen from '../screens/Jobs/ManageJobScreen';
import CreateJobScreen from '../screens/Jobs/CreateJobScreen';
import MessageScreen from '../screens/MessageScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

// Custom FAB Button
const CustomTabBarButton = ({ children, onPress }) => (
  <TouchableOpacity
    style={{ top: -25, justifyContent: 'center', alignItems: 'center', ...styles.shadow }}
    onPress={onPress}
  >
    <View style={{ width: 70, height: 70, borderRadius: 35, backgroundColor: '#111', justifyContent: 'center', alignItems: 'center' }}>
      {children}
    </View>
  </TouchableOpacity>
);

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { position: 'absolute', height: 70, backgroundColor: '#fff', ...styles.shadow },
        tabBarIcon: ({ focused, color, size }) => {
          const iconColor = focused ? '#111' : '#888';
          const iconSize = 28;
          switch (route.name) {
            case 'Home': return <MaterialCommunityIcons name="home-variant-outline" size={iconSize} color={iconColor} />;
            case 'Manage Job': return <MaterialCommunityIcons name="briefcase-outline" size={iconSize} color={iconColor} />;
            case 'Message': return <MaterialCommunityIcons name="chat-outline" size={iconSize} color={iconColor} />;
            case 'Profile': return <MaterialCommunityIcons name="account-outline" size={iconSize} color={iconColor} />;
            default: return <MaterialCommunityIcons name="circle-outline" size={iconSize} color={iconColor} />;
          }
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Manage Job" component={ManageJobScreen} />
      <Tab.Screen
        name="Add"
        component={CreateJobScreen}
        options={{
          tabBarStyle: { display: 'none' },
          tabBarButton: (props) => (
            <CustomTabBarButton {...props}>
              <MaterialCommunityIcons name="plus" size={34} color="#fff" />
            </CustomTabBarButton>
          ),
        }}
      />
      <Tab.Screen name="Message" component={MessageScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
});
