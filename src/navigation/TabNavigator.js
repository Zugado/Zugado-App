import React, { useCallback, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Image, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';

import HomeScreen from '../screens/Home/HomeScreen';
import ManageJobScreen from '../screens/ManageJobScreen';
import CreateJobScreen from '../screens/Jobs/CreateJobScreen';
import CreateJobScreen2 from '../screens/Jobs/CreateJobScreen2';
import AllChatScreen from '../screens/AllChatScreen';
import ProfileScreen from '../screens/ProfileScreen';
import TabLoadingOverlay from '../components/TabLoadingOverlay';
import LocationPickerScreen from '../screens/mapAndAddress/LocationPickerScreen';
import { useGlobalChat } from '../hooks/useChat';

const Tab = createBottomTabNavigator();

// Custom FAB Button
const CustomTabBarButton = ({ children, onPress }) => (


  <TouchableOpacity
    style={{
      top: -30,
      justifyContent: 'center',
      alignItems: 'center',
    }}
    onPress={onPress}
  >
    <View
      style={{
        width: 60,
        height: 60,
        borderRadius: 35,
        backgroundColor: '#111',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#fff',
        borderWidth: 1,
        shadowOffset: { width: 0, height: 10 },
        // shadowOpacity: 0.25,
        // shadowRadius: 3.5,
        // LIGHTER 360° SHADOW
        shadowColor: '#000000ff', // Lighter, pinkish shadow color
        // shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.35, // Lighter shadow
        shadowRadius: 8,

        elevation: 20, // Android lighter shadow
      }}
    >
      {children}
    </View>
  </TouchableOpacity>
);


// Import your PNGs
const icons = {
  home: {
    active: require('../assets/Icons/HomeFill.png'),
    inactive: require('../assets/Icons/Home.png'),
  },
  manageJob: {
    active: require('../assets/Icons/ManageJobBlack.png'),
    inactive: require('../assets/Icons/ManageJob.png'),
  },
  message: {
    active: require('../assets/Icons/MessageBlack.png'),
    inactive: require('../assets/Icons/Message.png'),
  },
  profile: {
    active: require('../assets/Icons/ProfileBlack.png'),
    inactive: require('../assets/Icons/Profile.png'),
  },
};

export default function TabNavigator() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const totalUnreadCount = useSelector(state => state.chat.totalUnreadCount || 0);

  // Persistent global socket — increments badge on incoming messages
  useGlobalChat();

  // const handleTabPress = () => {
  //   setIsLoading(true);
  //   setTimeout(() => setIsLoading(false), 1000);
  // };

  const handleCreateJobPress = async (navigation) => {
    try {
      const draft = await AsyncStorage.getItem('jobDraft');
      if (draft) {
        const draftData = JSON.parse(draft);
        const hasMeaningfulData = Boolean(
          draftData?.personTitle ||
          draftData?.thingTitle ||
          draftData?.personDescription ||
          draftData?.thingDescription ||
          draftData?.selectedSkills?.length > 0
        );
        
        if (hasMeaningfulData) {
          navigation.getParent().navigate('DraftChoiceScreen');
          return;
        }
      }
      navigation.getParent().navigate('CreateJobScreen');
    } catch (error) {
      console.log('Error checking draft:', error);
      navigation.getParent().navigate('CreateJobScreen');
    }
  };

  const renderTabIcon = (routeName, focused) => {
    let icon;
    switch (routeName) {
      case t('Home'):
        icon = focused ? icons.home.active : icons.home.inactive;
        break;
      case t('Manage Tasks'):
        icon = focused ? icons.manageJob.active : icons.manageJob.inactive;
        break;
      case t('Message'):
        icon = focused ? icons.message.active : icons.message.inactive;
        return (
          <View>
            <Image source={icon} style={{ width: 20, height: 28, resizeMode: 'contain' }} />
            {totalUnreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
                </Text>
              </View>
            )}
          </View>
        );
      case t('Profile'):
        icon = focused ? icons.profile.active : icons.profile.inactive;
        break;
      default:
        icon = icons.home.inactive;
    }
    return <Image source={icon} style={{ width: 20, height: 28, resizeMode: 'contain' }} />;
  };

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
          
          screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: { position: 'absolute', height: 60, backgroundColor: '#fff', ...styles.shadow },
          tabBarLabelStyle: { fontSize: 10, fontWeight: '600', marginTop: 4 },
          tabBarIcon: ({ focused }) => renderTabIcon(route.name, focused),
        })}
        // screenListeners={{ tabPress: handleTabPress }}
      >
        <Tab.Screen name={t('Home')} component={HomeScreen} />
        <Tab.Screen name={t('Manage Tasks')} component={ManageJobScreen} />
        <Tab.Screen
          name="Add"
          component={CreateJobScreen}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();
              handleCreateJobPress(navigation);
            },
          })}
          options={{
            tabBarStyle: { display: 'none' },
            tabBarButton: (props) => (
              <CustomTabBarButton {...props}>
                <Image source={require('../assets/Icons/PlusHome.png')} style={{ width: 34, height: 34 }} />
              </CustomTabBarButton>
            ),
          }}
        />
        <Tab.Screen name={t('Message')} component={AllChatScreen} />
        <Tab.Screen name={t('Profile')} component={ProfileScreen} />
      </Tab.Navigator>
    
    </View>
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
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
    lineHeight: 12,
  },
});