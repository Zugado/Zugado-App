// components/Header.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useSelector } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import { selectLocationAddress } from '../store/selector';
import NotificationIcon from './NotificationIcon';
import Geolocation from '@react-native-community/geolocation';
import DotLoader from './DotLoader';

const Header = ({ showSearch = true, navigation, isUrgentEnabled, setUrgentEnabled, searchQuery, setSearchQuery }) => {
  const locationAddress = useSelector(selectLocationAddress);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            {
              headers: {
                'User-Agent': 'ZugadoApp/1.0'
              }
            }
          );
          const data = await response.json();
          setCurrentLocation({
            city: data.address?.city || data.address?.town || data.address?.village || data.address?.state,
            postcode: data.address?.postcode || data.address?.pincode || data.address?.postal_code
          });
        } catch (error) {
          console.log('Error fetching location:', error);
        } finally {
          setIsLoadingLocation(false);
        }
      },
      (error) => {
        console.log('Error getting position:', error);
        setIsLoadingLocation(false);
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
    );
  }, []);
  
  return (
    <View style={styles.headerContainer}>
      {/* Row 1: Location, Logo & Icons */}
      <View style={styles.topRow}>
        <View style={styles.locationContainer}>
          <Image
            source={require('../assets/Icons/Location2.png')}
            style={styles.icon}
          />
          <View>
            {isLoadingLocation ? (
              <>
                <DotLoader color="#fff" size={4} />
                <DotLoader color="#888" size={3} />
              </>
            ) : (
              <>
                <Text style={styles.locationText}>
                  {currentLocation?.city || locationAddress?.city || locationAddress?.town || locationAddress?.village || locationAddress?.state || 'Unknown'}
                </Text>
                <Text style={styles.pincodeText}>
                  {currentLocation?.postcode || locationAddress?.postcode || locationAddress?.pincode || locationAddress?.postal_code || 'N/A'}
                </Text>
              </>
            )}
          </View>
        </View>

        <Image
          source={require('../assets/Icons/LogoSplash.png')}
          style={styles.logo}
        />

        <View style={styles.iconsContainer}>
          <TouchableOpacity
            onPress={() => navigation?.navigate('WishlistScreen')}
          >
            <Image
              source={require('../assets/Icons/Saved.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
          <View style={{marginLeft: 18}}><NotificationIcon color={"#fff"} /></View>
          
         
        </View>
      </View>

      {showSearch && (
        <View style={styles.searchRow}>
          <View style={styles.searchWrapper}>
            <View style={styles.searchSection}>
              <Feather name="search" style={styles.searchIcon} />
              <TextInput
                placeholder="Search Here..."
                placeholderTextColor="#888"
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>
          <TouchableOpacity
            style={[
              styles.jobButton,
              { backgroundColor: isUrgentEnabled ? '#000' : '#666' },
            ]}
            onPress={() => setUrgentEnabled(!isUrgentEnabled)}
            activeOpacity={0.8}
          >
            {isUrgentEnabled ? (
              <>
                <Text style={styles.jobText}>Urgent</Text>
                <Entypo name="flash" style={styles.jobIcon} />
              </>
            ) : (
              <>
                <Entypo name="flash" style={styles.jobIcon} />
                <Text style={styles.jobText}>Urgent</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#000',
    paddingHorizontal: 15,
    paddingTop: 0,
    paddingBottom: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  locationContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  pincodeText: {
    color: '#888',
    fontSize: 8,
  },
  logo: {
    flex: 1,
    resizeMode: 'contain',
    height: 30,
    marginTop: 6,
  },
  iconsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  icon: {
    width: 22, // unified icon size
    height: 22,
    resizeMode: 'contain',
  },
  
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 30,
    overflow: 'hidden',
  },
  searchSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
  },
  searchIcon: {
    color: '#000',
    fontSize: 20,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#000',
    paddingVertical: 10,
    fontSize: 14,
  },
  jobButton: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
    borderRadius: 25,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexShrink: 0,
    borderWidth: 0.1,
    borderColor: '#ffffff',
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 6,
  },
  jobIcon: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 5,
    color: '#000',
    fontSize: 16,
    // marginHorizontal: 5,
  },
  jobText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default Header;
