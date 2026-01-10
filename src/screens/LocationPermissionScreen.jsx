import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Linking,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import Geolocation from '@react-native-community/geolocation';
import { request, check, PERMISSIONS, RESULTS } from 'react-native-permissions';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { updateUserLocation, getUserLocation } from '../store/thunks/locationThunk';
import MyStatusBar from '../components/MyStatusbar';

const LocationPermissionScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({});

  useEffect(() => {
    checkExistingPermission();
  }, []);

  const checkExistingPermission = async () => {
    try {
      let permission;
      
      if (Platform.OS === 'ios') {
        permission = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
      } else {
        permission = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
      }
      
      const result = await check(permission);
      
      if (result === RESULTS.GRANTED) {
        setLoading(true);
        getCurrentLocationAndUpdate();
      }
    } catch (error) {
      console.log('Permission check error:', error);
    }
  };

  const handleLocationPermission = async () => {
    setLoading(true);
    try {
      let permission;
      
      if (Platform.OS === 'ios') {
        permission = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
      } else {
        permission = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
      }
      
      const result = await request(permission);
      
      if (result === RESULTS.GRANTED) {
        getCurrentLocationAndUpdate();
      } else {
        setLoading(false);
        setAlertConfig({
          title: 'Location Permission Required',
          message: 'Location access is needed to show nearby jobs and provide better experience',
          buttons: [
            { text: 'Skip', onPress: () => navigation.replace('MainTabs') },
            { text: 'Try Again', onPress: handleLocationPermission }
          ]
        });
        setShowAlert(true);
      }
    } catch (error) {
      setLoading(false);
      console.log('Location permission error:', error);
      navigation.replace('MainTabs');
    }
  };

  const getCurrentLocationAndUpdate = () => {
    // First try with high accuracy but shorter timeout
    Geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          await dispatch(updateUserLocation({ latitude, longitude }));
          await dispatch(getUserLocation());
          
          setLoading(false);
          navigation.replace('MainTabs');
        } catch (error) {
          setLoading(false);
          console.log('Location update error:', error);
          navigation.replace('MainTabs');
        }
      },
      (error) => {
        console.log('High accuracy location failed, trying fallback:', error);
        // Fallback: Try with lower accuracy for faster response
        Geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              
              await dispatch(updateUserLocation({ latitude, longitude }));
              await dispatch(getUserLocation());
              
              setLoading(false);
              navigation.replace('MainTabs');
            } catch (error) {
              setLoading(false);
              console.log('Location update error:', error);
              navigation.replace('MainTabs');
            }
          },
          (fallbackError) => {
            setLoading(false);
            console.log('Location fallback error:', fallbackError);
            
            if (fallbackError.code === 1) {
              setAlertConfig({
                title: 'Location Permission Denied',
                message: 'Please enable location permission in settings to continue.',
                buttons: [
                  { text: 'Skip', onPress: () => navigation.replace('MainTabs') },
                  { text: 'Settings', onPress: () => Linking.openSettings() }
                ]
              });
              setShowAlert(true);
            } else if (fallbackError.code === 2) {
              setAlertConfig({
                title: 'Location Services Disabled',
                message: 'Please turn on location services in your device settings.',
                buttons: [
                  { text: 'Skip', onPress: () => navigation.replace('MainTabs') },
                  { text: 'Settings', onPress: () => Linking.openSettings() }
                ]
              });
              setShowAlert(true);
            } else {
              navigation.replace('MainTabs');
            }
          },
          { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 }
        );
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  };

  const skipLocation = () => {
    navigation.replace('MainTabs');
  };

  const CustomAlert = () => (
    <Modal visible={showAlert} transparent animationType="fade">
      <View style={styles.alertOverlay}>
        <View style={styles.alertContainer}>
          <Text style={styles.alertTitle}>{alertConfig.title}</Text>
          <Text style={styles.alertMessage}>{alertConfig.message}</Text>
          <View style={styles.alertButtons}>
            {alertConfig.buttons?.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.alertButton, index === 1 && styles.alertButtonPrimary]}
                onPress={() => {
                  setShowAlert(false);
                  button.onPress();
                }}
              >
                <Text style={[styles.alertButtonText, index === 1 && styles.alertButtonTextPrimary]}>
                  {button.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <MyStatusBar backgroundColor="#000" barStyle="light-content" />
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={styles.iconBackground}>
            <MaterialIcons name="location-on" size={60} color="#fff" />
          </View>
        </View>
        
        <Text style={styles.title}>Enable Location Access</Text>
        <Text style={styles.description}>
          We need your location to show nearby jobs and provide personalized recommendations based on your area.
        </Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#000" />
            <Text style={styles.loadingText}>Getting your location...</Text>
          </View>
        ) : (
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.enableButton} 
              onPress={handleLocationPermission}
            >
              <Text style={styles.enableButtonText}>Allow Location Access</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.skipButton} 
              onPress={skipLocation}
            >
              <Text style={styles.skipButtonText}>Maybe Later</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <CustomAlert />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  iconContainer: {
    marginBottom: 50,
  },
  iconBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 50,
    paddingHorizontal: 10,
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 20,
    fontWeight: '500',
  },
  buttonContainer: {
    width: '100%',
  },
  enableButton: {
    backgroundColor: '#000',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  enableButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  alertOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  alertContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
    textAlign: 'center',
  },
  alertMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  alertButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  alertButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  alertButtonPrimary: {
    backgroundColor: '#000',
  },
  alertButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  alertButtonTextPrimary: {
    color: '#fff',
  },
});

export default LocationPermissionScreen;