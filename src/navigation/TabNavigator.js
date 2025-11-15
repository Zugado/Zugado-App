import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CreateJob from '../screens/CreateJob';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const ManageJobScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Manage Job Screen</Text>
  </View>
);

const MessageScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Message Screen</Text>
  </View>
);

const CustomTabBarButton = ({ children, onPress }) => (
  <TouchableOpacity
    style={{
      top: -30,
      justifyContent: 'center',
      alignItems: 'center',
      ...styles.shadow,
    }}
    onPress={onPress}
    activeOpacity={0.8} // Optional: for better feedback
  >
    <View
      style={{
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#111',
        justifyContent: 'center',
        alignItems: 'center', // <-- make sure icon is centered
      }}
    >
      {children}
    </View>
  </TouchableOpacity>
);

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        // tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#ffffff',
          borderTopWidth: 0,
          height: 70,
          ...styles.shadow,
        },
        tabBarIcon: ({ focused }) => {
          const color = focused ? '#111' : '#888';
          const size = 28;

          switch (route.name) {
            case 'Home':
              return <MaterialCommunityIcons name="home-variant-outline" size={size} color={color} />;
            case 'Manage Job':
              return <MaterialCommunityIcons name="briefcase-outline" size={size} color={color} />;
            case 'Message':
              return <MaterialCommunityIcons name="chat-outline" size={size} color={color} />;
            case 'Profile':
              return <MaterialCommunityIcons name="account-outline" size={size} color={color} />;
            default:
              return <MaterialCommunityIcons name="circle-outline" size={size} color={color} />;
          }
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Manage Job" component={ManageJobScreen} />
      <Tab.Screen
  name="Add"
  component={CreateJob}
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
